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
    <div className="infp-cozy relative mx-auto min-h-screen max-w-lg overflow-hidden bg-background">
      <div className="infp-blob infp-blob-1" />
      <div className="infp-blob infp-blob-2" />
      <main className="relative z-10 px-4 pt-8">
        {children}
      </main>
    </div>
  )
}
