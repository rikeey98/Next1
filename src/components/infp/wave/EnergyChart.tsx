'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Scatter, ScatterChart } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { EnergyLog } from '@/types/database'

interface EnergyChartProps {
  logs: EnergyLog[]
}

export default function EnergyChart({ logs }: EnergyChartProps) {
  if (logs.length === 0) {
    return (
      <Card className="mb-6 rounded-2xl shadow-cozy">
        <CardHeader>
          <CardTitle className="text-base">오늘의 파도</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            에너지를 기록하면 파도 그래프가 나타나요
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData = logs
    .map((log) => {
      const time = new Date(log.logged_at).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Seoul',
      })
      return {
        time,
        level: log.level,
        timestamp: new Date(log.logged_at).getTime(),
      }
    })
    .sort((a, b) => a.timestamp - b.timestamp)

  const isSinglePoint = chartData.length === 1

  return (
    <Card className="mb-6 rounded-2xl shadow-cozy">
      <CardHeader>
        <CardTitle className="text-base">오늘의 파도</CardTitle>
      </CardHeader>
      <CardContent>
        {isSinglePoint ? (
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0DDD6" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12 }}
                stroke="#9B8E8E"
              />
              <YAxis
                domain={[0, 5]}
                ticks={[1, 2, 3, 4]}
                tick={{ fontSize: 12 }}
                stroke="#9B8E8E"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFDFB',
                  border: '1px solid #F0DDD6',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Scatter
                data={chartData}
                fill="#D4878F"
                r={8}
              />
            </ScatterChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4878F" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D4878F" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0DDD6" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12 }}
                stroke="#9B8E8E"
              />
              <YAxis
                domain={[0, 5]}
                ticks={[1, 2, 3, 4]}
                tick={{ fontSize: 12 }}
                stroke="#9B8E8E"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFDFB',
                  border: '1px solid #F0DDD6',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="level"
                stroke="#D4878F"
                strokeWidth={2}
                fill="url(#colorLevel)"
                dot={{ fill: '#D4878F', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
