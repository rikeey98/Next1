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

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_completed) {
    redirect('/onboarding')
  }

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-gradient-to-b from-indigo-50/50 to-white pb-20">
      <main className="px-4 pt-4">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
