'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle2, XCircle, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MicroAction } from '@/types/database'

interface MicroActionItemProps {
  action: MicroAction
}

const statusConfig = {
  pending: { icon: Play, label: '대기', color: 'text-muted-foreground' },
  running: { icon: Clock, label: '진행중', color: 'text-indigo-600' },
  paused: { icon: Clock, label: '일시정지', color: 'text-yellow-600' },
  completed: { icon: CheckCircle2, label: '완료', color: 'text-green-600' },
  abandoned: { icon: XCircle, label: '포기', color: 'text-red-400' },
}

export default function MicroActionItem({ action }: MicroActionItemProps) {
  const config = statusConfig[action.status]
  const Icon = config.icon
  const isClickable = action.status === 'pending' || action.status === 'paused'

  const content = (
    <div className={cn(
      'flex items-center gap-3 rounded-xl border bg-white p-4 transition-all',
      isClickable && 'cursor-pointer hover:border-indigo-200 hover:shadow-sm'
    )}>
      <Icon className={cn('h-5 w-5 shrink-0', config.color)} />
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-medium truncate',
          action.status === 'completed' && 'line-through text-muted-foreground',
          action.status === 'abandoned' && 'line-through text-muted-foreground'
        )}>
          {action.text}
        </p>
        <p className="text-xs text-muted-foreground">
          {Math.floor(action.duration_seconds / 60)}분
        </p>
      </div>
      {action.completion_rate != null && (
        <Badge variant="secondary" className="text-xs">
          {action.completion_rate}%
        </Badge>
      )}
    </div>
  )

  if (isClickable) {
    return <Link href={`/timer/${action.id}`}>{content}</Link>
  }

  return content
}
