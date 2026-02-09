import Link from 'next/link'
import { CheckSquare, Sun, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const mvps = [
  {
    id: 'todos',
    title: 'Todos',
    description: '심플한 할 일 관리 앱',
    icon: CheckSquare,
    href: '/todos',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'infp-todo',
    title: 'INFP TODO',
    description: '2분으로 나를 되찾는 투두 - 정체성 앵커 기반 마이크로 루틴',
    icon: Sun,
    href: '/morning',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  {
    id: 'coming-soon',
    title: 'More Coming Soon',
    description: '새로운 MVP 아이디어를 실험 중입니다',
    icon: Sparkles,
    href: '#',
    color: 'text-gray-400',
    bgColor: 'bg-gray-50',
    disabled: true,
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Next1
          </h1>
          <p className="text-xl text-muted-foreground">
            MVP Playground - 아이디어를 빠르게 실험하는 공간
          </p>
        </div>

        {/* MVP Cards */}
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mvps.map((mvp) => (
            <Card
              key={mvp.id}
              className={`transition-all hover:shadow-lg ${
                mvp.disabled ? 'opacity-60' : 'hover:scale-105'
              }`}
            >
              <CardHeader>
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${mvp.bgColor}`}
                >
                  <mvp.icon className={`h-6 w-6 ${mvp.color}`} />
                </div>
                <CardTitle className="text-xl">{mvp.title}</CardTitle>
                <CardDescription className="min-h-[3rem]">
                  {mvp.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mvp.disabled ? (
                  <Button disabled className="w-full" variant="outline">
                    Coming Soon
                  </Button>
                ) : (
                  <Link href={mvp.href}>
                    <Button className="w-full">시작하기</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>Built with Next.js 14, React 18, TypeScript, Tailwind CSS, Supabase</p>
        </div>
      </div>
    </main>
  )
}
