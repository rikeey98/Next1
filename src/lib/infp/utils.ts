export function getToday(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' })
}

export function getYesterday(): string {
  const now = new Date()
  const kst = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
  kst.setDate(kst.getDate() - 1)
  return kst.toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' })
}

export function formatKoreanDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export const ENERGY_LABELS = [
  { level: 1, label: '낮음', description: '지치고 힘들어요', emoji: '🔋' },
  { level: 2, label: '보통', description: '무난한 상태예요', emoji: '⚡' },
  { level: 3, label: '높음', description: '에너지가 좋아요', emoji: '🔥' },
  { level: 4, label: '넘침', description: '최고의 컨디션!', emoji: '✨' },
] as const
