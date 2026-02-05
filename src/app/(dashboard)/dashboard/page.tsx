import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import StatsCard from '@/components/dashboard/StatsCard'
import TodoTable from '@/components/dashboard/TodoTable'
import { ListTodo, CheckCircle2, Clock, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: todos } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false })

  const allTodos = todos || []
  const completedTodos = allTodos.filter((todo) => todo.completed)
  const pendingTodos = allTodos.filter((todo) => !todo.completed)
  const completionRate = allTodos.length > 0
    ? Math.round((completedTodos.length / allTodos.length) * 100)
    : 0

  const recentTodos = allTodos.slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your todos.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Todos"
          value={allTodos.length}
          description="All your tasks"
          icon={ListTodo}
        />
        <StatsCard
          title="Completed"
          value={completedTodos.length}
          description="Tasks done"
          icon={CheckCircle2}
        />
        <StatsCard
          title="Pending"
          value={pendingTodos.length}
          description="Tasks remaining"
          icon={Clock}
        />
        <StatsCard
          title="Completion Rate"
          value={`${completionRate}%`}
          description="Overall progress"
          icon={TrendingUp}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Todos</CardTitle>
            <CardDescription>Your latest tasks at a glance</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/todos">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <TodoTable todos={recentTodos} />
        </CardContent>
      </Card>
    </div>
  )
}
