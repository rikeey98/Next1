'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, Heart, Sparkles } from 'lucide-react'

const features = [
  {
    icon: Clock,
    title: '2분이면 충분해요',
    description: '작은 행동이 큰 변화를 만듭니다',
  },
  {
    icon: Heart,
    title: '나다운 하루',
    description: '정체성 앵커로 매일 나를 되찾아요',
  },
  {
    icon: Sparkles,
    title: '아침-파도-밤',
    description: '하루의 리듬에 맞춘 마이크로 루틴',
  },
]

export default function OnboardingView() {
  const router = useRouter()

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center space-y-8">
      <div className="text-center">
        <h1 className="font-heading text-3xl font-bold bg-gradient-to-r from-primary to-cozy-lavender bg-clip-text text-transparent">
          INFP TODO
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          2분으로 나를 되찾는 투두
        </p>
      </div>

      <div className="w-full space-y-3">
        {features.map((feature) => (
          <Card key={feature.title} className="rounded-2xl border-secondary shadow-cozy">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/30">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{feature.title}</p>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        size="lg"
        className="w-full bg-primary hover:bg-primary/90 shadow-cozy-lg"
        onClick={() => router.push('/anchor-setup')}
      >
        시작하기
      </Button>
    </div>
  )
}
