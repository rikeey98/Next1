import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/meals/calendar?month=YYYY-MM
// 월간 날짜별 기록 개수 반환: { "2026-02-01": 3, "2026-02-05": 1, ... }
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month') // YYYY-MM

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: 'month parameter required (YYYY-MM)' }, { status: 400 })
  }

  const [year, mon] = month.split('-').map(Number)
  const from = new Date(year, mon - 1, 1)
  const to = new Date(year, mon, 0, 23, 59, 59, 999)

  const { data, error } = await supabase
    .from('meal_entries')
    .select('recorded_at')
    .eq('user_id', user.id)
    .gte('recorded_at', from.toISOString())
    .lte('recorded_at', to.toISOString())

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 날짜별 카운트
  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    const d = new Date(row.recorded_at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    counts[key] = (counts[key] ?? 0) + 1
  }

  return NextResponse.json({ counts })
}
