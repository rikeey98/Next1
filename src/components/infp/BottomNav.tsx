'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sun, Waves, Moon, Footprints } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { title: '아침', href: '/infp/morning', icon: Sun },
  { title: '파도', href: '/infp/wave', icon: Waves },
  { title: '밤', href: '/infp/night', icon: Moon },
  { title: '발자국', href: '/infp/footprints', icon: Footprints },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white/80 shadow-cozy-lg backdrop-blur-lg">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center gap-1 px-4 py-1 text-xs font-medium transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary/70'
              )}
            >
              <item.icon className={cn('h-5 w-5', isActive && 'fill-secondary/50')} />
              {item.title}
              {isActive && (
                <span className="absolute -bottom-1 h-1 w-4 rounded-full bg-primary/60" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
