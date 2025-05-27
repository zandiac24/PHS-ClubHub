//admin login to access protected admin panel
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    //parse username and password from json
    const { username, password } = await request.json()

    // check credentials against env variables
    if (
      username === process.env.TEACHER_USERNAME &&
      password === process.env.TEACHER_PASSWORD
    ) {
      // sets an HTTP cookie (teacher-auth) to authenticated
      const cookieStore = await cookies()
      cookieStore.set('teacher-auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        //cookie expires after 24 hours
        maxAge: 60 * 60 * 24
      })

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}