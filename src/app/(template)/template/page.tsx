export const dynamic = 'force-dynamic'

const steps = [
  {
    number: '01',
    title: '폴더 및 파일 생성',
    description: '새 route group과 필수 파일을 생성합니다.',
    code: `src/app/(my-app)/
  my-app/
    layout.tsx   ← 레이아웃 (BottomNav 등)
    page.tsx     ← 메인 진입점`,
    language: 'text',
  },
  {
    number: '02',
    title: 'layout.tsx 작성',
    description: '앱의 공통 레이아웃을 정의합니다.',
    code: `export default function MyAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}`,
    language: 'tsx',
  },
  {
    number: '03',
    title: 'middleware.ts에 경로 추가',
    description: '인증이 필요한 경우 matcher에 경로를 추가합니다.',
    code: `// src/middleware.ts
export const config = {
  matcher: [
    // ... 기존 경로들
    '/my-app/:path*',  // ← 이 줄 추가
  ],
}`,
    language: 'ts',
  },
  {
    number: '04',
    title: '랜딩 페이지에 카드 등록',
    description: 'src/app/page.tsx의 mvps 배열에 새 항목을 추가합니다.',
    code: `// src/app/page.tsx
const mvps = [
  // ... 기존 MVP들
  {
    id: 'my-app',
    title: '내 앱',
    description: '앱 설명',
    icon: Sparkles,
    href: '/my-app',
    status: 'dev' as MvpStatus,
    stack: ['Next.js', 'Supabase'],
    color: 'from-violet-500 to-pink-500',
    iconBg: 'bg-violet-50 text-violet-600',
  },
]`,
    language: 'ts',
  },
]

const quickStart = `./scripts/create-mvp.sh my-app "내 앱"`

export default function TemplatePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950">
        <div className="container mx-auto px-4 py-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono text-slate-500 bg-slate-900 border border-slate-800 rounded px-2 py-0.5">
              DEV GUIDE
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">새 MVP 추가 가이드</h1>
          <p className="text-slate-400 text-sm">
            아래 4단계를 따라 새 MVP를 프로젝트에 추가하세요.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-3xl">
        {/* Quick Start */}
        <div className="mb-10 rounded-xl border border-emerald-800/50 bg-emerald-950/30 p-5">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
            Quick Start (권장)
          </p>
          <p className="text-sm text-slate-300 mb-3">
            스크립트를 사용하면 steps 1–3을 자동으로 완료합니다.
          </p>
          <div className="flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-800 px-4 py-3">
            <span className="text-emerald-400 font-mono text-sm select-all">{quickStart}</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            실행 후 Step 4 (랜딩 페이지 등록)만 수동으로 진행하세요.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden"
            >
              <div className="flex items-start gap-4 p-5 border-b border-slate-800">
                <span className="text-2xl font-bold font-mono text-slate-700 leading-none mt-0.5">
                  {step.number}
                </span>
                <div>
                  <h2 className="text-base font-semibold text-white">{step.title}</h2>
                  <p className="text-sm text-slate-400 mt-0.5">{step.description}</p>
                </div>
              </div>
              <div className="relative">
                <span className="absolute top-3 right-3 text-xs font-mono text-slate-600">
                  {step.language}
                </span>
                <pre className="p-5 text-sm font-mono text-slate-300 overflow-x-auto leading-relaxed">
                  <code>{step.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* Checklist */}
        <div className="mt-10 rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm font-semibold text-slate-300 mb-4">완료 체크리스트</p>
          <ul className="space-y-2 text-sm text-slate-400">
            {[
              'src/app/(my-app)/my-app/layout.tsx 생성',
              'src/app/(my-app)/my-app/page.tsx 생성',
              'middleware.ts matcher에 경로 추가',
              'src/app/page.tsx mvps 배열에 카드 등록',
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="h-4 w-4 rounded border border-slate-700 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-600 mt-10">
          이 페이지는 <span className="font-mono">src/app/(template)/template/page.tsx</span> 에서 수정할 수 있습니다.
        </p>
      </div>
    </div>
  )
}
