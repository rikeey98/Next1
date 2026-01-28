import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Next Landing - Modern Solutions for Your Business',
  description: 'Transform your business with our cutting-edge solutions. Fast, reliable, and scalable.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
