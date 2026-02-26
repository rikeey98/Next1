'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PenLine, BookOpen } from 'lucide-react'
import MealInputForm from './MealInputForm'
import MealCard from './MealCard'
import { MealEntry } from './types'

interface Props {
  initialMeals: MealEntry[]
}

export default function DietApp({ initialMeals }: Props) {
  const [meals, setMeals] = useState<MealEntry[]>(initialMeals)
  const router = useRouter()

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    fetch('/api/profile/timezone', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timezone: tz }),
    })
  }, [])

  const handleSaved = (newMeal: MealEntry) => {
    setMeals((prev) => [newMeal, ...prev])
  }

  const handleDeleted = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-stone-800">🥗 이지 다이어트 노트</h1>
          <p className="text-xs text-stone-500">오늘의 식사를 기록해보세요</p>
        </div>
        <Link
          href="/diet/records"
          className="flex items-center gap-1.5 rounded-lg bg-stone-100 px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-200 transition-colors"
        >
          <BookOpen className="h-4 w-4" />
          기록
        </Link>
      </header>

      {/* Input Form */}
      <div className="p-4">
        <MealInputForm onSaved={handleSaved} />
      </div>

      {/* Today's meals */}
      <div className="flex-1 px-4 pb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-stone-600 flex items-center gap-1.5">
            <PenLine className="h-4 w-4" />
            오늘 기록
          </h2>
          <span className="text-xs text-stone-400">{meals.length}건</span>
        </div>

        {meals.length === 0 ? (
          <div className="text-center py-12 text-stone-400">
            <p className="text-3xl mb-2">🍽️</p>
            <p className="text-sm">오늘 첫 번째 식사를 기록해보세요!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} onDeleted={handleDeleted} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
