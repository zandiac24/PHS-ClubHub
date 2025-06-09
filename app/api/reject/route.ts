//rejects a pending club- delete from database
import { Pool } from 'pg';
import { NextResponse } from 'next/server';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    //get club name (primary key)
    const {club_name} = body;

    //delete the club 
    const query1 = `
      DELETE FROM club_list
      WHERE club_name = $1;
    `;
     const query2 = `
      DELETE FROM student_roster
      WHERE club = $1;
    `;

    const values = [club_name];

    const result = await pool.query(query1, values);
    await pool.query(query2, values);

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
