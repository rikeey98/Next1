'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Plus } from 'lucide-react'
import { completeOnboardingAction } from '@/app/(infp-onboarding)/actions'

const DEFAULT_ANCHORS = [
  '성장하는 사람',
  '건강한 사람',
  '따뜻한 사람',
]

export default function AnchorSetupForm() {
  const [anchors, setAnchors] = useState(DEFAULT_ANCHORS)
  const [newAnchor, setNewAnchor] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAdd = () => {
    const text = newAnchor.trim()
    if (!text || anchors.length >= 6) return
    setAnchors([...anchors, text])
    setNewAnchor('')
  }

  const handleRemove = (index: number) => {
    setAnchors(anchors.filter((_, i) => i !== index))
  }

  const handleEdit = (index: number, value: string) => {
    setAnchors(anchors.map((a, i) => (i === index ? value : a)))
  }

  const handleComplete = async () => {
    const validAnchors = anchors.filter((a) => a.trim())
    if (validAnchors.length === 0 || isSubmitting) return
    setIsSubmitting(true)

    try {
      await completeOnboardingAction(
        validAnchors.map((text, i) => ({ text, sort_order: i }))
      )
      // Server Action will handle redirect
    } catch (error) {
      console.error('Failed to complete onboarding:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">나의 정체성 앵커</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          어떤 사람이 되고 싶나요? 앵커를 설정해보세요.
        </p>
      </div>

      <div className="space-y-3">
        {anchors.map((anchor, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              value={anchor}
              onChange={(e) => handleEdit(i, e.target.value)}
              className="h-12"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(i)}
              className="shrink-0 text-muted-foreground hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {anchors.length < 6 && (
          <div className="flex items-center gap-2">
            <Input
              value={newAnchor}
              onChange={(e) => setNewAnchor(e.target.value)}
              placeholder="새 앵커 추가..."
              className="h-12"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAdd}
              disabled={!newAnchor.trim()}
              className="shrink-0 text-indigo-600"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <Button
        size="lg"
        onClick={handleComplete}
        disabled={anchors.filter((a) => a.trim()).length === 0 || isSubmitting}
        className="w-full bg-indigo-600 hover:bg-indigo-700"
      >
        {isSubmitting ? '설정 중...' : '완료'}
      </Button>
    </div>
  )
}
