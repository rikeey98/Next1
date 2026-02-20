'use client'

import { useState } from 'react'
import { Trash2, Clock, ChevronDown, ChevronUp, Flame } from 'lucide-react'
import { MealEntry, MEAL_TYPE_CONFIG } from './types'

interface Props {
  meal: MealEntry
  onDeleted: (id: string) => void
}

function formatInterval(minutes: number | null): string | null {
  if (minutes === null) return null
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}분 후`
  if (m === 0) return `${h}시간 후`
  return `${h}시간 ${m}분 후`
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

export default function MealCard({ meal, onDeleted }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const cfg = MEAL_TYPE_CONFIG[meal.meal_type]
  const analysis = meal.analysis_json
  const foods = analysis?.foods ?? []
  const interval = formatInterval(meal.interval_since_prev_minutes)
  const totalCalories = analysis?.total_calories

  const handleDelete = async () => {
    if (!confirm('이 기록을 삭제할까요?')) return
    setDeleting(true)
    try {
      await fetch('/api/meals', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: meal.id }),
      })
      onDeleted(meal.id)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-sm">
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.color}`}>
              {cfg.emoji} {cfg.label}
            </span>
            <span className="flex items-center gap-1 text-xs text-stone-400">
              <Clock className="h-3 w-3" />
              {formatTime(meal.recorded_at)}
            </span>
            {interval && (
              <span className="text-xs text-stone-400">이전 식사 후 {interval}</span>
            )}
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="shrink-0 rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Input text */}
        {meal.input_text && (
          <p className="mt-2 text-sm text-stone-700 leading-relaxed">{meal.input_text}</p>
        )}

        {/* Image */}
        {meal.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={meal.image_url} alt="meal" className="mt-2 w-full rounded-xl object-cover max-h-40" />
        )}

        {/* 총 칼로리 요약 */}
        {totalCalories !== undefined && (
          <div className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-orange-500">
            <Flame className="h-4 w-4" />
            {totalCalories} kcal
          </div>
        )}

        {/* AI 분석 결과 토글 */}
        {foods.length > 0 && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-2 flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            AI 분석 결과 {expanded ? '접기' : '보기'}
          </button>
        )}
      </div>

      {/* Expanded analysis */}
      {expanded && foods.length > 0 && (
        <div className="border-t border-stone-100 bg-stone-50 px-4 py-3 space-y-3">
          {/* 음식별 상세 */}
          {foods.map((food, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-700">{food.name}</span>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span>{food.amount}</span>
                  {food.calories !== undefined && (
                    <span className="font-semibold text-orange-400">{food.calories} kcal</span>
                  )}
                </div>
              </div>
              {food.nutrients && (
                <div className="flex gap-2 text-[11px] text-stone-400">
                  <span>탄 {food.nutrients.carbs}g</span>
                  <span>단 {food.nutrients.protein}g</span>
                  <span>지 {food.nutrients.fat}g</span>
                  <span>나트륨 {food.nutrients.sodium}mg</span>
                </div>
              )}
            </div>
          ))}

          {/* 합계 */}
          {analysis?.total_nutrients && (
            <div className="pt-2 border-t border-stone-200">
              <p className="text-xs font-semibold text-stone-500 mb-1">합계</p>
              <div className="flex gap-3 text-xs text-stone-600">
                <span>탄수화물 <b>{analysis.total_nutrients.carbs}g</b></span>
                <span>단백질 <b>{analysis.total_nutrients.protein}g</b></span>
                <span>지방 <b>{analysis.total_nutrients.fat}g</b></span>
              </div>
              <div className="mt-0.5 text-xs text-stone-500">
                나트륨 <b>{analysis.total_nutrients.sodium}mg</b>
              </div>
            </div>
          )}

          {/* 메모 & 신뢰도 */}
          {analysis?.memo && (
            <p className="text-xs text-stone-500 pt-1 border-t border-stone-200">
              💡 {analysis.memo}
            </p>
          )}
          {analysis?.confidence !== undefined && (
            <p className="text-[11px] text-stone-400">
              분석 신뢰도: {Math.round(analysis.confidence * 100)}%
            </p>
          )}
        </div>
      )}
    </div>
  )
}
