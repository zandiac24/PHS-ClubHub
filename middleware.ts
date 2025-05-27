//protects admin panel unless user is logged in
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  //only protect the /dashboard/approval route
  if (request.nextUrl.pathname.startsWith('/dashboard/approval')) {
    const isAuthenticated = request.cookies.get('teacher-auth')
    
    if (!isAuthenticated) {
      //redirect to login page if they aren't logged in
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/dashboard/approval/:path*'
}