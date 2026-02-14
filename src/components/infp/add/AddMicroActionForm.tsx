'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { insertMicroAction } from '@/lib/infp/actions'

export default function AddMicroActionForm() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!text.trim() || isSubmitting) return
    setIsSubmitting(true)
    await insertMicroAction(text.trim())
    router.push('/morning')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">2분 행동 추가</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          2분 안에 할 수 있는 작은 행동을 적어보세요
        </p>
      </div>

      <div className="space-y-4">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="예: 책상 정리하기, 물 한 잔 마시기"
          className="h-12"
          autoFocus
        />
        <Button
          onClick={handleSubmit}
          disabled={!text.trim() || isSubmitting}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isSubmitting ? '저장 중...' : '추가하기'}
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => router.back()}
        >
          취소
        </Button>
      </div>
    </div>
  )
}
