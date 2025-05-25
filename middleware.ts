import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only protect the /dashboard/approval route
  if (request.nextUrl.pathname.startsWith('/dashboard/approval')) {
    const isAuthenticated = request.cookies.get('teacher-auth')
    
    if (!isAuthenticated) {
      // Redirect to login page
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/dashboard/approval/:path*'
}