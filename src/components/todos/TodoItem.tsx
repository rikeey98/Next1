'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Todo } from '@/types/database'

interface TodoItemProps {
  todo: Todo
}

export default function TodoItem({ todo }: TodoItemProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleToggle = async () => {
    setIsUpdating(true)
    const supabase = createClient()

    await supabase
      .from('todos')
      .update({ completed: !todo.completed })
      .eq('id', todo.id)

    setIsUpdating(false)
    router.refresh()
  }

  const handleDelete = async () => {
    setIsUpdating(true)
    const supabase = createClient()

    await supabase
      .from('todos')
      .delete()
      .eq('id', todo.id)

    router.refresh()
  }

  return (
    <li className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-[#e8e6dc]">
      <button
        onClick={handleToggle}
        disabled={isUpdating}
        className={`
          w-6 h-6 rounded-full border-2 flex items-center justify-center
          transition-colors disabled:opacity-50
          ${todo.completed
            ? 'bg-[#788c5d] border-[#788c5d]'
            : 'border-[#b0aea5] hover:border-[#d97757]'
          }
        `}
      >
        {todo.completed && (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <span className={`
        flex-1 text-[#141413]
        ${todo.completed ? 'line-through text-[#b0aea5]' : ''}
      `}>
        {todo.title}
      </span>

      <button
        onClick={handleDelete}
        disabled={isUpdating}
        className="p-1 text-[#b0aea5] hover:text-[#d97757] transition-colors disabled:opacity-50"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </li>
  )
}
