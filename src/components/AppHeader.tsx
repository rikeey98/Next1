import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import LogoutButton from '@/components/LogoutButton'

export default async function AppHeader() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-lg font-bold text-white group-hover:text-slate-300 transition-colors">
            Next1
          </span>
          <span className="hidden sm:inline-block rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-400 border border-slate-700">
            MVP Launchpad
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-slate-500 hidden sm:inline">
                {user.email}
              </span>
              <LogoutButton />
            </>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm" className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white">
                로그인
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
