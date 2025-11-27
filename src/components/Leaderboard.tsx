'use client'

import { useState } from 'react'

interface LeaderboardUser {
  rank: number
  name: string
  avatar: string
  carbonSaved: number
  streak: number
  badges: number
  isCurrentUser?: boolean
}

export default function Leaderboard() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('month')

  const users: LeaderboardUser[] = [
    { rank: 1, name: 'Sarah M.', avatar: 'S', carbonSaved: 89.2, streak: 45, badges: 12 },
    { rank: 2, name: 'James K.', avatar: 'J', carbonSaved: 76.8, streak: 32, badges: 9 },
    { rank: 3, name: 'Emma L.', avatar: 'E', carbonSaved: 71.4, streak: 28, badges: 11 },
    { rank: 4, name: 'Michael R.', avatar: 'M', carbonSaved: 65.2, streak: 21, badges: 7 },
    { rank: 5, name: 'Alex Chen', avatar: 'A', carbonSaved: 58.9, streak: 12, badges: 5, isCurrentUser: true },
    { rank: 6, name: 'Lisa T.', avatar: 'L', carbonSaved: 52.1, streak: 18, badges: 6 },
    { rank: 7, name: 'David W.', avatar: 'D', carbonSaved: 48.7, streak: 14, badges: 4 },
    { rank: 8, name: 'Nina P.', avatar: 'N', carbonSaved: 45.3, streak: 9, badges: 5 },
  ]

  const avatarColors = [
    'from-purple-400 to-purple-600',
    'from-blue-400 to-blue-600',
    'from-pink-400 to-pink-600',
    'from-orange-400 to-orange-600',
    'from-cyan-400 to-cyan-600',
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Leaderboard</h2>
          <p className="text-gray-500 mt-1">See how you compare to other eco warriors</p>
        </div>

        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {(['week', 'month', 'all'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                timeframe === tf 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tf === 'all' ? 'All Time' : tf.charAt(0).toUpperCase() + tf.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* top 3 podium */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* 2nd place */}
        <div className="flex flex-col items-center pt-8">
          <div className="relative">
            <div className={`w-16 h-16 bg-gradient-to-br ${avatarColors[1]} rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
              {users[1].avatar}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-700">
              2
            </div>
          </div>
          <p className="font-medium text-gray-800 mt-3">{users[1].name}</p>
          <p className="text-sm text-eco-600 font-medium">{users[1].carbonSaved} kg</p>
        </div>

        {/* 1st place */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className={`w-20 h-20 bg-gradient-to-br ${avatarColors[0]} rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-yellow-400/30`}>
              {users[0].avatar}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-yellow-900">
              1
            </div>
          </div>
          <p className="font-semibold text-gray-800 mt-3">{users[0].name}</p>
          <p className="text-sm text-eco-600 font-bold">{users[0].carbonSaved} kg</p>
        </div>

        {/* 3rd place */}
        <div className="flex flex-col items-center pt-12">
          <div className="relative">
            <div className={`w-14 h-14 bg-gradient-to-br ${avatarColors[2]} rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg`}>
              {users[2].avatar}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
              3
            </div>
          </div>
          <p className="font-medium text-gray-800 mt-3">{users[2].name}</p>
          <p className="text-sm text-eco-600 font-medium">{users[2].carbonSaved} kg</p>
        </div>
      </div>

      {/* full list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="col-span-1">Rank</div>
          <div className="col-span-5">User</div>
          <div className="col-span-2 text-right">CO2 Saved</div>
          <div className="col-span-2 text-right">Streak</div>
          <div className="col-span-2 text-right">Badges</div>
        </div>
        
        {users.map((user, idx) => (
          <div 
            key={user.rank}
            className={`grid grid-cols-12 gap-4 px-6 py-4 items-center border-t border-gray-100 transition-colors ${
              user.isCurrentUser ? 'bg-eco-50' : 'hover:bg-gray-50'
            }`}
          >
            <div className="col-span-1">
              <span className={`font-semibold ${user.rank <= 3 ? 'text-eco-600' : 'text-gray-400'}`}>
                #{user.rank}
              </span>
            </div>
            <div className="col-span-5 flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} rounded-full flex items-center justify-center text-white font-medium`}>
                {user.avatar}
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {user.name}
                  {user.isCurrentUser && <span className="ml-2 text-xs text-eco-600">(You)</span>}
                </p>
              </div>
            </div>
            <div className="col-span-2 text-right font-semibold text-gray-800">
              {user.carbonSaved} kg
            </div>
            <div className="col-span-2 text-right text-gray-600">
              {user.streak} days
            </div>
            <div className="col-span-2 text-right text-gray-600">
              {user.badges}
            </div>
          </div>
        ))}
      </div>

      {/* your stats card */}
      <div className="bg-gradient-to-r from-eco-500 to-eco-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-eco-100 text-sm">Your Position</p>
            <p className="text-3xl font-bold mt-1">#5 of 1,247</p>
            <p className="text-eco-100 text-sm mt-2">Top 1% of all users</p>
          </div>
          <div className="text-right">
            <p className="text-eco-100 text-sm">To reach #4</p>
            <p className="text-2xl font-bold mt-1">6.3 kg more</p>
            <button className="mt-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
              View Tips
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
