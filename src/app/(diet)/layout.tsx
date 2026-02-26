import type { Metadata, Viewport } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  title: '이지 다이어트 노트',
  description: '간편하게 기록하는 나만의 식단 일지',
  manifest: '/manifest-diet.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '이지 다이어트 노트',
  },
}

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
