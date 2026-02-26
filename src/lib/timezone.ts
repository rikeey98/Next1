/**
 * 타임존 기반 날짜 계산 유틸리티
 * 외부 라이브러리 없이 Intl API만 사용
 */

/**
 * UTC 타임스탬프 기준으로 특정 타임존의 로컬 시각과 UTC 간의 오프셋(ms)을 계산
 * 반환값: localMs - utcMs (양수 = UTC보다 앞선 타임존, 예: KST +32400000)
 */
function getTZOffsetMs(utcMs: number, timezone: string): number {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const parts = Object.fromEntries(
    fmt.formatToParts(utcMs)
      .filter((p) => p.type !== 'literal')
      .map((p) => [p.type, +p.value])
  )
  // hour12: false 에서 자정은 24로 표현되므로 % 24 처리
  const localMs = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour % 24,
    parts.minute,
    parts.second
  )
  return localMs - utcMs
}

/**
 * UTC Date 객체를 특정 타임존의 로컬 날짜 문자열(YYYY-MM-DD)로 변환
 */
export function toLocalDateStr(utcDate: Date, timezone: string): string {
  const utcMs = utcDate.getTime()
  const offsetMs = getTZOffsetMs(utcMs, timezone)
  const localMs = utcMs + offsetMs
  const local = new Date(localMs)
  const y = local.getUTCFullYear()
  const m = String(local.getUTCMonth() + 1).padStart(2, '0')
  const d = String(local.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * 현재 시간 기준으로 특정 타임존의 오늘 날짜 문자열(YYYY-MM-DD) 반환
 */
export function getTodayLocalDateStr(timezone: string): string {
  return toLocalDateStr(new Date(), timezone)
}

/**
 * 로컬 날짜 문자열(YYYY-MM-DD)과 타임존을 받아
 * 해당 날짜의 시작(00:00:00.000) ~ 끝(23:59:59.999)에 해당하는 UTC Date 범위 반환
 *
 * 예: ("2026-02-26", "Asia/Seoul")
 *  → { from: 2026-02-25T15:00:00.000Z, to: 2026-02-26T14:59:59.999Z }
 */
export function getLocalDateBoundsUTC(
  dateStr: string,
  timezone: string
): { from: Date; to: Date } {
  // dateStr을 UTC 자정으로 파싱 후 오프셋으로 보정
  const [y, m, d] = dateStr.split('-').map(Number)

  // 로컬 00:00:00 → UTC
  const localStartMs = Date.UTC(y, m - 1, d, 0, 0, 0, 0)
  const offsetMs = getTZOffsetMs(localStartMs, timezone)
  const fromMs = localStartMs - offsetMs

  // 로컬 23:59:59.999 → UTC
  const localEndMs = Date.UTC(y, m - 1, d, 23, 59, 59, 999)
  const toMs = localEndMs - offsetMs

  return { from: new Date(fromMs), to: new Date(toMs) }
}
