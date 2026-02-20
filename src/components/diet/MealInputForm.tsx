'use client'

import { useState, useRef } from 'react'
import { Loader2, Camera, X, Sparkles } from 'lucide-react'
import { MealEntry, MealType, MEAL_TYPE_CONFIG } from './types'

interface Props {
  onSaved: (meal: MealEntry) => void
}

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack', 'late_night']

export default function MealInputForm({ onSaved }: Props) {
  const [text, setText] = useState('')
  const [mealType, setMealType] = useState<MealType | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImage = (file: File) => {
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) handleImage(file)
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!mealType) {
      setError('식사 타입을 선택해주세요.')
      return
    }
    if (!text.trim() && !imageFile) {
      setError('텍스트 또는 이미지를 입력해주세요.')
      return
    }

    setLoading(true)
    try {
      let imageUrl: string | null = null

      // 이미지 업로드
      if (imageFile) {
        const fd = new FormData()
        fd.append('file', imageFile)
        const uploadRes = await fetch('/api/meals/upload', { method: 'POST', body: fd })
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          imageUrl = uploadData.url
        }
        // 업로드 실패해도 텍스트만으로 진행
      }

      // 분석 + 저장
      const res = await fetch('/api/meals/analyze-and-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputText: text, imageUrl, mealType }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? '저장 실패')

      onSaved(data.meal)
      setText('')
      setMealType(null)
      removeImage()
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm space-y-4"
    >
      {/* 식사 타입 선택 */}
      <div className="flex flex-wrap gap-2">
        {MEAL_TYPES.map((type) => {
          const cfg = MEAL_TYPE_CONFIG[type]
          const selected = mealType === type
          return (
            <button
              key={type}
              type="button"
              onClick={() => setMealType(type)}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-all border ${
                selected
                  ? `${cfg.color} border-current`
                  : 'bg-stone-50 text-stone-500 border-stone-200 hover:border-stone-300'
              }`}
            >
              {cfg.emoji} {cfg.label}
            </button>
          )
        })}
      </div>

      {/* 텍스트 입력 */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="예: 닭가슴살 샐러드 + 바나나 1개"
        rows={3}
        className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-stone-400 focus:ring-0"
      />

      {/* 이미지 영역 */}
      {imagePreview ? (
        <div className="relative w-full rounded-xl overflow-hidden border border-stone-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imagePreview} alt="meal preview" className="w-full max-h-48 object-cover" />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 py-5 text-stone-400 hover:border-stone-300 hover:bg-stone-100 transition-colors"
        >
          <Camera className="h-5 w-5" />
          <span className="text-xs">사진 추가 (선택)</span>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleImage(file)
        }}
      />

      {/* 에러 */}
      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-60 transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            AI 분석 중...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            기록하기
          </>
        )}
      </button>
    </form>
  )
}
