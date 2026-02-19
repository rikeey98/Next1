import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'
import type { DailyState } from '@/types/database'

interface FirstActionCardProps {
  yesterdayState: DailyState | null
}

export default function FirstActionCard({ yesterdayState }: FirstActionCardProps) {
  const text = yesterdayState?.tomorrow_first_action_text

  if (!text) {
    return (
      <Card className="mb-6 rounded-2xl border-dashed border-secondary bg-secondary/20 shadow-cozy">
        <CardContent className="flex items-center gap-3 py-4">
          <Sparkles className="h-5 w-5 text-primary/60" />
          <div>
            <p className="text-sm font-medium text-primary">첫 번째 행동이 아직 없어요</p>
            <Link href="/infp/night" className="text-xs text-primary/70 underline">
              밤 탭에서 설정하기
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6 rounded-2xl border-secondary bg-gradient-to-r from-secondary/30 to-cozy-lavender/20 shadow-cozy">
      <CardContent className="flex items-center gap-3 py-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <div>
          <p className="text-xs text-primary/70">어제 밤에 정한 첫 행동</p>
          <p className="font-medium text-foreground">{text}</p>
        </div>
      </CardContent>
    </Card>
  )
}
