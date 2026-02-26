import { createClient } from '@/lib/supabase/server'
import DietApp from '@/components/diet/DietApp'
import type { MealEntry } from '@/components/diet/types'
import { getTodayLocalDateStr, getLocalDateBoundsUTC } from '@/lib/timezone'

export const dynamic = 'force-dynamic'

export default async function DietPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('timezone')
    .eq('id', user!.id)
    .single()
  const tz = profile?.timezone ?? 'Asia/Seoul'

  // 오늘 기록 초기 로드 (타임존 기준)
  const todayStr = getTodayLocalDateStr(tz)
  const { from, to } = getLocalDateBoundsUTC(todayStr, tz)

  const { data: todayMeals } = await supabase
    .from('meal_entries')
    .select('*')
    .eq('user_id', user!.id)
    .gte('recorded_at', from.toISOString())
    .lte('recorded_at', to.toISOString())
    .order('recorded_at', { ascending: false })

  return <DietApp initialMeals={(todayMeals ?? []) as MealEntry[]} />
}
