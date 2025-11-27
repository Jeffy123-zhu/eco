'use client'

import { useState } from 'react'
import Dashboard from '@/components/Dashboard'
import ReceiptScanner from '@/components/ReceiptScanner'
import ChallengeCard from '@/components/ChallengeCard'
import Leaderboard from '@/components/Leaderboard'
import Navbar from '@/components/Navbar'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scan' | 'challenges' | 'leaderboard'>('dashboard')

  // in production this would come from supabase
  const mockUserData = {
    totalCarbon: 127.5,
    weeklyData: [12.3, 18.1, 8.9, 14.2, 11.8, 9.5, 13.7],
    globalAvg: 150,
    monthlyTrend: [165, 158, 142, 138, 131, 127.5],
    categoryBreakdown: {
      'Food': 52,
      'Transport': 35,
      'Shopping': 18,
      'Utilities': 15,
      'Other': 7.5,
    }
  }

  const challenges = [
    {
      id: '1',
      title: 'Meatless Week',
      description: 'Go vegetarian for 7 days straight',
      progress: 5,
      total: 7,
      carbonSaved: 10.8,
      difficulty: 'medium' as const,
      participants: 1247,
    },
    {
      id: '2', 
      title: 'Public Transport Hero',
      description: 'Use public transport instead of car for 10 trips',
      progress: 7,
      total: 10,
      carbonSaved: 8.4,
      difficulty: 'easy' as const,
      participants: 892,
    },
    {
      id: '3',
      title: 'Zero Waste Weekend',
      description: 'Produce no landfill waste for an entire weekend',
      progress: 0,
      total: 2,
      carbonSaved: 0,
      difficulty: 'hard' as const,
      participants: 456,
    },
    {
      id: '4',
      title: 'Local Food Month',
      description: 'Buy only locally sourced food for 30 days',
      progress: 12,
      total: 30,
      carbonSaved: 5.2,
      difficulty: 'hard' as const,
      participants: 324,
    },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard userData={mockUserData} />
        )}
        
        {activeTab === 'scan' && (
          <ReceiptScanner />
        )}
        
        {activeTab === 'challenges' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Challenges
                </h2>
                <p className="text-gray-500 mt-1">
                  Complete challenges to reduce your footprint and earn badges
                </p>
              </div>
              <div className="flex items-center gap-2 bg-eco-100 text-eco-700 px-4 py-2 rounded-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium">24.4 kg saved</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenges.map((challenge) => (
                <ChallengeCard key={challenge.id} {...challenge} />
              ))}
            </div>

            {/* completed section */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Completed</h3>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-eco-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-eco-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Bike to Work Week</p>
                      <p className="text-sm text-gray-500">Completed Nov 15, 2024</p>
                    </div>
                  </div>
                  <span className="text-eco-600 font-medium">+12.5 kg saved</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard />
        )}
      </div>
    </main>
  )
}
