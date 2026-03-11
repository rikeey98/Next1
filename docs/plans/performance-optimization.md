# Next1 성능 최적화 계획

> 작성일: 2026-03-11
> 배경: Vercel 배포 후 체감 속도 저하 → 원인 분석 및 개선 계획 수립

---

## 분석 요약

총 6개 카테고리의 성능 병목 발견. 우선순위 순으로 정리.

---

## 1순위 — `force-dynamic` 과다 사용

**영향도**: 🔴 매우 높음
**예상 개선**: 페이지 로딩 30~50% 개선

### 문제
총 11개 페이지 전체에 `export const dynamic = 'force-dynamic'` 선언되어 있음.
→ SSG/ISR/캐싱 완전 비활성화, 매 요청마다 서버에서 재처리, CDN 캐싱 불가.

### 대상 파일
| 파일 | 현재 | 변경 방향 |
|------|------|-----------|
| `src/app/(dashboard)/dashboard/page.tsx` | force-dynamic | 유지 (유저 데이터) |
| `src/app/(dashboard)/todos/page.tsx` | force-dynamic | 유지 (유저 데이터) |
| `src/app/(infp)/infp/morning/page.tsx` | force-dynamic | 유지 (유저 데이터) |
| `src/app/(infp)/infp/wave/page.tsx` | force-dynamic | 유지 (유저 데이터) |
| `src/app/(infp)/infp/night/page.tsx` | force-dynamic | 유지 (유저 데이터) |
| `src/app/(infp)/infp/footprints/page.tsx` | force-dynamic | 유지 (유저 데이터) |
| `src/app/(infp)/infp/anchors/page.tsx` | force-dynamic | **제거 검토** |
| `src/app/(infp)/infp/timer/[microActionId]/page.tsx` | force-dynamic | 유지 (동적 파라미터) |
| `src/app/(diet)/diet/page.tsx` | force-dynamic | 유지 (유저 데이터) |
| `src/app/(diet)/diet/records/page.tsx` | force-dynamic | 유지 (유저 데이터) |
| `src/app/(template)/template/page.tsx` | force-dynamic | **제거** (정적 페이지) |

### 해결책
```typescript
// 유저 데이터 없는 정적 페이지는 force-dynamic 제거
// 필요 시 ISR로 대체
export const revalidate = 60 // 60초마다 재생성
```

- [ ] template 페이지 force-dynamic 제거
- [ ] anchors 페이지 검토 후 결정

---

## 2순위 — Supabase 쿼리 O(n²) 비효율

**영향도**: 🔴 높음
**예상 개선**: DB 처리 시간 60% 감소

### 문제
`src/lib/infp/queries.ts` — `getFootprintsData()` 함수에서
30일치 데이터를 날짜별로 매번 `find`/`filter`로 순회 → O(n²) 복잡도.

```typescript
// ❌ 현재 코드 (O(n²))
const dailyRecords = dailyStatesRes.data?.map(ds => {
  const reflection = reflectionsRes.data?.find(r => r.date === ds.date)   // 매번 O(n)
  const dayEnergy = energyLogsRes.data?.filter(e => e.logged_at.startsWith(ds.date)) // 매번 O(n)
  const dayActions = actionsRes.data?.filter(a => a.created_at.startsWith(ds.date))  // 매번 O(n)
  const anchor = anchorsRes.data?.find(a => a.id === ds.selected_anchor_id)          // 매번 O(n)
})
```

### 해결책
```typescript
// ✅ Map으로 인덱싱 후 O(1) 조회
const reflectionsByDate = new Map(reflectionsRes.data?.map(r => [r.date, r]))
const energyByDate = new Map<string, typeof energyLogsRes.data>()
energyLogsRes.data?.forEach(e => {
  const date = e.logged_at.slice(0, 10)
  if (!energyByDate.has(date)) energyByDate.set(date, [])
  energyByDate.get(date)!.push(e)
})
const anchorsById = new Map(anchorsRes.data?.map(a => [a.id, a]))

const dailyRecords = dailyStatesRes.data?.map(ds => {
  const reflection = reflectionsByDate.get(ds.date)         // O(1)
  const dayEnergy = energyByDate.get(ds.date) ?? []         // O(1)
  const anchor = anchorsById.get(ds.selected_anchor_id)     // O(1)
  // ...
})
```

- [ ] `getFootprintsData()` Map 최적화 적용

---

## 3순위 — 이미지 최적화 (`next/image` 미적용)

**영향도**: 🟠 높음 (모바일 환경에서 특히 심각)
**예상 개선**: 모바일 이미지 로딩 40% 개선

