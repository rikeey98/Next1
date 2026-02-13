'use client'

import type { Todo } from '@/types/database'
import TodoItem from './TodoItem'

interface TodoListProps {
  initialTodos: Todo[]
}

export default function TodoList({ initialTodos }: TodoListProps) {
  if (initialTodos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-[#e8e6dc] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#b0aea5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-[#b0aea5]">
          No todos yet. Add one above!
        </p>
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {initialTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}
