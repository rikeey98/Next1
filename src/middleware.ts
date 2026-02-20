import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/',
    '/todos/:path*',
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/infp/:path*',
    '/template/:path*',
    // 새 MVP 추가 시 아래에 한 줄 추가:
    // '/새mvp/:path*',
  ],
}
