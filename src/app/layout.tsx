import type { Metadata, Viewport } from 'next'
import './globals.css'
import AppHeader from '@/components/AppHeader'
import TimerBar from '@/components/TimerBar'
import { Toaster } from 'sonner'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#C88B9A',
}

export const metadata: Metadata = {
  title: 'Next1 - MVP Playground',
  description: '여러 MVP 아이디어를 빠르게 실험하는 공간',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '마음 한 걸음',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Lora:wght@400;500;600;700&family=IBM+Plex+Sans+KR:wght@300;400;500;600;700&family=Gowun+Batang:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        <AppHeader />
        <TimerBar />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
