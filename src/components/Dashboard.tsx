'use client'

import { useEffect, useRef, useState } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

interface DashboardProps {
  userData: {
    totalCarbon: number
    weeklyData: number[]
    globalAvg: number
    monthlyTrend: number[] // last 6 months
    categoryBreakdown: Record<string, number>
  }
}

export default function Dashboard({ userData }: DashboardProps) {
  const weeklyChartRef = useRef<HTMLCanvasElement>(null)
  const categoryChartRef = useRef<HTMLCanvasElement>(null)
  const trendChartRef = useRef<HTMLCanvasElement>(null)
  const weeklyChart = useRef<Chart | null>(null)
  const categoryChart = useRef<Chart | null>(null)
  const trendChart = useRef<Chart | null>(null)
  
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('week')

  // weekly line chart
  useEffect(() => {
    if (!weeklyChartRef.current) return
    if (weeklyChart.current) weeklyChart.current.destroy()

    const ctx = weeklyChartRef.current.getContext('2d')
    if (!ctx) return

    // gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, 200)
    gradient.addColorStop(0, 'rgba(34, 197, 94, 0.3)')
    gradient.addColorStop(1, 'rgba(34, 197, 94, 0.0)')

    weeklyChart.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Your Carbon (kg)',
          data: userData.weeklyData,
          borderColor: '#22c55e',
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#22c55e',
          pointBorderWidth: 2,
          pointHoverRadius: 7,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1f2937',
            titleColor: '#fff',
            bodyColor: '#d1d5db',
            padding: 12,
            displayColors: false,
            callbacks: {
              label: (ctx) => `${ctx.parsed.y.toFixed(1)} kg CO2`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: { color: '#9ca3af', font: { size: 11 } }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#9ca3af', font: { size: 11 } }
          }
        }
      }
    })

    return () => { weeklyChart.current?.destroy() }
  }, [userData.weeklyData])

  // category doughnut chart
  useEffect(() => {
    if (!categoryChartRef.current) return
    if (categoryChart.current) categoryChart.current.destroy()

    const ctx = categoryChartRef.current.getContext('2d')
    if (!ctx) return

    const categories = Object.keys(userData.categoryBreakdown)
    const values = Object.values(userData.categoryBreakdown)
    const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

    categoryChart.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categories,
        datasets: [{
          data: values,
          backgroundColor: colors.slice(0, categories.length),
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { 
              padding: 15, 
              usePointStyle: true, 
              pointStyle: 'circle',
              font: { size: 11 }
            }
          }
        }
      }
    })

    return () => { categoryChart.current?.destroy() }
  }, [userData.categoryBreakdown])

  // 6-month trend bar chart
  useEffect(() => {
    if (!trendChartRef.current) return
    if (trendChart.current) trendChart.current.destroy()

    const ctx = trendChartRef.current.getContext('2d')
    if (!ctx) return

    const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']

    trendChart.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [{
          label: 'Monthly CO2',
          data: userData.monthlyTrend,
          backgroundColor: userData.monthlyTrend.map((val, i) => 
            i === userData.monthlyTrend.length - 1 ? '#22c55e' : '#e5e7eb'
          ),
          borderRadius: 6,
          barThickness: 32,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: { color: '#9ca3af' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#9ca3af' }
          }
        }
      }
    })

    return () => { trendChart.current?.destroy() }
  }, [userData.monthlyTrend])

  const percentVsAvg = ((userData.totalCarbon / userData.globalAvg) * 100).toFixed(0)
  const isBelowAvg = userData.totalCarbon < userData.globalAvg
  const savedVsAvg = Math.max(0, userData.globalAvg - userData.totalCarbon).toFixed(1)
  
  // find highest emission day
  const maxDay = userData.weeklyData.indexOf(Math.max(...userData.weeklyData))
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const highestDay = dayNames[maxDay]

  // calculate streak (mock for now)
  const currentStreak = 12

  return (
    <div className="space-y-6">
      {/* header with greeting */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Good morning, Alex
          </h1>
          <p className="text-gray-500 mt-1">
            You're doing great this week. Keep it up!
          </p>
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {(['week', 'month', 'year'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                selectedTimeframe === tf 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tf.charAt(0).toUpperCase() + tf.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* main stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">This Month</p>
            <span className="w-8 h-8 bg-eco-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-eco-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {userData.totalCarbon} <span className="text-sm font-normal text-gray-400">kg</span>
          </p>
          <p className="text-xs text-eco-600 mt-1 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            12% less than last month
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">vs Global Avg</p>
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${isBelowAvg ? 'bg-eco-100' : 'bg-orange-100'}`}>
              <svg className={`w-4 h-4 ${isBelowAvg ? 'text-eco-600' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </span>
          </div>
          <p className={`text-2xl font-bold mt-2 ${isBelowAvg ? 'text-eco-600' : 'text-orange-500'}`}>
            {percentVsAvg}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {isBelowAvg ? `${savedVsAvg} kg saved vs average` : 'Room for improvement'}
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Trees to Offset</p>
            <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {Math.ceil(userData.totalCarbon / 21)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            ~21 kg CO2 absorbed per tree/year
          </p>
        </div>

        <div className="bg-gradient-to-br from-eco-500 to-eco-600 rounded-xl p-5 shadow-sm text-white">
          <div className="flex items-center justify-between">
            <p className="text-sm text-eco-100">Current Streak</p>
            <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" />
              </svg>
            </span>
          </div>
          <p className="text-2xl font-bold mt-2">{currentStreak} days</p>
          <p className="text-xs text-eco-100 mt-1">Keep logging to maintain!</p>
        </div>
      </div>

      {/* charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* weekly trend - takes 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Weekly Overview</h3>
              <p className="text-sm text-gray-500">Your daily carbon emissions</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Highest day</p>
              <p className="text-sm font-medium text-gray-700">{highestDay}</p>
            </div>
          </div>
          <div className="h-64">
            <canvas ref={weeklyChartRef}></canvas>
          </div>
        </div>

        {/* category breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-1">By Category</h3>
          <p className="text-sm text-gray-500 mb-4">Where your emissions come from</p>
          <div className="h-52">
            <canvas ref={categoryChartRef}></canvas>
          </div>
        </div>
      </div>

      {/* bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 6 month trend */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">6-Month Trend</h3>
              <p className="text-sm text-gray-500">Your progress over time</p>
            </div>
            <span className="text-xs bg-eco-100 text-eco-700 px-2 py-1 rounded-full">
              -18% overall
            </span>
          </div>
          <div className="h-48">
            <canvas ref={trendChartRef}></canvas>
          </div>
        </div>

        {/* AI insights */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-eco-500 rounded-md flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1z" />
              </svg>
            </div>
            <h3 className="font-semibold">AI Insights</h3>
          </div>
          <div className="space-y-3">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-sm text-gray-300">
                Your {highestDay} emissions are 40% higher than other days. Consider meal prepping on weekends.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-sm text-gray-300">
                Switching to plant-based milk could save you ~8 kg CO2 monthly.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-sm text-gray-300">
                You're in the top 15% of eco-conscious users this month!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