### 문제
```typescript
// src/components/diet/MealCard.tsx:84 — eslint 경고 무시하고 img 태그 사용
// eslint-disable-next-line @next/next/no-img-element
<img src={meal.image_url} alt="meal" className="mt-2 w-full rounded-xl object-cover max-h-40" />

// src/components/diet/MealInputForm.tsx:131 — 미리보기도 img 태그
<img src={imagePreview} alt="meal preview" className="w-full max-h-48 object-cover" />
```

- 원본 크기 이미지를 그대로 로드 (수 MB 가능)
- WebP/AVIF 변환 없음
- lazy loading 없음

### 해결책
```typescript
// next.config.js에 Supabase 도메인 허용
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

// MealCard.tsx — next/image 사용
import Image from 'next/image'
<Image
  src={meal.image_url}
  alt="meal"
  width={400}
  height={160}
  className="mt-2 w-full rounded-xl object-cover"
/>
```

- [ ] `next.config.js` images 설정 추가
- [ ] `MealCard.tsx` → `next/image` 전환
- [ ] `MealInputForm.tsx` 미리보기 → `next/image` 전환 (또는 canvas 리사이징)

---

## 4순위 — Recharts 번들 크기 (~200KB)

**영향도**: 🟠 중간-높음
**예상 개선**: JS 번들 20% 감소, 초기 로딩 개선

### 문제
```typescript
// src/components/infp/wave/EnergyChart.tsx
import { AreaChart, Area, XAxis, YAxis, ... } from 'recharts' // ~200KB gzip

// src/components/infp/footprints/OverlayedEnergyChart.tsx
import { LineChart, Line, XAxis, YAxis, ... } from 'recharts'
```

### 해결책 (단계적)
**단기**: dynamic import로 lazy loading
```typescript
import dynamic from 'next/dynamic'
const EnergyChart = dynamic(() => import('./EnergyChart'), { ssr: false })
```

**중기**: 간단한 차트는 SVG + CSS로 직접 구현하여 Recharts 의존성 제거

- [ ] EnergyChart, OverlayedEnergyChart dynamic import 적용
- [ ] 장기적으로 경량 SVG 차트로 교체 검토

---

## 5순위 — 인증 체크 중복 (레이아웃마다 반복)

**영향도**: 🟡 중간
**예상 개선**: 서버 처리 10~15% 개선

### 문제
```typescript
// (dashboard)/layout.tsx, (infp)/layout.tsx, (diet)/layout.tsx 각각 호출
const { data: { user } } = await supabase.auth.getUser()

// (infp)/layout.tsx는 추가로 profile 조회까지
const { data: profile } = await supabase.from('profiles').select('onboarding_completed').eq('id', user.id).maybeSingle()
```

### 해결책
`middleware.ts`에서 인증 한 번만 처리, 레이아웃에서 중복 제거

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const supabase = createMiddlewareClient({ req: request, res: NextResponse.next() })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.redirect(new URL('/login', request.url))
}
```

- [ ] `middleware.ts` 인증 로직 통합 검토

---

## 6순위 — 프로덕션 console.log 제거

**영향도**: 🟢 낮음
**난이도**: 매우 낮음 (즉시 적용 가능)

### 문제
전체 프로젝트에 13개의 `console.log` 잔존 (특히 `(infp)/layout.tsx`에 집중).

```typescript
// src/app/(infp)/layout.tsx
console.log('[INFP Layout] Checking profile for user:', user.id)
console.log('[INFP Layout] Profile:', profile, 'Error:', error)
```

### 해결책
```bash
# 확인
grep -r "console.log" src/ --include="*.ts" --include="*.tsx"

# 제거 또는 조건부 처리
if (process.env.NODE_ENV === 'development') console.log(...)
```

- [ ] 프로덕션 불필요 console.log 전체 제거

---

## 실행 로드맵

```
Week 1 (즉시 적용 가능)
  ├── console.log 제거 (6순위)
  ├── next.config.js images 설정 (3순위 사전 작업)
  └── template 페이지 force-dynamic 제거 (1순위 일부)

Week 2 (핵심 최적화)
  ├── getFootprintsData Map 최적화 (2순위)
  ├── MealCard / MealInputForm next/image 전환 (3순위)
  └── Recharts dynamic import (4순위)

Week 3 (구조 개선)
  └── middleware 인증 통합 (5순위)
```

---

## 참고

- 분석 일자: 2026-03-11
- 분석 도구: Claude Code (코드 정적 분석)
- 관련 PR/Issue: —
