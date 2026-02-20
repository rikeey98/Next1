import Link from 'next/link'
import { CheckSquare, Sun, Sparkles, ExternalLink, Code2, Layers, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

type MvpStatus = 'live' | 'dev' | 'idea'

const mvps = [
  {
    id: 'todos',
    title: 'Todos',
    description: '심플한 할 일 관리 앱. 빠르게 할 일을 추가하고 완료하는 미니멀 투두.',
    icon: CheckSquare,
    href: '/todos',
    status: 'live' as MvpStatus,
    stack: ['Next.js', 'Supabase', 'Tailwind'],
    color: 'from-blue-500 to-cyan-500',
    iconBg: 'bg-blue-50 text-blue-600',
  },
  {
    id: 'infp-todo',
    title: 'INFP TODO',
    description: '2분으로 나를 되찾는 투두. 정체성 앵커 기반 마이크로 루틴으로 하루를 설계.',
    icon: Sun,
    href: '/infp/morning',
    status: 'live' as MvpStatus,
    stack: ['Next.js', 'Supabase', 'PWA'],
    color: 'from-indigo-500 to-purple-500',
    iconBg: 'bg-indigo-50 text-indigo-600',
  },
]

const statusConfig: Record<MvpStatus, { label: string; className: string }> = {
  live: {
    label: 'Live',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  dev: {
    label: 'Dev',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  idea: {
    label: 'Idea',
    className: 'bg-slate-100 text-slate-600 border-slate-200',
  },
}

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-slate-950 text-white">
      {/* Hero */}
      <div className="border-b border-slate-800 bg-slate-950">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Layers className="h-5 w-5 text-slate-400" />
                <span className="text-sm font-medium text-slate-400">MVP Launchpad</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  Next1
                </span>
              </h1>
              <p className="mt-2 text-slate-400">
                아이디어를 빠르게 실험하고 런칭하는 공간
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-slate-400">
                {mvps.filter(m => m.status === 'live').length} live
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MVP Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            Projects
          </h2>
          <span className="text-sm text-slate-500">{mvps.length} total</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mvps.map((mvp) => {
            const status = statusConfig[mvp.status]
            return (
              <div
                key={mvp.id}
                className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-6 transition-all hover:border-slate-700 hover:bg-slate-800/80"
              >
                {/* Gradient accent */}
                <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${mvp.color} opacity-60`} />

                <div className="flex items-start justify-between mb-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${mvp.iconBg}`}>
                    <mvp.icon className="h-5 w-5" />
                  </div>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{mvp.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-5 min-h-[3rem]">
                  {mvp.description}
                </p>

                {/* Stack tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {mvp.stack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 rounded-md bg-slate-800 border border-slate-700 px-2 py-0.5 text-xs text-slate-400"
                    >
                      <Code2 className="h-3 w-3" />
                      {tech}
                    </span>
                  ))}
                </div>

                <Link href={mvp.href}>
                  <Button
                    size="sm"
                    className={`w-full bg-gradient-to-r ${mvp.color} text-white border-0 hover:opacity-90 transition-opacity`}
                  >
                    <ExternalLink className="mr-2 h-3.5 w-3.5" />
                    열기
                  </Button>
                </Link>
              </div>
            )
          })}

          {/* Add New MVP card */}
          <Link href="/template" className="relative overflow-hidden rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-6 flex flex-col items-center justify-center text-center min-h-[240px] group hover:border-slate-600 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-500 mb-3 group-hover:bg-slate-700 transition-colors">
              <Plus className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-500 group-hover:text-slate-400 transition-colors">새 MVP 추가</p>
            <p className="text-xs text-slate-600 mt-1 font-mono">src/app/(새mvp)/</p>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-8 mt-4 border-t border-slate-800">
        <p className="text-center text-xs text-slate-600">
          Built with Next.js · TypeScript · Supabase · Tailwind CSS
        </p>
      </div>
    </main>
  )
}
