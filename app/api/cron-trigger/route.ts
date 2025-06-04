import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const baseUrl = process.env.BASE_URL || 'https://phs-clubhub.vercel.app';

  try {
    const response = await fetch(`${baseUrl}/api/cron`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Optional: Add your CRON_SECRET if you uncomment that check
        // 'Authorization': `Bearer ${process.env.CRON_SECRET}`,
      },
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: response.status });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: 'Failed to trigger cron job', detail: error.message }),
      { status: 500 }
    );
  }
}
