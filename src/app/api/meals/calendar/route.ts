import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getLocalDateBoundsUTC, toLocalDateStr } from '@/lib/timezone'

// GET /api/meals/calendar?month=YYYY-MM
// 월간 날짜별 기록 개수 반환: { "2026-02-01": 3, "2026-02-05": 1, ... }
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('timezone')
    .eq('id', user.id)
    .single()
  const tz = profile?.timezone ?? 'Asia/Seoul'

  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month') // YYYY-MM

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: 'month parameter required (YYYY-MM)' }, { status: 400 })
  }

  const [year, mon] = month.split('-').map(Number)
  const lastDay = new Date(year, mon, 0).getDate()
  const firstStr = `${year}-${String(mon).padStart(2, '0')}-01`
  const lastStr = `${year}-${String(mon).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
  const { from } = getLocalDateBoundsUTC(firstStr, tz)
  const { to } = getLocalDateBoundsUTC(lastStr, tz)

  const { data, error } = await supabase
    .from('meal_entries')
    .select('recorded_at')
    .eq('user_id', user.id)
    .gte('recorded_at', from.toISOString())
    .lte('recorded_at', to.toISOString())

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 날짜별 카운트 (타임존 기준)
  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    const key = toLocalDateStr(new Date(row.recorded_at), tz)
    counts[key] = (counts[key] ?? 0) + 1
  }

  return NextResponse.json({ counts })
}
