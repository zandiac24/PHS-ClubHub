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

    const {firstName, lastName, studentID, club} = body;

    const query = `
      INSERT INTO student_roster (first_name, last_name, student_ID, club)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (student_ID, club) DO NOTHING
      RETURNING *;
    `;

    const values = [firstName, lastName, studentID, club];
    const result = await pool.query(query, values);
    if(result.rows.length === 0) {
      return NextResponse.json({ success: true, inserted: false});
    }
    return NextResponse.json({ success: true, inserted: true, data: result.rows[0] });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
