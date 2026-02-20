export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'late_night'

export interface Nutrients {
  carbs: number
  protein: number
  fat: number
  sodium: number
}

export interface FoodItem {
  name: string
  amount: string
  calories?: number
  nutrients?: Nutrients
}

export interface AnalysisJson {
  foods: FoodItem[]
  total_calories?: number
  total_nutrients?: Nutrients
  memo?: string
  confidence?: number
}

export interface MealEntry {
  id: string
  user_id: string
  meal_type: MealType
  input_text: string | null
  image_url: string | null
  analysis_json: AnalysisJson | null
  recorded_at: string
  interval_since_prev_minutes: number | null
  created_at: string
}

export const MEAL_TYPE_CONFIG: Record<MealType, { label: string; emoji: string; color: string }> = {
  breakfast: { label: '아침', emoji: '🌅', color: 'bg-amber-100 text-amber-700' },
  lunch: { label: '점심', emoji: '☀️', color: 'bg-sky-100 text-sky-700' },
  dinner: { label: '저녁', emoji: '🌙', color: 'bg-indigo-100 text-indigo-700' },
  snack: { label: '간식', emoji: '🍎', color: 'bg-green-100 text-green-700' },
  late_night: { label: '야식', emoji: '🌙', color: 'bg-purple-100 text-purple-700' },
}
