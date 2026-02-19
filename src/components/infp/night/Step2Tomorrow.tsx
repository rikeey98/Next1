'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { insertMicroAction, upsertDailyState } from '@/lib/infp/actions'
import { getToday } from '@/lib/infp/utils'
import { toast } from 'sonner'

export default function Step2Tomorrow() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleComplete = async () => {
    if (!text.trim() || isSaving) return
    setIsSaving(true)

    try {
      const action = await insertMicroAction(text.trim())
      await upsertDailyState(getToday(), {
        tomorrow_first_action_text: text.trim(),
        tomorrow_first_action_id: action?.id ?? null,
      })

      toast.success('내일 첫 행동이 설정되었습니다')
      router.refresh()
      router.push('/infp/morning')
    } catch (error) {
      toast.error('저장에 실패했습니다')
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">내일 아침, 첫 번째 행동</h2>
        <p className="text-sm text-muted-foreground">
          내일 일어나자마자 2분 안에 할 수 있는 행동을 정해보세요
        </p>
      </div>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="예: 창문 열고 심호흡 3번 하기"
        className="h-12"
      />
      <Button
        onClick={handleComplete}
        disabled={!text.trim() || isSaving}
        className="w-full bg-cozy-lavender text-foreground hover:bg-cozy-lavender/80"
      >
        {isSaving ? '저장 중...' : '오늘 마무리'}
      </Button>
    </div>
  )
}
