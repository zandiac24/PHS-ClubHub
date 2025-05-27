//fetches data for all approved clubs (for display in directory)
import postgres from 'postgres';
import {
  Club,
} from './definitions';

//database information
const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: 'require',
  prepare: false,
});

//fetches clubs in category (cat)
export async function fetchClubs(cat: string) {
  try {
    const data = await sql<Club[]>`
      SELECT club_name, description,
      studentName AS "studentName",
      studentEmail AS "studentEmail", 
      contactName AS "contactName",
      contactEmail AS "contactEmail",
      meeting_days_time, meeting_location, additional_info, status
      FROM club_list
      WHERE category = ${cat} AND status = ${'approved'}
      ORDER BY club_name ASC`;

    const clubList = data.map((club) => ({
      ...club,
    }));
    return clubList;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the club list.');
  }
}
