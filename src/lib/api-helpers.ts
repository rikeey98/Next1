import { NextResponse } from 'next/server'

export const VALID_MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack', 'late_night'] as const
export type ValidMealType = typeof VALID_MEAL_TYPES[number]

export function isValidMealType(type: string): type is ValidMealType {
  return (VALID_MEAL_TYPES as readonly string[]).includes(type)
}

export function apiError(message: string, status: number = 500): NextResponse {
  return NextResponse.json({ error: message }, { status })
}
