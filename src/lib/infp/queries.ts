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

export async function getFootprintsData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const today = getToday()
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const sevenDaysAgoStr = sevenDaysAgo.toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' })

  // Get last 30 days of daily states with reflections
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const thirtyDaysAgoStr = thirtyDaysAgo.toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' })

  const [dailyStatesRes, reflectionsRes, energyLogsRes, anchorsRes, actionsRes] = await Promise.all([
    supabase
      .from('daily_state')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', thirtyDaysAgoStr)
      .order('date', { ascending: false }),
    supabase
      .from('reflections')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', thirtyDaysAgoStr)
      .order('date', { ascending: false }),
    supabase
      .from('energy_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('logged_at', sevenDaysAgoStr + 'T00:00:00')
      .order('logged_at', { ascending: false }),
    supabase
      .from('anchors')
      .select('*')
      .eq('user_id', user.id)
      .is('archived_at', null),
    supabase
      .from('micro_actions')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', sevenDaysAgoStr + 'T00:00:00')
      .eq('status', 'completed'),
  ])

  // O(1) 조회를 위한 Map 인덱싱
  const reflectionsByDate = new Map(reflectionsRes.data?.map(r => [r.date, r]))
  const anchorsById = new Map(anchorsRes.data?.map(a => [a.id, a]))

  const energyByDate = new Map<string, NonNullable<typeof energyLogsRes.data>>()
  for (const e of energyLogsRes.data ?? []) {
    const date = e.logged_at.slice(0, 10)
    const bucket = energyByDate.get(date)
    if (bucket) bucket.push(e)
    else energyByDate.set(date, [e])
  }

  const actionsByDate = new Map<string, NonNullable<typeof actionsRes.data>>()
  for (const a of actionsRes.data ?? []) {
    const date = a.created_at.slice(0, 10)
    const bucket = actionsByDate.get(date)
    if (bucket) bucket.push(a)
    else actionsByDate.set(date, [a])
  }

  // Calculate stats
  const avgEnergy = energyLogsRes.data?.length
    ? (energyLogsRes.data.reduce((sum, log) => sum + log.level, 0) / energyLogsRes.data.length).toFixed(1)
    : null

  const anchorCounts = dailyStatesRes.data?.reduce((acc, ds) => {
    if (ds.selected_anchor_id) {
      acc[ds.selected_anchor_id] = (acc[ds.selected_anchor_id] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>) ?? {}

  const topAnchorId = Object.entries(anchorCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
  const topAnchor = topAnchorId ? anchorsById.get(topAnchorId) : undefined

  // Combine daily records — O(n) (Map 조회 O(1))
  const dailyRecords = dailyStatesRes.data?.map(ds => ({
    date: ds.date,
    anchor: ds.selected_anchor_id ? anchorsById.get(ds.selected_anchor_id) : undefined,
    reflection: reflectionsByDate.get(ds.date)?.most_me,
    energyLogs: energyByDate.get(ds.date) ?? [],
    completedActions: actionsByDate.get(ds.date) ?? [],
  })) ?? []

  // Prepare energy wave data for overlayed chart (last 7 days) — O(n) (Map 조회 O(1))
  const energyWaveData = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' })

    const dayLogs = (energyByDate.get(dateStr) ?? []).map(log => {
      const logDate = new Date(log.logged_at)
      const kstTime = new Date(logDate.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
      return {
        time: kstTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        level: log.level,
        hour: kstTime.getHours(),
      }
    })

    energyWaveData.push({ date: dateStr, logs: dayLogs })
  }

  return {
    stats: {
      avgEnergy,
      topAnchor,
      completedCount: actionsRes.data?.length ?? 0,
      reflectionCount: reflectionsRes.data?.length ?? 0,
    },
    dailyRecords,
    energyWaveData,
  }
}
