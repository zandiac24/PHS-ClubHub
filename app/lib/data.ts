//Fetches data from the tables

import postgres from 'postgres';
import {
  Club,
} from './definitions';
const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: 'require',
  prepare: false,
});

export async function fetchClubs(cat: string) {
  try {
    const data = await sql<Club[]>`
      SELECT club_name, description, 
      contactName AS "contactName",
      contactEmail AS "contactEmail",
      meeting_days_time, meeting_location, additional_info, status
      FROM club_list
      WHERE category = ${cat} AND status = ${'approved'}
      ORDER BY club_name ASC`;
    //console.log(data); for debugging
    const clubList = data.map((club) => ({
      ...club,
    }));
    return clubList;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the club list.');
  }
}
