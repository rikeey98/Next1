'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { upsertDailyState } from '@/lib/infp/actions'
import { getToday } from '@/lib/infp/utils'
import { cn } from '@/lib/utils'
import type { Anchor } from '@/types/database'

interface AnchorChipsProps {
  anchors: Anchor[]
  selectedAnchorId: string | null
}

export default function AnchorChips({ anchors, selectedAnchorId }: AnchorChipsProps) {
  const router = useRouter()
  const [selected, setSelected] = useState(selectedAnchorId)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleSelect = async (anchorId: string) => {
    if (isUpdating) return
    setIsUpdating(true)
    const newSelected = selected === anchorId ? null : anchorId
    setSelected(newSelected)
    await upsertDailyState(getToday(), { selected_anchor_id: newSelected })
    setIsUpdating(false)
    router.refresh()
  }

  if (anchors.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        앵커가 없습니다. 설정에서 추가해주세요.
      </p>
    )
  }

  return (
    <div className="mb-6">
      <h2 className="mb-2 text-sm font-medium text-muted-foreground">오늘의 정체성</h2>
      <div className="flex flex-wrap gap-2">
        {anchors.map((anchor) => (
          <Badge
            key={anchor.id}
            variant={selected === anchor.id ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer px-3 py-1.5 text-sm transition-all',
              selected === anchor.id
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'hover:border-indigo-300 hover:text-indigo-600'
            )}
            onClick={() => handleSelect(anchor.id)}
          >
            {anchor.text}
          </Badge>
        ))}
      </div>
    </div>
  )
}
