//fetches all approved club names from the tables
import postgres from 'postgres';
import {
  Club,
} from './definitions';

//database information
const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: 'require',
  prepare: false,
});

export async function fetchAllClubs() {
  try {
    //run SQL query to get club names
    const data = await sql<Club[]>`
      SELECT club_name
      FROM club_list
      WHERE status = ${'approved'}
      ORDER BY club_name ASC`;

    //turn club names into a list
    const clubList = data.map((club) => ({
      ...club,
    }));
    
    return clubList;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the club list.');
  }
}
