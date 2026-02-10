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
  const topAnchor = anchorsRes.data?.find(a => a.id === topAnchorId)

  // Combine daily records
  const dailyRecords = dailyStatesRes.data?.map(ds => {
    const reflection = reflectionsRes.data?.find(r => r.date === ds.date)
    const dayEnergy = energyLogsRes.data?.filter(e =>
      e.logged_at.startsWith(ds.date)
    )
    const dayActions = actionsRes.data?.filter(a =>
      a.created_at.startsWith(ds.date)
    )
    const anchor = anchorsRes.data?.find(a => a.id === ds.selected_anchor_id)

    return {
      date: ds.date,
      anchor,
      reflection: reflection?.most_me,
      energyLogs: dayEnergy ?? [],
      completedActions: dayActions ?? [],
    }
  }) ?? []

  // Prepare energy wave data for overlayed chart (last 7 days)
  const energyWaveData = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' })

    const dayLogs = energyLogsRes.data?.filter(e => e.logged_at.startsWith(dateStr)) ?? []
    const logs = dayLogs.map(log => {
      const logDate = new Date(log.logged_at)
      const kstTime = new Date(logDate.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
      return {
        time: kstTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        level: log.level,
        hour: kstTime.getHours(),
      }
    })

    energyWaveData.push({
      date: dateStr,
      logs,
    })
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
