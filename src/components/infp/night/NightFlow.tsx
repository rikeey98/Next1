'use client'

import { useState } from 'react'
import Step1Reflection from './Step1Reflection'
import Step2Tomorrow from './Step2Tomorrow'
import type { Reflection, DailyState, MicroAction } from '@/types/database'

interface NightFlowProps {
  reflection: Reflection | null
  dailyState: DailyState | null
  completedActions: MicroAction[]
}

export default function NightFlow({ reflection, dailyState, completedActions }: NightFlowProps) {
  const alreadyDone = !!reflection && !!dailyState?.tomorrow_first_action_text
  const [step, setStep] = useState(alreadyDone ? 2 : 1)

  if (alreadyDone) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-700">오늘의 마무리를 완료했어요!</p>
          <p className="mt-1 text-xs text-green-600">
            &ldquo;{reflection.most_me}&rdquo;
          </p>
        </div>

        {dailyState.tomorrow_first_action_text && (
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
            <p className="text-xs text-indigo-500">내일 아침 첫 행동</p>
            <p className="text-sm font-medium text-indigo-700">
              {dailyState.tomorrow_first_action_text}
            </p>
          </div>
        )}

        {completedActions.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">오늘 완료한 행동</h3>
            <div className="space-y-2">
              {completedActions.map((a) => (
                <div key={a.id} className="rounded-lg border bg-white p-3 text-sm">
                  {a.text} <span className="text-muted-foreground">({a.completion_rate}%)</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex gap-2">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full ${
              s <= step ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      {step === 1 ? (
        <Step1Reflection
          initialText={reflection?.most_me ?? ''}
          onNext={() => setStep(2)}
        />
      ) : (
        <Step2Tomorrow />
      )}
    </div>
  )
}
