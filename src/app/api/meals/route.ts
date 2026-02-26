import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getTodayLocalDateStr, toLocalDateStr, getLocalDateBoundsUTC } from '@/lib/timezone'

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
  const range = searchParams.get('range') // 'today' | 'week' | 'month'
  const date = searchParams.get('date') // YYYY-MM-DD

  const baseDateStr = date ?? getTodayLocalDateStr(tz)

  let from: Date
  let to: Date

  if (range === 'week') {
    // 해당 날짜가 속한 주의 월~일 (타임존 기준)
    const [y, m, d] = baseDateStr.split('-').map(Number)
    const dayOfWeek = new Date(Date.UTC(y, m - 1, d)).getUTCDay() // 0=일, 1=월
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    const mondayDate = new Date(Date.UTC(y, m - 1, d + mondayOffset))
    const sundayDate = new Date(Date.UTC(y, m - 1, d + mondayOffset + 6))
    const mondayStr = toLocalDateStr(mondayDate, tz)
    const sundayStr = toLocalDateStr(sundayDate, tz)
    from = getLocalDateBoundsUTC(mondayStr, tz).from
    to = getLocalDateBoundsUTC(sundayStr, tz).to
  } else if (range === 'month') {
    const [y, m] = baseDateStr.split('-').map(Number)
    const lastDay = new Date(y, m, 0).getDate()
    const firstStr = `${y}-${String(m).padStart(2, '0')}-01`
    const lastStr = `${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
    from = getLocalDateBoundsUTC(firstStr, tz).from
    to = getLocalDateBoundsUTC(lastStr, tz).to
  } else {
    // today (default)
    const bounds = getLocalDateBoundsUTC(baseDateStr, tz)
    from = bounds.from
    to = bounds.to
  }

  const { data, error } = await supabase
    .from('meal_entries')
    .select('*')
    .eq('user_id', user.id)
    .gte('recorded_at', from.toISOString())
    .lte('recorded_at', to.toISOString())
    .order('recorded_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ meals: data })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('meal_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: '삭제에 실패했습니다.' }, { status: 500 })
  }
}
