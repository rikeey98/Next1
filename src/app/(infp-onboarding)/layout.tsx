import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-gradient-to-b from-indigo-50/50 to-white">
      <main className="px-4 pt-8">
        {children}
      </main>
    </div>
  )
}
