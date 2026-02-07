import { createClient } from '@/lib/supabase/server'
import { getToday, getYesterday } from './utils'

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return data
}

export async function getMorningData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const today = getToday()
  const yesterday = getYesterday()

  const [anchorsRes, dailyStateRes, actionsRes, yesterdayStateRes] = await Promise.all([
    supabase
      .from('anchors')
      .select('*')
      .eq('user_id', user.id)
      .is('archived_at', null)
      .order('sort_order'),
    supabase
      .from('daily_state')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single(),
    supabase
      .from('micro_actions')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', today + 'T00:00:00')
      .lt('created_at', today + 'T23:59:59.999')
      .order('created_at', { ascending: false }),
    supabase
      .from('daily_state')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', yesterday)
      .single(),
  ])

  return {
    anchors: anchorsRes.data ?? [],
    dailyState: dailyStateRes.data,
    todayActions: actionsRes.data ?? [],
    yesterdayState: yesterdayStateRes.data,
  }
}

export async function getWaveData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const today = getToday()

  const { data } = await supabase
    .from('energy_logs')
    .select('*')
    .eq('user_id', user.id)
    .gte('logged_at', today + 'T00:00:00')
    .order('logged_at', { ascending: false })

  return { energyLogs: data ?? [] }
}

export async function getNightData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const today = getToday()

  const [reflectionRes, dailyStateRes, actionsRes] = await Promise.all([
    supabase
      .from('reflections')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single(),
    supabase
      .from('daily_state')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single(),
    supabase
      .from('micro_actions')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', today + 'T00:00:00')
      .lt('created_at', today + 'T23:59:59.999')
      .eq('status', 'completed')
      .order('completed_at', { ascending: false }),
  ])

  return {
    reflection: reflectionRes.data,
    dailyState: dailyStateRes.data,
    completedActions: actionsRes.data ?? [],
  }
}

export async function getTimerData(microActionId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('micro_actions')
    .select('*')
    .eq('id', microActionId)
    .eq('user_id', user.id)
    .single()

  return data
}

export async function getUserAnchors() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('anchors')
    .select('*')
    .eq('user_id', user.id)
    .is('archived_at', null)
    .order('sort_order')

  return data ?? []
}
