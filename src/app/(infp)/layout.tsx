import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BottomNav from '@/components/infp/BottomNav'

export default async function InfpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  console.log('[INFP Layout] Checking profile for user:', user.id)

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .maybeSingle()

  console.log('[INFP Layout] Profile:', profile, 'Error:', error)

  // If profile doesn't exist, create it
  if (!profile) {
    console.log('[INFP Layout] Profile not found, creating...')
    await supabase
      .from('profiles')
      .insert({ id: user.id, onboarding_completed: false })
    redirect('/onboarding')
  }

  if (!profile.onboarding_completed) {
    console.log('[INFP Layout] Onboarding not completed, redirecting to /onboarding')
    redirect('/onboarding')
  }

  console.log('[INFP Layout] Onboarding completed, rendering page')

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-gradient-to-b from-indigo-50/50 to-white pb-20">
      <main className="px-4 pt-4">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
