import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Reset onboarding_completed to false
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ onboarding_completed: false })
      .eq('id', user.id)

    if (profileError) {
      throw profileError
    }

    // Delete all existing anchors
    const { error: anchorsError } = await supabase
      .from('anchors')
      .delete()
      .eq('user_id', user.id)

    if (anchorsError) {
      throw anchorsError
    }

    return NextResponse.json({
      message: '온보딩이 리셋되었습니다. /onboarding으로 이동하세요.',
      success: true
    })
  } catch (error) {
    console.error('Failed to reset onboarding:', error)
    return NextResponse.json({
      error: 'Failed to reset onboarding',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
