import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { generateSuggestions, categorizeItem, estimateItemCarbon } from '@/lib/carbonCalculator'

// lazy init - only create client when needed
let openai: OpenAI | null = null

function getOpenAIClient() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return openai
}

// demo data for when API key isn't configured
const DEMO_RECEIPTS = [
  {
    items: [
      { name: 'Ground Beef 500g', carbonKg: 13.5, category: 'Food - Meat' },
      { name: 'Cheddar Cheese 200g', carbonKg: 2.7, category: 'Food - Dairy' },
      { name: 'Whole Milk 1L', carbonKg: 1.9, category: 'Food - Dairy' },
      { name: 'Sourdough Bread', carbonKg: 0.8, category: 'Food - Grains' },
      { name: 'Mixed Salad 300g', carbonKg: 0.12, category: 'Food - Produce' },
    ],
  },
  {
    items: [
      { name: 'Chicken Breast 1kg', carbonKg: 6.9, category: 'Food - Meat' },
      { name: 'Brown Rice 1kg', carbonKg: 2.7, category: 'Food - Grains' },
      { name: 'Broccoli 500g', carbonKg: 0.2, category: 'Food - Produce' },
      { name: 'Greek Yogurt 500g', carbonKg: 1.1, category: 'Food - Dairy' },
      { name: 'Bananas 1kg', carbonKg: 0.7, category: 'Food - Produce' },
    ],
  },
]

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()
    
    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    const client = getOpenAIClient()
    
    // demo mode - return realistic mock data
    if (!client) {
      // pick random demo receipt
      const demo = DEMO_RECEIPTS[Math.floor(Math.random() * DEMO_RECEIPTS.length)]
      const totalCarbon = demo.items.reduce((sum, item) => sum + item.carbonKg, 0)
      const suggestions = generateSuggestions(demo.items)
      
      // simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      return NextResponse.json({
        items: demo.items,
        totalCarbon: Math.round(totalCarbon * 100) / 100,
        suggestions,
      })
    }

    // real analysis with OpenAI Vision
    const response = await client.chat.completions.create({
      model: 'gpt-4o', // using gpt-4o for vision
      messages: [
        {
          role: 'system',
          content: `You are a carbon footprint analyst. Extract items from receipts and estimate their CO2 emissions.
          
Use these emission factors (kg CO2 per kg):
- Beef: 27, Lamb: 24, Pork: 12, Chicken: 6.9
- Cheese: 13.5, Milk: 1.9, Eggs: 4.8 (per dozen)
- Rice: 2.7, Bread: 0.8, Pasta: 1.2
- Vegetables: 0.4, Fruits: 0.5

Always return valid JSON only.`
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this receipt and extract items with carbon estimates.

Return JSON:
{
  "items": [{"name": "item", "carbonKg": number, "category": "Food - Meat|Food - Dairy|Food - Produce|Food - Grains|Food - Seafood|Food - Beverages|Transport|Utilities|Shopping|Other"}]
}

Be specific with quantities. Only return the JSON object, nothing else.`
            },
            {
              type: 'image_url',
              image_url: { url: image }
            }
          ]
        }
      ],
      max_tokens: 1500,
      temperature: 0.3, // lower temp for more consistent output
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('Empty response from AI')
    }

    // extract JSON from response (handle markdown code blocks)
    let jsonStr = content.trim()
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```$/g, '')
    }

    const result = JSON.parse(jsonStr)
    
    // validate and enhance items
    const items = result.items.map((item: any) => ({
      name: item.name || 'Unknown item',
      carbonKg: typeof item.carbonKg === 'number' ? item.carbonKg : estimateItemCarbon(item.name),
      category: item.category || categorizeItem(item.name),
    }))

    const totalCarbon = items.reduce((sum: number, item: any) => sum + item.carbonKg, 0)
    const suggestions = generateSuggestions(items)

    return NextResponse.json({
      items,
      totalCarbon: Math.round(totalCarbon * 100) / 100,
      suggestions,
    })

  } catch (error) {
    console.error('Receipt analysis error:', error)
    
    // return user-friendly error
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Analysis failed: ${message}` },
      { status: 500 }
    )
  }
}
