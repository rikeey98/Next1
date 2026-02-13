import { createClient } from '@/lib/supabase/server'
import TodoList from '@/components/todos/TodoList'
import AddTodo from '@/components/todos/AddTodo'

export const dynamic = 'force-dynamic'

export default async function TodosPage() {
  const supabase = await createClient()

  const { data: todos } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#141413] mb-8 font-heading">
        My Todos
      </h1>

      <AddTodo />

      <div className="mt-6">
        <TodoList initialTodos={todos || []} />
      </div>
    </div>
  )
}
