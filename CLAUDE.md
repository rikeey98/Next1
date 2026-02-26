# Next1 – MVP Launchpad

## 프로젝트 개요
개인 MVP들을 빠르게 실험하는 Next.js 모노레포. 각 MVP는 별도 route group으로 격리된다.

## 기술 스택
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui (new-york style)
- **Auth/DB**: Supabase
- **AI**: OpenAI API (GPT-4o)
- **Package manager**: npm

## 디렉토리 구조

```
src/
  app/
    (auth)/          # 로그인/회원가입 페이지
    (dashboard)/     # 랜딩 대시보드 (Sidebar 포함)
    (infp)/          # INFP TODO MVP — /infp/*
    (infp-onboarding)/ # INFP 온보딩 플로우 (BottomNav 없음)
    (diet)/          # Easy Diet Note MVP — /diet/*
    (template)/      # 새 MVP 추가용 템플릿
    api/             # API Routes
      meals/         # Diet Note API (analyze-and-save, calendar, upload)
      anchors/       # INFP anchors API
  components/        # 공유 UI 컴포넌트
  lib/
    supabase/
      server.ts      # 서버 컴포넌트용 클라이언트
      client.ts      # 클라이언트 컴포넌트용 클라이언트
    utils.ts         # cn() 등 유틸리티
  types/
    database.ts      # Supabase DB 타입 정의 (수동 관리)

supabase/
  migrations/
    001_infp_todo_schema.sql
    002_diet_schema.sql
```

## Supabase 클라이언트 패턴

```typescript
// 서버 컴포넌트 / API Route
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()

// 클라이언트 컴포넌트
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
```

- 뮤테이션 후: `router.refresh()` 호출
- 레이아웃 인증 체크: `supabase.auth.getUser()` → 없으면 redirect
- 동적 페이지: `export const dynamic = 'force-dynamic'`

## 타입 관련 주의사항
- `Json` 타입 (`database.ts`): Record 객체를 Supabase에 insert할 때 `as Json` 캐스트 필요
- Next.js 14 동적 파라미터: `params: Promise<{ paramName: string }>` + `await params`
- **새 DB 테이블 추가 시**: `src/types/database.ts`에 수동으로 타입 추가 필요

## MVP 목록

| MVP | Route Group | 진입점 URL | 주요 API |
|-----|-------------|-----------|---------|
| INFP TODO | `(infp)` | `/infp/morning` | `/api/anchors` |
| Easy Diet Note | `(diet)` | `/diet` | `/api/meals/*` |

## 환경 변수 (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
```

## Git 브랜치 전략
- **메인 브랜치**: `main` (PR 대상 기본 브랜치)
- **작업 브랜치**: `feature/`, `bugfix/`, `hotfix/` 접두사 사용
- PR은 항상 `main` 으로 생성

## 새 MVP 추가 방법
1. `src/app/(template)/` 구조를 참고해 새 route group `(mvp-name)` 생성
2. 필요 시 `supabase/migrations/` 에 SQL 파일 추가 (Supabase Dashboard에서 수동 실행)
3. `src/types/database.ts`에 새 테이블 타입 추가
4. 이 파일(CLAUDE.md)의 MVP 목록 업데이트

## OpenAI 클라이언트 패턴
빌드 타임 에러를 방지하기 위해 지연 초기화 사용:

```typescript
// ❌ 모듈 레벨에서 초기화 금지
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ✅ 함수 내에서 초기화
function getOpenAIClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}
```
