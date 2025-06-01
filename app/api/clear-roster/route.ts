//delete everything in the roster
import { Pool } from 'pg';
import { NextResponse } from 'next/server';

//database information
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

export async function POST(req: Request) {
  try {
    //delete all students from the roster
    const query = `
      DELETE FROM student_roster
      RETURNING *;
    `;
    const result = await pool.query(query);
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
