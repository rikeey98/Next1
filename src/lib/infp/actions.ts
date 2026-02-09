import { createClient } from '@/lib/supabase/client'
import type { Json, MicroActionEventType, MicroActionStatus } from '@/types/database'

export async function logMicroActionEvent(
  microActionId: string,
  eventType: MicroActionEventType,
  meta: Record<string, Json> = {}
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('micro_action_events').insert({
    user_id: user.id,
    micro_action_id: microActionId,
    event_type: eventType,
    meta: meta as Json,
  })
}

export async function updateMicroAction(
  id: string,
  updates: {
    status?: MicroActionStatus
    completion_rate?: number
    started_at?: string
    completed_at?: string
    duration_seconds?: number
  }
) {
  const supabase = createClient()
  await supabase.from('micro_actions').update(updates).eq('id', id)
}

export async function upsertDailyState(
  date: string,
  updates: {
    selected_anchor_id?: string | null
    tomorrow_first_action_text?: string | null
    tomorrow_first_action_id?: string | null
  }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: existing } = await supabase
    .from('daily_state')
    .select('id')
    .eq('user_id', user.id)
    .eq('date', date)
    .single()

  if (existing) {
    await supabase.from('daily_state').update(updates).eq('id', existing.id)
  } else {
    await supabase.from('daily_state').insert({
      user_id: user.id,
      date,
      ...updates,
    })
  }
}

export async function upsertReflection(date: string, mostMe: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: existing } = await supabase
    .from('reflections')
    .select('id')
    .eq('user_id', user.id)
    .eq('date', date)
    .single()

  if (existing) {
    await supabase.from('reflections').update({ most_me: mostMe }).eq('id', existing.id)
  } else {
    await supabase.from('reflections').insert({
      user_id: user.id,
      date,
      most_me: mostMe,
    })
  }
}

export async function insertEnergyLog(level: number, note?: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('energy_logs').insert({
    user_id: user.id,
    level,
    note: note || null,
  })
}

export async function insertMicroAction(text: string, taskId?: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('micro_actions')
    .insert({
      user_id: user.id,
      text,
      task_id: taskId || null,
    })
    .select()
    .single()

  return data
}

export async function insertAnchors(anchors: { text: string; sort_order: number }[]) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('anchors').insert(
    anchors.map((a) => ({
      user_id: user.id,
      text: a.text,
      sort_order: a.sort_order,
    }))
  )
}

export async function completeOnboarding() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ onboarding_completed: true })
    .eq('id', user.id)
    .select()

  if (error) {
    console.error('Failed to update onboarding_completed:', error)
    throw error
  }

  console.log('Onboarding completed successfully:', data)
  return { success: true }
}
