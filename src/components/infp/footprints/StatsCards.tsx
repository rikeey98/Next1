import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, Target, CheckCircle, Sparkles } from 'lucide-react'
import type { Anchor } from '@/types/database'

interface StatsCardsProps {
  stats: {
    avgEnergy: string | null
    topAnchor: Anchor | undefined
    completedCount: number
    reflectionCount: number
  }
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const statItems = [
    {
      icon: TrendingUp,
      label: '이번 주 평균 에너지',
      value: stats.avgEnergy ? `⚡ ${stats.avgEnergy}` : '기록 없음',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      icon: Target,
      label: '가장 많이 선택한 앵커',
      value: stats.topAnchor?.text || '기록 없음',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      icon: CheckCircle,
      label: '이번 주 완료한 행동',
      value: `${stats.completedCount}개`,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: Sparkles,
      label: '작성한 회고',
      value: `${stats.reflectionCount}개`,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ]

  return (
    <div className="mb-6 grid grid-cols-2 gap-3">
      {statItems.map((item) => (
        <Card key={item.label} className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${item.bg}`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-sm font-semibold">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
