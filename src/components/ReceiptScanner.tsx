'use client'

import { useState, useRef, useCallback } from 'react'

interface ScanResult {
  items: Array<{
    name: string
    carbonKg: number
    category: string
  }>
  totalCarbon: number
  suggestions: string[]
}

export default function ReceiptScanner() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, etc.)')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Please upload an image under 10MB.')
      return
    }

    // show preview
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    
    setIsAnalyzing(true)
    setError(null)
    setResult(null)

    try {
      // convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      // call our API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      })

      if (!response.ok) throw new Error('Analysis failed')
      
      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.error('Analysis failed:', err)
      setError('Failed to analyze receipt. Please try again with a clearer image.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const resetScanner = () => {
    setResult(null)
    setPreviewUrl(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const categoryIcons: Record<string, string> = {
    'Food - Meat': 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    'Food - Dairy': 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
    'Food - Produce': 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    'Food - Grains': 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4',
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Scan Receipt</h2>
        <p className="text-gray-500 mt-1">
          Upload a receipt or bill to calculate its carbon footprint instantly
        </p>
      </div>

      {!result ? (
        <>
          {/* upload area */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer transition-all ${
              dragActive 
                ? 'border-eco-400 bg-eco-50 scale-[1.02]' 
                : 'border-gray-200 hover:border-eco-300 hover:bg-gray-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {previewUrl && isAnalyzing ? (
              <div className="space-y-4">
                <img 
                  src={previewUrl} 
                  alt="Receipt preview" 
                  className="max-h-48 mx-auto rounded-lg shadow-md"
                />
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin w-5 h-5 border-2 border-eco-500 border-t-transparent rounded-full"></div>
                  <span className="text-gray-600">Analyzing your receipt...</span>
                </div>
              </div>
            ) : (
              <>
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                  dragActive ? 'bg-eco-100' : 'bg-gray-100'
                }`}>
                  <svg className={`w-8 h-8 ${dragActive ? 'text-eco-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium mb-1">
                  {dragActive ? 'Drop your receipt here' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-gray-400">PNG, JPG, HEIC up to 10MB</p>
              </>
            )}
          </div>

          {/* error message */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-4 flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">Upload failed</p>
                <p className="text-sm mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* tips */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-medium text-gray-700 mb-3">Tips for best results</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-eco-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Make sure the receipt is flat and well-lit
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-eco-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Include all item names and quantities if possible
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-eco-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Works with grocery, restaurant, and utility bills
              </li>
            </ul>
          </div>
        </>
      ) : (
        /* results view */
        <div className="space-y-4">
          {/* summary card */}
          <div className="bg-gradient-to-br from-eco-500 to-eco-600 rounded-2xl p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-eco-100 text-sm">Total Carbon Footprint</p>
                <p className="text-4xl font-bold mt-1">{result.totalCarbon.toFixed(1)} kg</p>
                <p className="text-eco-100 text-sm mt-2">CO2 equivalent</p>
              </div>
              <div className="text-right">
                <p className="text-eco-100 text-sm">Equivalent to</p>
                <p className="text-xl font-semibold mt-1">{(result.totalCarbon * 4).toFixed(0)} km</p>
                <p className="text-eco-100 text-sm">driven by car</p>
              </div>
            </div>
          </div>

          {/* items breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Items Breakdown</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {result.items.map((item, idx) => (
                <div key={idx} className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={categoryIcons[item.category] || 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'} />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{item.carbonKg.toFixed(2)} kg</p>
                    <p className="text-xs text-gray-400">
                      {((item.carbonKg / result.totalCarbon) * 100).toFixed(0)}% of total
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* suggestions */}
          {result.suggestions.length > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <h4 className="font-medium text-amber-800">How to reduce your impact</h4>
              </div>
              <ul className="space-y-2">
                {result.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="text-sm text-amber-700 flex items-start gap-2">
                    <span className="text-amber-400">-</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* action buttons */}
          <div className="flex gap-3">
            <button 
              onClick={resetScanner}
              className="flex-1 py-3 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Scan Another
            </button>
            <button className="flex-1 py-3 rounded-xl text-sm font-medium bg-eco-500 text-white hover:bg-eco-600 transition-colors">
              Save to History
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
