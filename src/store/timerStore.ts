import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TimerState {
  // Timer data
  microActionId: string | null
  microActionText: string
  totalSeconds: number
  remainingSeconds: number
  status: 'idle' | 'running' | 'paused'

  // Actions
  startTimer: (microActionId: string, text: string, durationSeconds: number) => void
  pauseTimer: () => void
  resumeTimer: () => void
  tick: () => void
  resetTimer: () => void
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      microActionId: null,
      microActionText: '',
      totalSeconds: 120,
      remainingSeconds: 120,
      status: 'idle',

      startTimer: (microActionId, text, durationSeconds) => {
        set({
          microActionId,
          microActionText: text,
          totalSeconds: durationSeconds,
          remainingSeconds: durationSeconds,
          status: 'running',
        })
      },

      pauseTimer: () => {
        set({ status: 'paused' })
      },

      resumeTimer: () => {
        set({ status: 'running' })
      },

      tick: () => {
        const { remainingSeconds, status } = get()
        if (status === 'running' && remainingSeconds > 0) {
          const newRemaining = remainingSeconds - 1
          if (newRemaining === 0) {
            set({ remainingSeconds: 0, status: 'idle' })
          } else {
            set({ remainingSeconds: newRemaining })
          }
        }
      },

      resetTimer: () => {
        set({
          microActionId: null,
          microActionText: '',
          totalSeconds: 120,
          remainingSeconds: 120,
          status: 'idle',
        })
      },
    }),
    {
      name: 'timer-storage',
    }
  )
)
