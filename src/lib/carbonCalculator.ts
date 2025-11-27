/**
 * Carbon emission factors and calculation utilities
 * 
 * Sources:
 * - EPA Greenhouse Gas Equivalencies Calculator
 * - Carbon Trust Product Footprint Database  
 * - Our World in Data - Environmental impacts of food
 * - DEFRA UK Government emission factors 2023
 */

// kg CO2e per kg of product (or per unit where specified)
export const EMISSION_FACTORS: Record<string, number> = {
  // meat & fish (per kg)
  'beef': 27.0,
  'lamb': 24.0,
  'pork': 12.1,
  'chicken': 6.9,
  'turkey': 5.3,
  'fish': 5.4,
  'salmon': 6.0,
  'tuna': 5.9,
  'shrimp': 11.8,
  
  // dairy (per kg or per liter)
  'cheese': 13.5,
  'butter': 9.0,
  'milk': 1.9,
  'yogurt': 2.2,
  'cream': 3.7,
  'eggs': 4.8, // per dozen
  
  // plant-based
  'tofu': 2.0,
  'beans': 0.8,
  'lentils': 0.9,
  'nuts': 0.3,
  
  // grains & carbs
  'rice': 2.7,
  'pasta': 1.2,
  'bread': 0.8,
  'cereal': 1.5,
  'flour': 0.7,
  
  // produce (per kg)
  'vegetables': 0.4,
  'fruits': 0.5,
  'potatoes': 0.3,
  'tomatoes': 1.4, // greenhouse grown
  'lettuce': 0.4,
  'onions': 0.3,
  'carrots': 0.3,
  'apples': 0.4,
  'bananas': 0.7,
  'oranges': 0.5,

  // beverages (per liter)
  'coffee': 8.0, // per kg of beans
  'tea': 1.5,
  'beer': 0.9,
  'wine': 1.3,
  'soda': 0.4,
  'juice': 0.8,
  
  // processed foods
  'chocolate': 4.5,
  'chips': 2.5,
  'pizza': 3.2, // frozen, per kg
  'ice_cream': 3.8,
  
  // transport (per km)
  'car_petrol': 0.21,
  'car_diesel': 0.17,
  'car_electric': 0.05,
  'bus': 0.089,
  'train': 0.041,
  'subway': 0.03,
  'flight_short': 0.255, // <1500km
  'flight_long': 0.195,  // >1500km
  'bike': 0,
  'walk': 0,
  
  // utilities
  'electricity': 0.42, // per kWh (US average)
  'natural_gas': 2.0,  // per therm
  'heating_oil': 2.5,  // per liter
  
  // household
  'clothing': 15.0,    // per item average
  'electronics': 50.0, // per item average
  'furniture': 100.0,  // per item average
}

// category keywords for auto-classification
export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Food - Meat': ['beef', 'steak', 'lamb', 'pork', 'bacon', 'ham', 'chicken', 'turkey', 'sausage', 'mince', 'ground'],
  'Food - Seafood': ['fish', 'salmon', 'tuna', 'shrimp', 'prawn', 'cod', 'tilapia', 'crab', 'lobster'],
  'Food - Dairy': ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'eggs', 'egg'],
  'Food - Produce': ['apple', 'banana', 'orange', 'tomato', 'potato', 'carrot', 'lettuce', 'onion', 'vegetable', 'fruit', 'salad'],
  'Food - Grains': ['bread', 'rice', 'pasta', 'cereal', 'flour', 'oat', 'wheat'],
  'Food - Beverages': ['coffee', 'tea', 'juice', 'soda', 'beer', 'wine', 'water'],
  'Transport': ['uber', 'lyft', 'taxi', 'gas', 'petrol', 'diesel', 'parking', 'toll', 'transit'],
  'Utilities': ['electric', 'power', 'gas bill', 'water bill', 'heating', 'energy'],
  'Shopping': ['shirt', 'pants', 'shoes', 'jacket', 'dress', 'clothing', 'clothes'],
}

export interface AnalyzedItem {
  name: string
  carbonKg: number
  category: string
  quantity?: number
  unit?: string
}

export interface AnalysisResult {
  items: AnalyzedItem[]
  totalCarbon: number
  suggestions: string[]
}

/**
 * Estimate carbon footprint for a single item
 */
export function estimateItemCarbon(itemName: string, quantity: number = 1): number {
  const lowerName = itemName.toLowerCase()
  
  // check each emission factor
  for (const [item, factor] of Object.entries(EMISSION_FACTORS)) {
    if (lowerName.includes(item)) {
      return factor * quantity
    }
  }
  
  // default for unknown items - rough estimate
  return 0.5 * quantity
}

/**
 * Categorize an item based on keywords
 */
export function categorizeItem(itemName: string): string {
  const lowerName = itemName.toLowerCase()
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => lowerName.includes(kw))) {
      return category
    }
  }
  
  return 'Other'
}

/**
 * Generate personalized suggestions based on items
 */
export function generateSuggestions(items: AnalyzedItem[]): string[] {
  const suggestions: string[] = []
  const categories = items.map(i => i.category)
  
  // check for high-impact categories
  if (categories.includes('Food - Meat')) {
    const meatItems = items.filter(i => i.category === 'Food - Meat')
    const meatCarbon = meatItems.reduce((sum, i) => sum + i.carbonKg, 0)
    
    if (meatCarbon > 10) {
      suggestions.push('Beef has the highest carbon footprint of any food. Swapping one beef meal per week for chicken or plant-based alternatives could save ~20kg CO2 monthly.')
    } else {
      suggestions.push('Consider trying "Meatless Mondays" - replacing meat with plant-based proteins one day a week can reduce your food footprint by 15%.')
    }
  }
  
  if (categories.includes('Food - Dairy')) {
    suggestions.push('Dairy alternatives like oat or almond milk produce 60-80% less emissions than cow\'s milk.')
  }
  
  if (categories.includes('Transport')) {
    suggestions.push('If possible, combining errands into fewer trips can significantly reduce transport emissions.')
  }
  
  // always add a general tip
  if (suggestions.length === 0) {
    suggestions.push('Buying local and seasonal produce reduces transport emissions and often tastes better too!')
  }
  
  // limit to 3 suggestions
  return suggestions.slice(0, 3)
}

/**
 * Calculate equivalencies for context
 */
export function calculateEquivalencies(carbonKg: number) {
  return {
    carKm: Math.round(carbonKg / 0.21),           // km driven
    flights: (carbonKg / 90).toFixed(1),          // short flights
    trees: Math.ceil(carbonKg / 21),              // trees needed to offset per year
    smartphones: Math.round(carbonKg / 0.07),     // smartphone charges
    lightbulbHours: Math.round(carbonKg / 0.01),  // LED bulb hours
  }
}
