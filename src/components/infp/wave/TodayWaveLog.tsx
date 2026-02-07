import { ENERGY_LABELS } from '@/lib/infp/utils'
import type { EnergyLog } from '@/types/database'

interface TodayWaveLogProps {
  logs: EnergyLog[]
}

export default function TodayWaveLog({ logs }: TodayWaveLogProps) {
  if (logs.length === 0) return null

  return (
    <div className="mt-6">
      <h2 className="mb-3 text-sm font-medium text-muted-foreground">오늘의 파도 기록</h2>
      <div className="space-y-2">
        {logs.map((log) => {
          const config = ENERGY_LABELS.find((e) => e.level === log.level)
          const time = new Date(log.logged_at).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          })
          return (
            <div key={log.id} className="flex items-center gap-3 rounded-lg border bg-white p-3">
              <span className="text-xl">{config?.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{config?.label}</p>
                {log.note && <p className="text-xs text-muted-foreground">{log.note}</p>}
              </div>
              <span className="text-xs text-muted-foreground">{time}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
