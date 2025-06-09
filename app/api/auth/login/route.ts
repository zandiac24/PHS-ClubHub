//admin login to access protected admin panel
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: 'require',
  prepare: false,
});

export async function POST(request: NextRequest) {
  try {
    //parse username and password from json
    const { username, password, token } = await request.json()

    //check credentials against env variables
    if(username && password) {
    if (
      username === process.env.TEACHER_USERNAME &&
      password === process.env.TEACHER_PASSWORD
    ) {
      //sets an HTTP cookie (teacher-auth) to authenticated
      const cookieStore = await cookies()
      cookieStore.set('teacher-auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        //cookie expires after 24 hours
        maxAge: 60 * 60 * 24
      })

      return NextResponse.json({ success: true, type:'admin'})
    } 
    else{
        return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
        )
    }
}
    else if(token) {
        const sessions = await sql`
            SELECT * FROM sponsor_sessions
            WHERE token = ${token}
            LIMIT 1`
        
        const session = sessions[0]

        if(!session){
            return NextResponse.json(
            { error: 'Invalid token' },
            { status: 401 }
            )
        }
        // if(new Date() > new Date(session.expires_at)) {
        //     console.log('expired date')
        //     await sql`
        //     DELETE FROM sponsor_sessions
        //     WHERE token = ${token}`

        //     return NextResponse.json(
        //     { error: 'Expired token' },
        //     { status: 401 }
        //     )
        // }
        // if(session.used) {
        //     return NextResponse.json(
        //     { error: 'Token has already been used.' },
        //     { status: 401 }
        //     )
        // }
        await sql`
        UPDATE sponsor_sessions
        SET used = true
        WHERE id = ${session.id}
        `
    // sets an HTTP cookie (sponsor-auth) to authenticated
      const cookieStore = await cookies()
      cookieStore.set('sponsor-auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        //cookie expires after 24 hours
        maxAge: 60 * 60 * 24
      })

      return NextResponse.json({ success: true, type:'sponsor' })
    }
    else {
      return NextResponse.json(
        { error: 'Username/password or token required' },
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