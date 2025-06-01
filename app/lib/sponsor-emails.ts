//fetches data for all approved clubs (for sponsor emails)
import postgres from 'postgres';
import {
  Club,
} from './definitions';

//database information
const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: 'require',
  prepare: false,
});

//fetches data for approved clubs only
export async function fetchInfo() {
  try {
    const data = await sql<Club[]>`
      SELECT club_name,
      contactEmail AS "contactEmail", status
      FROM testing_list
      WHERE status = ${'approved'}
      ORDER BY club_name ASC`;

    const clubList = data.map((club) => ({
      ...club,
    }));
    return clubList;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch club information.');
  }
}
