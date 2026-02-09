import type { Metadata } from 'next'
import './globals.css'
import AppHeader from '@/components/AppHeader'

export const metadata: Metadata = {
  title: 'Next1 - MVP Playground',
  description: '여러 MVP 아이디어를 빠르게 실험하는 공간',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        <AppHeader />
        {children}
      </body>
    </html>
  )
}
