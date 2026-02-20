import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DietLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="relative mx-auto min-h-screen max-w-lg bg-white">
      {children}
    </div>
  )
}
