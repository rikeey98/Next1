'use client'

import { Button } from '@/components/ui/button'
import { Play, Pause, X, Check } from 'lucide-react'

interface TimerControlsProps {
  status: 'idle' | 'running' | 'paused'
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onAbandon: () => void
  onComplete: () => void
}

export default function TimerControls({
  status,
  onStart,
  onPause,
  onResume,
  onAbandon,
  onComplete
}: TimerControlsProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* 메인 액션 버튼 */}
      <div className="flex items-center justify-center gap-4">
        {status === 'idle' && (
          <Button
            size="lg"
            onClick={onStart}
            className="h-20 w-20 rounded-full bg-indigo-600 hover:bg-indigo-700"
          >
            <Play className="h-8 w-8" />
          </Button>
        )}
        {status === 'running' && (
          <Button
            size="lg"
            onClick={onPause}
            className="h-20 w-20 rounded-full bg-indigo-600 hover:bg-indigo-700"
          >
            <Pause className="h-8 w-8" />
          </Button>
        )}
        {status === 'paused' && (
          <Button
            size="lg"
            onClick={onResume}
            className="h-20 w-20 rounded-full bg-indigo-600 hover:bg-indigo-700"
          >
            <Play className="h-8 w-8" />
          </Button>
        )}
      </div>

      {/* 서브 액션 버튼들 (진행 중이거나 일시정지일 때만 표시) */}
      {(status === 'running' || status === 'paused') && (
        <div className="flex items-center gap-3">
          <Button
            size="lg"
            variant="outline"
            onClick={onAbandon}
            className="h-12 px-6 rounded-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <X className="h-5 w-5 mr-2" />
            <span className="font-medium">취소</span>
          </Button>
          <Button
            size="lg"
            onClick={onComplete}
            className="h-12 px-6 rounded-full bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="h-5 w-5 mr-2" />
            <span className="font-medium">완료</span>
          </Button>
        </div>
      )}
    </div>
  )
}
