'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { logMicroActionEvent, updateMicroAction } from '@/lib/infp/actions'
import TimerDisplay from './TimerDisplay'
import TimerControls from './TimerControls'
import CompletionDialog from './CompletionDialog'
import type { MicroAction } from '@/types/database'

interface TimerViewProps {
  microAction: MicroAction
}

export default function TimerView({ microAction }: TimerViewProps) {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'running' | 'paused'>('idle')
  const [totalSeconds, setTotalSeconds] = useState(microAction.duration_seconds)
  const [remaining, setRemaining] = useState(microAction.duration_seconds)
  const [showCompletion, setShowCompletion] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    clearTimer()
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearTimer()
          setStatus('idle')
          setShowCompletion(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [clearTimer])

  useEffect(() => {
    return clearTimer
  }, [clearTimer])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (status === 'running') {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [status])

  const handleStart = async () => {
    setStatus('running')
    startTimer()
    await logMicroActionEvent(microAction.id, 'start')
    await updateMicroAction(microAction.id, {
      status: 'running',
      started_at: new Date().toISOString(),
    })
  }

  const handlePause = async () => {
    setStatus('paused')
    clearTimer()
    await logMicroActionEvent(microAction.id, 'pause', { remaining })
  }

  const handleResume = async () => {
    setStatus('running')
    startTimer()
    await logMicroActionEvent(microAction.id, 'resume', { remaining })
  }

  const handleAbandon = async () => {
    clearTimer()
    setStatus('idle')
    await logMicroActionEvent(microAction.id, 'abandon', { remaining })
    await updateMicroAction(microAction.id, { status: 'abandoned' })
    router.push('/morning')
    router.refresh()
  }

  const handleComplete = async (rate: number) => {
    setShowCompletion(false)
    await logMicroActionEvent(microAction.id, 'complete', { completion_rate: rate })
    await updateMicroAction(microAction.id, {
      status: 'completed',
      completion_rate: rate,
      completed_at: new Date().toISOString(),
    })
    router.push('/morning')
    router.refresh()
  }

  const handleExtend = () => {
    setShowCompletion(false)
    const newTotal = totalSeconds + 120
    setTotalSeconds(newTotal)
    setRemaining(120)
    setStatus('running')
    startTimer()
    logMicroActionEvent(microAction.id, 'extend', { additional_seconds: 120 })
    updateMicroAction(microAction.id, { duration_seconds: newTotal })
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-8">
      <div className="text-center">
        <h1 className="text-lg font-semibold">{microAction.text}</h1>
        <p className="text-sm text-muted-foreground">
          {Math.floor(totalSeconds / 60)}분 타이머
        </p>
      </div>

      <TimerDisplay remainingSeconds={remaining} totalSeconds={totalSeconds} />
      <TimerControls
        status={status}
        onStart={handleStart}
        onPause={handlePause}
        onResume={handleResume}
        onAbandon={handleAbandon}
      />

      <CompletionDialog
        open={showCompletion}
        onComplete={handleComplete}
        onExtend={handleExtend}
      />
    </div>
  )
}
