'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import MealCard from './MealCard'
import { MealEntry, MEAL_TYPE_CONFIG, MealType } from './types'

type TabType = 'week' | 'month'

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일']

function getWeekDates(baseDate: Date): Date[] {
  const day = baseDate.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const monday = new Date(baseDate)
  monday.setDate(baseDate.getDate() + mondayOffset)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export default function DietRecords() {
  const [tab, setTab] = useState<TabType>('week')
  const [baseDate, setBaseDate] = useState(new Date())
  const [meals, setMeals] = useState<MealEntry[]>([])
  const [calendarCounts, setCalendarCounts] = useState<Record<string, number>>({})
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedMeals, setSelectedMeals] = useState<MealEntry[]>([])
  const [loading, setLoading] = useState(false)

  // 주간/월간 기록 로드
  const fetchMeals = useCallback(async () => {
    setLoading(true)
    const dateStr = toDateStr(baseDate)
    const res = await fetch(`/api/meals?range=${tab}&date=${dateStr}`)
    const data = await res.json()
    setMeals(data.meals ?? [])
    setLoading(false)
  }, [tab, baseDate])

  // 월간 캘린더 카운트 로드
  const fetchCalendar = useCallback(async () => {
    const month = `${baseDate.getFullYear()}-${String(baseDate.getMonth() + 1).padStart(2, '0')}`
    const res = await fetch(`/api/meals/calendar?month=${month}`)
    const data = await res.json()
    setCalendarCounts(data.counts ?? {})
  }, [baseDate])

  useEffect(() => {
    fetchMeals()
    if (tab === 'month') fetchCalendar()
  }, [fetchMeals, fetchCalendar, tab])

  const navigate = (dir: 1 | -1) => {
    const d = new Date(baseDate)
    if (tab === 'week') d.setDate(d.getDate() + dir * 7)
    else d.setMonth(d.getMonth() + dir)
    setBaseDate(d)
    setSelectedDate(null)
  }

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    const dateStr = toDateStr(date)
    const filtered = meals.filter((m) => toDateStr(new Date(m.recorded_at)) === dateStr)
    setSelectedMeals(filtered)
  }

  const handleDeleted = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id))
    setSelectedMeals((prev) => prev.filter((m) => m.id !== id))
  }

  // 주간 뷰
  const weekDates = getWeekDates(baseDate)
  const weekLabel = `${weekDates[0].getMonth() + 1}.${weekDates[0].getDate()} ~ ${weekDates[6].getMonth() + 1}.${weekDates[6].getDate()}`

  // 월간 캘린더 뷰
  const year = baseDate.getFullYear()
  const month = baseDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay() // 0=일
  const totalDays = new Date(year, month + 1, 0).getDate()
  const calendarStart = firstDay === 0 ? 6 : firstDay - 1 // 월요일 시작 오프셋

  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-stone-200 px-4 py-3 flex items-center gap-3">
        <Link href="/diet" className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold text-stone-800">기록</h1>
      </header>

      {/* Tab */}
      <div className="bg-white border-b border-stone-200 px-4 flex gap-4">
        {(['week', 'month'] as TabType[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setSelectedDate(null) }}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-stone-500'
            }`}
          >
            {t === 'week' ? '주간' : '월간'}
          </button>
        ))}
      </div>

      {/* Navigator */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-stone-100">
        <button onClick={() => navigate(-1)} className="rounded-lg p-1.5 hover:bg-stone-100">
          <ChevronLeft className="h-5 w-5 text-stone-600" />
        </button>
        <span className="text-sm font-semibold text-stone-700">
          {tab === 'week'
            ? weekLabel
            : `${year}년 ${month + 1}월`}
        </span>
        <button onClick={() => navigate(1)} className="rounded-lg p-1.5 hover:bg-stone-100">
          <ChevronRight className="h-5 w-5 text-stone-600" />
        </button>
      </div>

      <div className="flex-1 p-4">
        {loading ? (
          <div className="flex justify-center py-12 text-stone-400 text-sm">불러오는 중...</div>
        ) : tab === 'week' ? (
          /* 주간 뷰 */
          <div className="space-y-4">
            {/* 요일별 탭 */}
            <div className="grid grid-cols-7 gap-1">
              {weekDates.map((date, i) => {
                const dateStr = toDateStr(date)
                const count = meals.filter((m) => toDateStr(new Date(m.recorded_at)) === dateStr).length
                const isSelected = selectedDate ? isSameDay(date, selectedDate) : false
                const isToday = isSameDay(date, new Date())
                return (
                  <button
                    key={i}
                    onClick={() => handleDayClick(date)}
                    className={`flex flex-col items-center gap-0.5 rounded-xl py-2 transition-colors ${
                      isSelected ? 'bg-emerald-500 text-white' : isToday ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-stone-100'
                    }`}
                  >
                    <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-stone-400'}`}>
                      {DAY_LABELS[i]}
                    </span>
                    <span className="text-sm font-semibold">{date.getDate()}</span>
                    {count > 0 && (
                      <div className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-400'}`} />
                    )}
                  </button>
                )
              })}
            </div>

            {/* 선택된 날의 기록 */}
            {selectedDate ? (
              selectedMeals.length === 0 ? (
                <p className="text-center text-sm text-stone-400 py-8">이 날의 기록이 없어요</p>
              ) : (
                <div className="space-y-3">
                  {selectedMeals.map((m) => (
                    <MealCard key={m.id} meal={m} onDeleted={handleDeleted} />
                  ))}
                </div>
              )
            ) : (
              /* 선택 안 됐을 때: 전체 요약 */
              <div className="space-y-3">
                {meals.length === 0 ? (
                  <p className="text-center text-sm text-stone-400 py-8">이번 주 기록이 없어요</p>
                ) : (
                  meals.map((m) => <MealCard key={m.id} meal={m} onDeleted={handleDeleted} />)
                )}
              </div>
            )}
          </div>
        ) : (
          /* 월간 뷰 */
          <div className="space-y-4">
            {/* 캘린더 */}
            <div className="bg-white rounded-2xl border border-stone-200 p-3">
              {/* 요일 헤더 */}
              <div className="grid grid-cols-7 mb-1">
                {DAY_LABELS.map((d) => (
                  <div key={d} className="text-center text-xs text-stone-400 py-1">{d}</div>
                ))}
              </div>
              {/* 날짜 grid */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: calendarStart }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
                  const date = new Date(year, month, day)
                  const dateStr = toDateStr(date)
                  const count = calendarCounts[dateStr] ?? 0
                  const isSelected = selectedDate ? isSameDay(date, selectedDate) : false
                  const isToday = isSameDay(date, new Date())
                  return (
                    <button
                      key={day}
                      onClick={() => handleDayClick(date)}
                      className={`flex flex-col items-center justify-center rounded-xl py-1.5 transition-colors relative ${
                        isSelected ? 'bg-emerald-500 text-white' : isToday ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      <span className="text-sm font-medium">{day}</span>
                      {count > 0 && (
                        <span className={`text-[10px] font-semibold ${isSelected ? 'text-white/80' : 'text-emerald-500'}`}>
                          {count}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 선택된 날 기록 */}
            {selectedDate && (
              <div>
                <h3 className="text-sm font-semibold text-stone-600 mb-3">
                  {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 기록
                </h3>
                {selectedMeals.length === 0 ? (
                  <p className="text-center text-sm text-stone-400 py-6">기록이 없어요</p>
                ) : (
                  <div className="space-y-3">
                    {selectedMeals.map((m) => (
                      <MealCard key={m.id} meal={m} onDeleted={handleDeleted} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
