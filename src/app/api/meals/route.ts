import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const range = searchParams.get('range') // 'today' | 'week' | 'month'
  const date = searchParams.get('date') // YYYY-MM-DD

  const baseDate = date ? new Date(date) : new Date()

  let from: Date
  let to: Date

  if (range === 'week') {
    // 해당 날짜가 속한 주의 월~일
    const day = baseDate.getDay() // 0=일, 1=월
    const mondayOffset = day === 0 ? -6 : 1 - day
    from = new Date(baseDate)
    from.setDate(baseDate.getDate() + mondayOffset)
    from.setHours(0, 0, 0, 0)
    to = new Date(from)
    to.setDate(from.getDate() + 6)
    to.setHours(23, 59, 59, 999)
  } else if (range === 'month') {
    from = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1)
    to = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0, 23, 59, 59, 999)
  } else {
    // today (default)
    from = new Date(baseDate)
    from.setHours(0, 0, 0, 0)
    to = new Date(baseDate)
    to.setHours(23, 59, 59, 999)
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
