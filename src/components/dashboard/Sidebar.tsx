'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CheckSquare,
  Settings,
  Home,
  Sun,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Todos',
    href: '/todos',
    icon: CheckSquare,
  },
  {
    title: 'INFP TODO',
    href: '/morning',
    icon: Sun,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r bg-[#141413]">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[#faf9f5] font-heading">
          <Home className="h-6 w-6" />
          Next1
        </Link>
      </div>
      <Separator />
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#d97757] text-[#faf9f5]'
                  : 'text-[#b0aea5] hover:bg-[#d97757]/10 hover:text-[#faf9f5]'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>
      <Separator />
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-[#b0aea5] hover:text-[#faf9f5] hover:bg-[#d97757]/10"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          로그아웃
        </Button>
      </div>
    </aside>
  )
}
