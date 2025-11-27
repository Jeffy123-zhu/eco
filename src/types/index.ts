// User related types
export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  createdAt: string
}

export interface UserStats {
  totalCarbon: number
  monthlyCarbon: number
  weeklyCarbon: number
  streak: number
  challengesCompleted: number
  rank: number
  totalUsers: number
}

// Carbon tracking types
export interface CarbonEntry {
  id: string
  userId: string
  date: string
  category: CarbonCategory
  itemName: string
  carbonKg: number
  source: 'receipt' | 'manual' | 'challenge'
  createdAt: string
}

export type CarbonCategory = 
  | 'Food - Meat'
  | 'Food - Seafood'
  | 'Food - Dairy'
  | 'Food - Produce'
  | 'Food - Grains'
  | 'Food - Beverages'
  | 'Transport'
  | 'Utilities'
  | 'Shopping'
  | 'Other'

// Receipt analysis types
export interface ReceiptItem {
  name: string
  carbonKg: number
  category: CarbonCategory
  quantity?: number
  unit?: string
}

export interface ReceiptAnalysis {
  items: ReceiptItem[]
  totalCarbon: number
  suggestions: string[]
  analyzedAt: string
}

// Challenge types
export interface Challenge {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  durationDays: number
  carbonSavePotential: number
  category: CarbonCategory | 'general'
  isActive: boolean
}

export interface UserChallenge {
  id: string
  challengeId: string
  userId: string
  startDate: string
  progress: number
  carbonSaved: number
  isCompleted: boolean
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  avatar: string
  carbonSaved: number
  streak: number
  badges: number
  isCurrentUser?: boolean
}

// API response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  status: 'success' | 'error'
}
