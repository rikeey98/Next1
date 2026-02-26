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

## Git 브랜치 및 AI 에이전트 협업 전략

본 프로젝트는 다수의 AI 에이전트(Claude, Cursor, Gemini 등)를 병렬로 사용하여 개발합니다. 에이전트 간의 소스코드 충돌을 방지하기 위해 **Git Worktree** 기반의 격리된 환경에서 기능(Feature) 단위 브랜치로 작업해야 합니다.

### 1. 에이전트별 Worktree 구성
각 에이전트는 서로 독립된 물리적 디렉토리(Worktree)에서 작업하는 것을 원칙으로 합니다.
- `Next1` (메인 레포지토리)
- `Next1-claude` (Claude 전용 워크트리)
- `Next1-cursor` (Cursor 전용 워크트리)
- `Next1-gemini` (Gemini 전용 워크트리)

> **Worktree 생성 예시 (터미널 명령어)**
> ```bash
> # 메인 레포지토리 폴더 안에서 실행하여 병렬 디렉토리 생성
> git worktree add ../Next1-claude
> git worktree add ../Next1-cursor
> git worktree add ../Next1-gemini
> ```

### 2. 브랜치 네이밍 및 작업 가이드
- **메인 브랜치**: `main` (PR 대상 기본 브랜치, 직접 푸시 지양)
- **에이전트별 작업 브랜치**: 
  - 각 에이전트는 할당된 자신의 워크트리 환경에서 새로운 피처 브랜치를 생성하여 작업합니다.
  - 네이밍 규칙: `본인에이전트명/feature/기능이름` 또는 `본인에이전트명/bugfix/버그이름`
  - 예시: `claude/feature/auth-login`, `gemini/feature/diet-calendar`, `cursor/bugfix/ui-error`
- **커밋 및 PR**:
  - 작업이 완료되면 본인의 브랜치에 커밋하고 원격 저장소에 푸시합니다.
  - 코드를 통합할 때는 `main` 브랜치로 Pull Request (PR)를 생성합니다.

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
