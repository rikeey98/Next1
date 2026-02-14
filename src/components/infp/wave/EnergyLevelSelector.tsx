'use client'

import { cn } from '@/lib/utils'
import { ENERGY_LABELS } from '@/lib/infp/utils'

interface EnergyLevelSelectorProps {
  selected: number | null
  onSelect: (level: number) => void
}

export default function EnergyLevelSelector({ selected, onSelect }: EnergyLevelSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {ENERGY_LABELS.map((item) => (
        <button
          key={item.level}
          onClick={() => onSelect(item.level)}
          className={cn(
            'flex flex-col items-center gap-1 rounded-2xl border p-4 transition-all',
            selected === item.level
              ? 'border-primary bg-secondary/30 shadow-cozy'
              : 'border-border bg-card hover:border-secondary'
          )}
        >
          <span className="text-2xl">{item.emoji}</span>
          <span className="text-sm font-medium">{item.label}</span>
          <span className="text-xs text-muted-foreground">{item.description}</span>
        </button>
      ))}
    </div>
  )
}
