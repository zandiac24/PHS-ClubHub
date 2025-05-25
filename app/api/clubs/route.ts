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

    const { club_name, studentName, studentEmail, description, category, contactName, contactEmail, meeting_days_time, meeting_location, additional_info, status } = body;

    const query = `
      INSERT INTO club_list (club_name, studentName, studentEmail, description, category, contactName, contactEmail, meeting_days_time, meeting_location, additional_info, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (club_name) DO NOTHING
      RETURNING *;
    `;

    const values = [club_name, studentName, studentEmail, description, category, contactName, contactEmail, meeting_days_time, meeting_location, additional_info, status];
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
