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
        <h1 className="text-3xl font-bold tracking-tight font-heading text-[#141413]">Dashboard</h1>
        <p className="text-[#b0aea5] font-body">
          Welcome back! Here&apos;s an overview of your todos.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Todos"
          value={allTodos.length}
          description="All your tasks"
          icon={ListTodo}
          accentColor="#d97757"
        />
        <StatsCard
          title="Completed"
          value={completedTodos.length}
          description="Tasks done"
          icon={CheckCircle2}
          accentColor="#788c5d"
        />
        <StatsCard
          title="Pending"
          value={pendingTodos.length}
          description="Tasks remaining"
          icon={Clock}
          accentColor="#6a9bcc"
        />
        <StatsCard
          title="Completion Rate"
          value={`${completionRate}%`}
          description="Overall progress"
          icon={TrendingUp}
          accentColor="#d97757"
        />
      </div>

      <Card className="border-[#e8e6dc] bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-heading text-[#141413]">Recent Todos</CardTitle>
            <CardDescription className="text-[#b0aea5]">Your latest tasks at a glance</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm" className="border-[#d97757] text-[#d97757] hover:bg-[#d97757] hover:text-white">
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
