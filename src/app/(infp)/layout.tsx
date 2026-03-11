import type { Metadata, Viewport } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BottomNav from '@/components/infp/BottomNav'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'
import PwaInstallBanner from '@/components/PwaInstallBanner'

export const viewport: Viewport = {
  themeColor: '#C88B9A',
}

export const metadata: Metadata = {
  title: '마음 한 걸음',
  description: 'INFP를 위한 따뜻한 할 일 관리 앱',
  manifest: '/manifest-infp.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '마음 한 걸음',
  },
}

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
    redirect('/infp/onboarding')
  }

  if (!profile.onboarding_completed) {
    console.log('[INFP Layout] Onboarding not completed, redirecting to /infp/onboarding')
    redirect('/infp/onboarding')
  }

  console.log('[INFP Layout] Onboarding completed, rendering page')

  return (
    <div className="infp-cozy relative mx-auto min-h-screen max-w-lg overflow-hidden bg-background pb-20">
      <ServiceWorkerRegister swPath="/infp/sw.js" scope="/infp/" />
      <PwaInstallBanner appName="마음한걸음" />
      <div className="infp-blob infp-blob-1" />
      <div className="infp-blob infp-blob-2" />
      <main className="relative z-10 px-4 pt-4">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
