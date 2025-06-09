//protects certain pages unless the user is logged in
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

//protect /dashboard/approval and /dashboard/update routes
export function middleware(request: NextRequest) {

  //only allow admin panel with teacher-auth
  if (request.nextUrl.pathname.startsWith('/dashboard/approval')) {
    const isAuthenticated = request.cookies.get('teacher-auth')
    
    //redirect to login page if they aren't logged in
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  //only allow updates with sponsor-auth or teacher-auth
  if (request.nextUrl.pathname.startsWith('/dashboard/update')) {
    const teacherAuth = request.cookies.get('teacher-auth')
    const sponsorAuth = request.cookies.get('sponsor-auth')
    const isAuthenticated = (sponsorAuth && sponsorAuth.value === 'authenticated') || (teacherAuth && teacherAuth.value === 'authenticated')

    if (!isAuthenticated) {
      
        //redirect to login page if they aren't logged in
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  return NextResponse.next()
}

//protected paths
export const config = {
  matcher: ['/dashboard/approval/:path*', '/dashboard/update/:path*']
}