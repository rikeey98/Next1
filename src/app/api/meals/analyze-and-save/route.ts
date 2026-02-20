import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import type { Json, MealTypeEnum } from '@/types/database'

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: '아침',
  lunch: '점심',
  dinner: '저녁',
  snack: '간식',
  late_night: '야식',
}

async function analyzeMeal(inputText: string, imageUrl: string | null, mealType: string) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const mealLabel = MEAL_TYPE_LABELS[mealType] ?? mealType

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `You are a Korean diet analysis assistant. Analyze the meal and return a JSON object with this exact structure:
{
  "foods": [
    {
      "name": "음식명(한국어)",
      "amount": "1개",
      "calories": 500,
      "nutrients": { "carbs": 70, "protein": 10, "fat": 15, "sodium": 1800 }
    }
  ],
  "total_calories": 500,
  "total_nutrients": { "carbs": 70, "protein": 10, "fat": 15, "sodium": 1800 },
  "memo": "한 줄 코멘트(예: 나트륨이 높아요)",
  "confidence": 0.85
}
Rules:
- All food names must be in Korean
- calories: kcal (integer)
- nutrients: grams (integer), sodium: mg (integer)
- Estimate based on standard Korean food databases
- memo: brief Korean health tip about this meal
- Return ONLY valid JSON, no markdown`,
    },
    {
      role: 'user',
      content: imageUrl
        ? [
            {
              type: 'text' as const,
              text: `Meal type: ${mealLabel}\nUser input: ${inputText || '(image only)'}`,
            },
            {
              type: 'image_url' as const,
              image_url: { url: imageUrl, detail: 'low' as const },
            },
          ]
        : `Meal type: ${mealLabel}\nUser input: ${inputText}`,
    },
  ]

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    max_tokens: 800,
    temperature: 0.3,
  })

  const content = response.choices[0]?.message?.content ?? '{}'
  return JSON.parse(content)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { inputText, imageUrl, mealType } = body as {
      inputText?: string
      imageUrl?: string | null
      mealType: string
    }

    if (!mealType) {
      return NextResponse.json({ error: '식사 타입을 선택해주세요.' }, { status: 400 })
    }
    if (!inputText?.trim() && !imageUrl) {
      return NextResponse.json({ error: '텍스트 또는 이미지를 입력해주세요.' }, { status: 400 })
    }

    const now = new Date()

    // 직전 식사 간격 계산
    const { data: prevMeal } = await supabase
      .from('meal_entries')
      .select('recorded_at')
      .eq('user_id', user.id)
      .lt('recorded_at', now.toISOString())
      .order('recorded_at', { ascending: false })
      .limit(1)
      .single()

    let intervalMinutes: number | null = null
    if (prevMeal?.recorded_at) {
      const diffMs = now.getTime() - new Date(prevMeal.recorded_at).getTime()
      intervalMinutes = Math.round(diffMs / 60000)
    }

    // OpenAI 분석
    let analysisJson: Json = {}
    try {
      analysisJson = await analyzeMeal(inputText ?? '', imageUrl ?? null, mealType) as Json
    } catch (e) {
      console.error('OpenAI analysis failed:', e)
      analysisJson = { foods: [], memo: '분석 실패', confidence: 0 }
    }

    // DB 저장
    const { data, error } = await supabase
      .from('meal_entries')
      .insert({
        user_id: user.id,
        meal_type: mealType as MealTypeEnum,
        input_text: inputText?.trim() ?? null,
        image_url: imageUrl ?? null,
        analysis_json: analysisJson,
        recorded_at: now.toISOString(),
        interval_since_prev_minutes: intervalMinutes,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ meal: data })
  } catch (error) {
    console.error('Failed to analyze and save meal:', error)
    return NextResponse.json({
      error: '기록 저장에 실패했습니다.',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 })
  }
}
