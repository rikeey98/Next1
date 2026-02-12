import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Check if profile exists, if not create it
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single()

      if (profileError || !profile) {
        // Profile doesn't exist, create it
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ id: data.user.id })

        if (insertError) {
          console.error('Error creating profile:', insertError)
          // Continue anyway, profile might be created by trigger
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return to login page if there's an error
  return NextResponse.redirect(`${origin}/login`)
}
