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
    const {studentName, studentEmail, description, contactName, contactEmail, meeting_days_time, meeting_location, additional_info, club} = body;

    const fields: string[] = [];
    const values: string[] = [];
    let paramIndex = 1;

    //only update fields that aren't null
    if(studentName) {
        fields.push(`studentname = $${paramIndex++}`);
        values.push(studentName);
    }

    if(studentEmail) {
        fields.push(`studentemail = $${paramIndex++}`);
        values.push(studentEmail);
    }

    if(description) {
        fields.push(`description = $${paramIndex++}`);
        values.push(description);
    }

    if(contactName) {
        fields.push(`contactname = $${paramIndex++}`);
        values.push(contactName);
    }

    if(contactEmail) {
        fields.push(`contactemail = $${paramIndex++}`);
        values.push(contactEmail);
    }

    if(meeting_days_time) {
        fields.push(`meeting_days_time = $${paramIndex++}`);
        values.push(meeting_days_time);
    }

    if(meeting_location) {
        fields.push(`meeting_location = $${paramIndex++}`);
        values.push(meeting_location);
    }

    if(additional_info) {
        fields.push(`additional_info = $${paramIndex++}`);
        values.push(additional_info);
    }

    values.push(club);

    //insert the student into the database unless a student with the same ID is already in that club
    const query = `
      UPDATE club_list
      SET ${fields.join(', ')}
      WHERE club_name = $${paramIndex}
      RETURNING *;
    `;
    if(values.length === 1) {
      return NextResponse.json({ success: true, inserted: false});
    }
    const result = await pool.query(query, values);
    return NextResponse.json({ success: true, inserted: true, data: result.rows[0] });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
