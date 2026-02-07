'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, ChevronDown, ChevronUp } from 'lucide-react'
import MicroActionItem from './MicroActionItem'
import type { MicroAction } from '@/types/database'

interface MicroActionListProps {
  actions: MicroAction[]
}

export default function MicroActionList({ actions }: MicroActionListProps) {
  const [expanded, setExpanded] = useState(false)
  const visibleActions = expanded ? actions : actions.slice(0, 3)
  const hasMore = actions.length > 3

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">
          오늘의 마이크로 행동 ({actions.length})
        </h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/add" className="gap-1 text-indigo-600">
            <Plus className="h-4 w-4" />
            추가
          </Link>
        </Button>
      </div>

      {actions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-indigo-200 bg-indigo-50/30 p-8 text-center">
          <p className="text-sm text-muted-foreground">아직 행동이 없어요</p>
          <Button variant="link" size="sm" asChild>
            <Link href="/add" className="text-indigo-600">
              첫 번째 2분 행동 추가하기
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {visibleActions.map((action) => (
            <MicroActionItem key={action.id} action={action} />
          ))}
          {hasMore && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>접기 <ChevronUp className="ml-1 h-4 w-4" /></>
              ) : (
                <>{actions.length - 3}개 더 보기 <ChevronDown className="ml-1 h-4 w-4" /></>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
