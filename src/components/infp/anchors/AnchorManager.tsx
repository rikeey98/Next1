'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react'
import type { Anchor } from '@/types/database'

interface AnchorManagerProps {
  anchors: Anchor[]
}

export default function AnchorManager({ anchors: initialAnchors }: AnchorManagerProps) {
  const router = useRouter()
  const [anchors, setAnchors] = useState(initialAnchors)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [newAnchorText, setNewAnchorText] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleStartEdit = (anchor: Anchor) => {
    setEditingId(anchor.id)
    setEditText(anchor.text)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditText('')
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

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {anchors.map((anchor) => (
          <Card key={anchor.id} className="rounded-2xl shadow-cozy">
            <CardContent className="flex items-center gap-3 p-4">
              {editingId === anchor.id ? (
                <>
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1"
                    autoFocus
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleSaveEdit(anchor.id)}
                    className="shrink-0 text-cozy-sage hover:text-cozy-sage/80"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleCancelEdit}
                    className="shrink-0 text-muted-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <p className="flex-1 text-sm font-medium">{anchor.text}</p>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleStartEdit(anchor)}
                    className="shrink-0 text-primary hover:text-primary/80"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(anchor.id)}
                    className="shrink-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdding ? (
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Input
              value={newAnchorText}
              onChange={(e) => setNewAnchorText(e.target.value)}
              placeholder="새 앵커 입력..."
              className="flex-1"
              autoFocus
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={handleAdd}
              className="shrink-0 text-cozy-sage hover:text-cozy-sage/80"
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
              className="shrink-0 text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => setIsAdding(true)}
          variant="outline"
          className="w-full border-dashed border-secondary text-primary hover:bg-secondary/30"
        >
          <Plus className="mr-2 h-4 w-4" />
          새 앵커 추가
        </Button>
      )}
    </div>
  )
}
