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
        <div className="rounded-2xl border border-cozy-sage/40 bg-cozy-sage/10 p-4 shadow-cozy">
          <p className="text-sm font-medium text-foreground">오늘의 마무리를 완료했어요!</p>
          <p className="mt-1 text-xs text-muted-foreground">
            &ldquo;{reflection.most_me}&rdquo;
          </p>
        </div>

        {dailyState.tomorrow_first_action_text && (
          <div className="rounded-2xl border border-cozy-lavender/40 bg-cozy-lavender/10 p-4 shadow-cozy">
            <p className="text-xs text-muted-foreground">내일 아침 첫 행동</p>
            <p className="text-sm font-medium text-foreground">
              {dailyState.tomorrow_first_action_text}
            </p>
          </div>
        )}

        {completedActions.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">오늘 완료한 행동</h3>
            <div className="space-y-2">
              {completedActions.map((a) => (
                <div key={a.id} className="rounded-2xl border bg-card p-3 text-sm shadow-cozy">
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
              s <= step ? 'bg-cozy-lavender' : 'bg-border'
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
