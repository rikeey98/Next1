import { createClient } from '@/lib/supabase/server'
import DietApp from '@/components/diet/DietApp'
import type { MealEntry } from '@/components/diet/types'

export const dynamic = 'force-dynamic'

export default async function DietPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 오늘 기록 초기 로드
  const today = new Date()
  const from = new Date(today)
  from.setHours(0, 0, 0, 0)
  const to = new Date(today)
  to.setHours(23, 59, 59, 999)

  const { data: todayMeals } = await supabase
    .from('meal_entries')
    .select('*')
    .eq('user_id', user!.id)
    .gte('recorded_at', from.toISOString())
    .lte('recorded_at', to.toISOString())
    .order('recorded_at', { ascending: false })

  return <DietApp initialMeals={(todayMeals ?? []) as MealEntry[]} />
}
