'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DayEnergyData {
  date: string
  logs: Array<{
    time: string
    level: number
    hour: number
  }>
}

interface OverlayedEnergyChartProps {
  daysData: DayEnergyData[]
}

const COLORS = [
  '#D4878F', // dusty rose
  '#F5C5B8', // warm peach
  '#C9BDD4', // lavender fog
  '#B5C5B8', // sage mist
  '#E8A598', // coral
  '#D4B5C9', // mauve
  '#C5D4B5', // soft green
]

export default function OverlayedEnergyChart({ daysData }: OverlayedEnergyChartProps) {
  if (daysData.length === 0 || daysData.every(d => d.logs.length === 0)) {
    return (
      <Card className="mb-6 rounded-2xl shadow-cozy">
        <CardHeader>
          <CardTitle className="text-base">파도의 흐름</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
            에너지 기록이 쌓이면 여러 날의 패턴을 볼 수 있어요
          </div>
        </CardContent>
      </Card>
    )
  }

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const chartData = hours.map(hour => {
    const dataPoint: any = { hour: `${hour}시` }

    daysData.forEach((day, idx) => {
      const hourLogs = day.logs.filter(log => log.hour === hour)
      if (hourLogs.length > 0) {
        const avg = hourLogs.reduce((sum, log) => sum + log.level, 0) / hourLogs.length
        dataPoint[day.date] = avg
      }
    })

    return dataPoint
  }).filter(d => {
    return Object.keys(d).length > 1
  })

  return (
    <Card className="mb-6 rounded-2xl shadow-cozy">
      <CardHeader>
        <CardTitle className="text-base">파도의 흐름</CardTitle>
        <p className="text-xs text-muted-foreground">최근 7일간의 에너지 패턴</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0DDD6" />
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 11 }}
              stroke="#9B8E8E"
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 5]}
              ticks={[1, 2, 3, 4]}
              tick={{ fontSize: 11 }}
              stroke="#9B8E8E"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFDFB',
                border: '1px solid #F0DDD6',
                borderRadius: '12px',
                fontSize: '11px',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px' }}
              formatter={(value) => {
                const date = new Date(value)
                return `${date.getMonth() + 1}/${date.getDate()}`
              }}
            />
            {daysData.map((day, idx) => (
              day.logs.length > 0 && (
                <Line
                  key={day.date}
                  type="monotone"
                  dataKey={day.date}
                  stroke={COLORS[idx % COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  opacity={0.7}
                  connectNulls
                />
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
