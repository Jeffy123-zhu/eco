import { createClient } from '@supabase/supabase-js'

// these should be in env vars in production
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// only create client if we have credentials
// this allows the app to run in demo mode without supabase
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// types for our database tables
export interface UserProfile {
  id: string
  email: string
  created_at: string
  total_carbon_saved: number
}

export interface CarbonEntry {
  id: string
  user_id: string
  date: string
  category: string
  item_name: string
  carbon_kg: number
  created_at: string
}

export interface Challenge {
  id: string
  title: string
  description: string
  duration_days: number
  carbon_save_potential: number
}

// helper functions for database operations
export async function getUserEntries(userId: string): Promise<CarbonEntry[]> {
  if (!supabase) {
    console.warn('Supabase not configured, returning mock data')
    return []
  }
  
  const { data, error } = await supabase
    .from('carbon_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  
  if (error) {
    console.error('Error fetching entries:', error)
    return []
  }
  
  return data || []
}

export async function addCarbonEntry(entry: Omit<CarbonEntry, 'id' | 'created_at'>): Promise<boolean> {
  if (!supabase) {
    console.warn('Supabase not configured')
    return false
  }
  
  const { error } = await supabase
    .from('carbon_entries')
    .insert(entry)
  
  if (error) {
    console.error('Error adding entry:', error)
    return false
  }
  
  return true
}

// get user's carbon stats for a given month
export async function getMonthlyStats(userId: string, year: number, month: number) {
  if (!supabase) return null
  
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate = `${year}-${String(month + 1).padStart(2, '0')}-01`
  
  const { data, error } = await supabase
    .from('carbon_entries')
    .select('carbon_kg, category')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lt('date', endDate)
  
  if (error || !data) return null
  
  const total = data.reduce((sum, entry) => sum + entry.carbon_kg, 0)
  const byCategory = data.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + entry.carbon_kg
    return acc
  }, {} as Record<string, number>)
  
  return { total, byCategory }
}
