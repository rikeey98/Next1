'use client'

import { useState } from 'react'
import { Trash2, Clock, ChevronDown, ChevronUp } from 'lucide-react'
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
  const foods = meal.analysis_json?.foods ?? []
  const interval = formatInterval(meal.interval_since_prev_minutes)

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
              <span className="text-xs text-stone-400">
                이전 식사 후 {interval}
              </span>
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
          <img
            src={meal.image_url}
            alt="meal"
            className="mt-2 w-full rounded-xl object-cover max-h-40"
          />
        )}

        {/* AI 분석 결과 토글 */}
        {foods.length > 0 && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-3 flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            AI 분석 결과 {expanded ? '접기' : '보기'}
          </button>
        )}
      </div>

      {/* Expanded analysis */}
      {expanded && foods.length > 0 && (
        <div className="border-t border-stone-100 bg-stone-50 px-4 py-3 space-y-1.5">
          {foods.map((food, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-stone-700">{food.name}</span>
              <span className="text-stone-400 text-xs">{food.amount}</span>
            </div>
          ))}
          {meal.analysis_json?.memo && (
            <p className="text-xs text-stone-400 pt-1 border-t border-stone-200 mt-1">
              📝 {meal.analysis_json.memo}
            </p>
          )}
          {meal.analysis_json?.confidence !== undefined && (
            <p className="text-xs text-stone-400">
              신뢰도: {Math.round(meal.analysis_json.confidence * 100)}%
            </p>
          )}
        </div>
      )}
    </div>
  )
}
