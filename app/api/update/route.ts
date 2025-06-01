//update club information
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
    const body = await req.json();

    //updated information from the form
    const {studentName, studentEmail, contactName, contactEmail, club} = body;

    //insert the student into the database unless a student with the same ID is already in that club
    const query = `
      UPDATE club_list
      SET studentname = $1, studentemail = $2, contactname = $3, contactemail = $4
      WHERE club_name = $5
      RETURNING *;
    `;

    const values = [studentName, studentEmail, contactName, contactEmail, club];
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
