'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil, Check, X, Plus, Trash2 } from 'lucide-react'
import { upsertDailyState } from '@/lib/infp/actions'
import { getToday } from '@/lib/infp/utils'
import { cn } from '@/lib/utils'
import type { Anchor } from '@/types/database'

interface AnchorChipsProps {
  anchors: Anchor[]
  selectedAnchorId: string | null
}

export default function AnchorChips({ anchors: initialAnchors, selectedAnchorId }: AnchorChipsProps) {
  const router = useRouter()
  const [anchors, setAnchors] = useState(initialAnchors)
  const [selected, setSelected] = useState(selectedAnchorId)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [newAnchorText, setNewAnchorText] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleSelect = async (anchorId: string) => {
    if (isUpdating || isEditMode) return
    setIsUpdating(true)
    const newSelected = selected === anchorId ? null : anchorId
    setSelected(newSelected)
    await upsertDailyState(getToday(), { selected_anchor_id: newSelected })
    setIsUpdating(false)
    router.refresh()
  }

  const handleStartEdit = (anchor: Anchor) => {
    setEditingId(anchor.id)
    setEditText(anchor.text)
  }

  const handleSaveEdit = async (id: string) => {
    if (!editText.trim()) return

    const response = await fetch('/api/anchors', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, text: editText }),
    })

    if (response.ok) {
      setAnchors(anchors.map(a => a.id === id ? { ...a, text: editText } : a))
      setEditingId(null)
      setEditText('')
      router.refresh()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('이 앵커를 삭제하시겠습니까?')) return

    const response = await fetch('/api/anchors', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (response.ok) {
      setAnchors(anchors.filter(a => a.id !== id))
      if (selected === id) setSelected(null)
      router.refresh()
    }
  }

  const handleAdd = async () => {
    if (!newAnchorText.trim()) return

    const response = await fetch('/api/anchors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newAnchorText }),
    })

    if (response.ok) {
      const data = await response.json()
      setAnchors([...anchors, data.anchor])
      setNewAnchorText('')
      setIsAdding(false)
      router.refresh()
    }
  }

  if (anchors.length === 0 && !isEditMode) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-muted-foreground">오늘의 정체성</h2>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditMode(true)}
            className="h-6 px-2 text-xs text-indigo-600"
          >
            <Plus className="h-3 w-3 mr-1" />
            추가
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">앵커를 추가해주세요.</p>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium text-muted-foreground">오늘의 정체성</h2>
        {!isEditMode ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditMode(true)}
            className="h-6 px-2 text-xs text-indigo-600"
          >
            <Pencil className="h-3 w-3 mr-1" />
            수정
          </Button>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setIsEditMode(false)
              setEditingId(null)
              setIsAdding(false)
              setNewAnchorText('')
            }}
            className="h-6 px-2 text-xs text-green-600"
          >
            <Check className="h-3 w-3 mr-1" />
            완료
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {!isEditMode ? (
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
        ) : (
          <>
            {anchors.map((anchor) => (
              <div key={anchor.id} className="flex items-center gap-2 rounded-lg border bg-white p-2">
                {editingId === anchor.id ? (
                  <>
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="h-8 flex-1 text-sm"
                      autoFocus
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleSaveEdit(anchor.id)}
                      className="h-8 w-8 shrink-0 text-green-600"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(null)
                        setEditText('')
                      }}
                      className="h-8 w-8 shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm">{anchor.text}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleStartEdit(anchor)}
                      className="h-8 w-8 shrink-0 text-indigo-600"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(anchor.id)}
                      className="h-8 w-8 shrink-0 text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            ))}

            {isAdding ? (
              <div className="flex items-center gap-2 rounded-lg border border-dashed border-indigo-300 bg-white p-2">
                <Input
                  value={newAnchorText}
                  onChange={(e) => setNewAnchorText(e.target.value)}
                  placeholder="새 앵커 입력..."
                  className="h-8 flex-1 text-sm"
                  autoFocus
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleAdd}
                  className="h-8 w-8 shrink-0 text-green-600"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setIsAdding(false)
                    setNewAnchorText('')
                  }}
                  className="h-8 w-8 shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setIsAdding(true)}
                variant="outline"
                size="sm"
                className="w-full border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50"
              >
                <Plus className="mr-2 h-3 w-3" />
                새 앵커 추가
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
