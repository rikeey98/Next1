import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Circle } from 'lucide-react'

interface Todo {
  id: string
  title: string
  completed: boolean
  created_at: string
}

interface TodoTableProps {
  todos: Todo[]
}

export default function TodoTable({ todos }: TodoTableProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-[#b0aea5]">
        No todos yet. Create your first todo!
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-[#e8e6dc]">
          <TableHead className="w-[50px] text-[#b0aea5]">Status</TableHead>
          <TableHead className="text-[#b0aea5]">Task</TableHead>
          <TableHead className="w-[150px] text-[#b0aea5]">Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {todos.map((todo) => (
          <TableRow key={todo.id} className="border-[#e8e6dc]">
            <TableCell>
              {todo.completed ? (
                <CheckCircle2 className="h-5 w-5 text-[#788c5d]" />
              ) : (
                <Circle className="h-5 w-5 text-[#b0aea5]" />
              )}
            </TableCell>
            <TableCell className="font-medium">
              <span className={todo.completed ? 'line-through text-[#b0aea5]' : 'text-[#141413]'}>
                {todo.title}
              </span>
            </TableCell>
            <TableCell>
              <Badge
                variant={todo.completed ? 'secondary' : 'outline'}
                className={todo.completed
                  ? 'bg-[#788c5d]/10 text-[#788c5d] border-[#788c5d]/20'
                  : 'border-[#e8e6dc] text-[#b0aea5]'
                }
              >
                {new Date(todo.created_at).toLocaleDateString()}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
