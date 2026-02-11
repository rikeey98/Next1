'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { logMicroActionEvent, updateMicroAction } from '@/lib/infp/actions'
import { toast } from 'sonner'
import { useTimerStore } from '@/store/timerStore'
import TimerDisplay from './TimerDisplay'
import TimerControls from './TimerControls'
import CompletionDialog from './CompletionDialog'
import type { MicroAction } from '@/types/database'

interface TimerViewProps {
  microAction: MicroAction
}

export default function TimerView({ microAction }: TimerViewProps) {
  const router = useRouter()
  const {
    microActionId: storeMicroActionId,
    microActionText,
    totalSeconds: storeTotalSeconds,
    remainingSeconds: storeRemaining,
    status: storeStatus,
    startTimer: storeStartTimer,
    pauseTimer: storePauseTimer,
    resumeTimer: storeResumeTimer,
    resetTimer: storeResetTimer,
  } = useTimerStore()

  // Use store state if this is the active timer, otherwise use local initial state
  const isActiveTimer = storeMicroActionId === microAction.id
  const [status, setStatus] = useState<'idle' | 'running' | 'paused'>(
    isActiveTimer ? storeStatus : 'idle'
  )
  const [totalSeconds, setTotalSeconds] = useState(
    isActiveTimer ? storeTotalSeconds : microAction.duration_seconds
  )
  const [remaining, setRemaining] = useState(
    isActiveTimer ? storeRemaining : microAction.duration_seconds
  )
  const [showCompletion, setShowCompletion] = useState(false)

  // Sync local state with store when this is the active timer
  useEffect(() => {
    if (isActiveTimer) {
      setStatus(storeStatus)
      setRemaining(storeRemaining)
      setTotalSeconds(storeTotalSeconds)

      // Show completion dialog when timer reaches 0
      if (storeRemaining === 0 && storeStatus === 'idle') {
        setShowCompletion(true)
      }
    }
  }, [isActiveTimer, storeStatus, storeRemaining, storeTotalSeconds])

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
    storeStartTimer(microAction.id, microAction.text, microAction.duration_seconds)
    await logMicroActionEvent(microAction.id, 'start')
    await updateMicroAction(microAction.id, {
      status: 'running',
      started_at: new Date().toISOString(),
    })
  }

  const handlePause = async () => {
    setStatus('paused')
    storePauseTimer()
    await logMicroActionEvent(microAction.id, 'pause', { remaining })
  }

  const handleResume = async () => {
    setStatus('running')
    storeResumeTimer()
    await logMicroActionEvent(microAction.id, 'resume', { remaining })
  }

  const handleAbandon = async () => {
    setStatus('idle')
    storeResetTimer()
    await logMicroActionEvent(microAction.id, 'abandon', { remaining })
    await updateMicroAction(microAction.id, { status: 'abandoned' })
    router.push('/morning')
    router.refresh()
  }

  const handleComplete = async (rate: number) => {
    setShowCompletion(false)
    storeResetTimer()
    await logMicroActionEvent(microAction.id, 'complete', { completion_rate: rate })
    await updateMicroAction(microAction.id, {
      status: 'completed',
      completion_rate: rate,
      completed_at: new Date().toISOString(),
    })
    toast.success(`완료! ${rate}%의 성취감 🎉`)
    router.push('/morning')
    router.refresh()
  }

  const handleExtend = () => {
    setShowCompletion(false)
    const newTotal = totalSeconds + 120
    setTotalSeconds(newTotal)
    setRemaining(120)
    setStatus('running')
    storeStartTimer(microAction.id, microAction.text, newTotal)
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
