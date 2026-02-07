'use client'

import { Button } from '@/components/ui/button'
import { Play, Pause, X } from 'lucide-react'

interface TimerControlsProps {
  status: 'idle' | 'running' | 'paused'
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onAbandon: () => void
}

export default function TimerControls({ status, onStart, onPause, onResume, onAbandon }: TimerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {status === 'idle' && (
        <Button
          size="lg"
          onClick={onStart}
          className="h-14 w-14 rounded-full bg-indigo-600 hover:bg-indigo-700"
        >
          <Play className="h-6 w-6" />
        </Button>
      )}
      {status === 'running' && (
        <>
          <Button
            size="lg"
            variant="outline"
            onClick={onAbandon}
            className="h-12 w-12 rounded-full text-red-500 hover:text-red-600"
          >
            <X className="h-5 w-5" />
          </Button>
          <Button
            size="lg"
            onClick={onPause}
            className="h-14 w-14 rounded-full bg-indigo-600 hover:bg-indigo-700"
          >
            <Pause className="h-6 w-6" />
          </Button>
        </>
      )}
      {status === 'paused' && (
        <>
          <Button
            size="lg"
            variant="outline"
            onClick={onAbandon}
            className="h-12 w-12 rounded-full text-red-500 hover:text-red-600"
          >
            <X className="h-5 w-5" />
          </Button>
          <Button
            size="lg"
            onClick={onResume}
            className="h-14 w-14 rounded-full bg-indigo-600 hover:bg-indigo-700"
          >
            <Play className="h-6 w-6" />
          </Button>
        </>
      )}
    </div>
  )
}
