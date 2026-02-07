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
      <Card className="mb-6 border-dashed border-indigo-200 bg-indigo-50/50">
        <CardContent className="flex items-center gap-3 py-4">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          <div>
            <p className="text-sm font-medium text-indigo-700">첫 번째 행동이 아직 없어요</p>
            <Link href="/night" className="text-xs text-indigo-500 underline">
              밤 탭에서 설정하기
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
      <CardContent className="flex items-center gap-3 py-4">
        <Sparkles className="h-5 w-5 text-indigo-500" />
        <div>
          <p className="text-xs text-indigo-500">어제 밤에 정한 첫 행동</p>
          <p className="font-medium text-indigo-800">{text}</p>
        </div>
      </CardContent>
    </Card>
  )
}
