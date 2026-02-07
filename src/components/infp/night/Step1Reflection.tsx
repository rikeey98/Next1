'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { upsertReflection } from '@/lib/infp/actions'
import { getToday } from '@/lib/infp/utils'

interface Step1ReflectionProps {
  initialText: string
  onNext: () => void
}

export default function Step1Reflection({ initialText, onNext }: Step1ReflectionProps) {
  const router = useRouter()
  const [text, setText] = useState(initialText)
  const [isSaving, setIsSaving] = useState(false)
  const maxLen = 140

  const handleSave = async () => {
    if (!text.trim() || isSaving) return
    setIsSaving(true)
    await upsertReflection(getToday(), text.trim())
    router.refresh()
    setIsSaving(false)
    onNext()
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">오늘 가장 &apos;나다웠던&apos; 순간</h2>
        <p className="text-sm text-muted-foreground">오늘 하루를 돌아보며 적어보세요</p>
      </div>
      <div className="relative">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxLen))}
          placeholder="예: 아침에 5분 명상을 했을 때 마음이 고요해지는 걸 느꼈다"
          rows={4}
          className="resize-none"
        />
        <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
          {text.length}/{maxLen}
        </span>
      </div>
      <Button
        onClick={handleSave}
        disabled={!text.trim() || isSaving}
        className="w-full bg-indigo-600 hover:bg-indigo-700"
      >
        {isSaving ? '저장 중...' : '다음'}
      </Button>
    </div>
  )
}
