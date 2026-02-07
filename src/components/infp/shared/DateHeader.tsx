'use client'

import { formatKoreanDate, getToday } from '@/lib/infp/utils'

interface DateHeaderProps {
  title: string
  subtitle?: string
}

export default function DateHeader({ title, subtitle }: DateHeaderProps) {
  const today = getToday()

  return (
    <div className="mb-6">
      <p className="text-sm text-muted-foreground">{formatKoreanDate(today)}</p>
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      {subtitle && (
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  )
}
