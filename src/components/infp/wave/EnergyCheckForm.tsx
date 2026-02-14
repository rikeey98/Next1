'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { insertEnergyLog } from '@/lib/infp/actions'
import { toast } from 'sonner'
import EnergyLevelSelector from './EnergyLevelSelector'

export default function EnergyCheckForm() {
  const router = useRouter()
  const [level, setLevel] = useState<number | null>(null)
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!level || isSubmitting) return
    setIsSubmitting(true)
    try {
      await insertEnergyLog(level, note)
      setLevel(null)
      setNote('')
      toast.success('에너지가 기록되었습니다')
      router.refresh()
    } catch (error) {
      toast.error('기록에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium text-muted-foreground">지금 에너지는 어때요?</h2>
      <EnergyLevelSelector selected={level} onSelect={setLevel} />
      <Textarea
        placeholder="지금 기분이나 상태를 간단히 적어보세요 (선택)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        className="resize-none"
      />
      <Button
        onClick={handleSubmit}
        disabled={!level || isSubmitting}
        className="w-full bg-primary hover:bg-primary/90"
      >
        {isSubmitting ? '기록 중...' : '기록하기'}
      </Button>
    </div>
  )
}
