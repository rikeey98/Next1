import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { timezone } = await request.json()

  if (!timezone || typeof timezone !== 'string') {
    return NextResponse.json({ error: 'timezone is required' }, { status: 400 })
  }

  // IANA 타임존 유효성 검증
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone })
  } catch {
    return NextResponse.json({ error: 'Invalid timezone' }, { status: 400 })
  }

  const { error } = await supabase
    .from('profiles')
    .update({ timezone })
    .eq('id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
