'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useTimerStore } from '@/store/timerStore'
import { formatTime } from '@/lib/infp/utils'
import { Clock } from 'lucide-react'

export default function TimerBar() {
  const { microActionId, microActionText, remainingSeconds, status, tick } = useTimerStore()

  useEffect(() => {
    if (status !== 'running') return

    const interval = setInterval(() => {
      tick()
    }, 1000)

    return () => clearInterval(interval)
  }, [status, tick])

  if (status === 'idle' || !microActionId) return null

  return (
    <Link href={`/infp/timer/${microActionId}`}>
      <div className="sticky top-14 z-40 border-b bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 transition-colors cursor-pointer">
        <div className="container mx-auto flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <Clock className="h-4 w-4 shrink-0 animate-pulse" />
            <span className="text-sm font-medium truncate">{microActionText}</span>
          </div>
          <div className="ml-4 flex items-center gap-2 shrink-0">
            <span className="text-sm font-mono font-semibold">
              {formatTime(remainingSeconds)}
            </span>
            {status === 'paused' && (
              <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full">
                일시정지
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
