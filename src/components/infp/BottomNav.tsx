'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sun, Waves, Moon, Footprints } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { title: '아침', href: '/morning', icon: Sun },
  { title: '파도', href: '/wave', icon: Waves },
  { title: '밤', href: '/night', icon: Moon },
  { title: '발자국', href: '/footprints', icon: Footprints },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-1 text-xs font-medium transition-colors',
                isActive
                  ? 'text-indigo-600'
                  : 'text-muted-foreground hover:text-indigo-400'
              )}
            >
              <item.icon className={cn('h-5 w-5', isActive && 'fill-indigo-100')} />
              {item.title}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
