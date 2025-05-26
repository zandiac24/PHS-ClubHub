import { NextResponse } from 'next/server';
import { fetchAllClubs } from '@/app/lib/club_names';

export async function GET() {
  try {
    const clubs = await fetchAllClubs();
    return NextResponse.json(clubs);
  } catch (error) {
    console.error('Error fetching clubs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clubs' }, 
      { status: 500 }
    );
  }
}
