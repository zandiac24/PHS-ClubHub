//send renewal emails to club sponsors via nodemailer
import type { NextRequest} from 'next/server';
import { fetchInfo } from '@/app/lib/sponsor-emails';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: 'require',
  prepare: false,
});


export async function POST(request: NextRequest) {

  const authHeader = request.headers.get('authorization');
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
  
  if (!authHeader || authHeader !== expectedAuth) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try{
        await sql`
            DELETE FROM sponsor_sessions`
  //get club information
  const clubList = await fetchInfo();

  //defines the sender
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  //sending emails
  const BATCH = 5;
  const results ={success:0, failed:0, skipped:0};
  
  for (let i = 0; i < clubList.length; i += BATCH) {
      const batch = clubList.slice(i, i + BATCH);
      
      const batchPromises = batch.map(async (club) => {
        try {
          if (!club.contactEmail || !club.contactEmail.includes('@')) {
            console.log(`Skipping invalid email for club ${club.club_name}: ${club.contactEmail}`);
            results.skipped++;
            return;
          }

          const token = crypto.randomBytes(32).toString('hex');
          const expiresAt = new Date(Date.now() + (336 * 60 * 60 * 1000)); // 14 days

          await sql`
            INSERT INTO sponsor_sessions (token, sponsor_email, created_at, expires_at, used)
            VALUES (${token}, ${club.contactEmail}, ${new Date(Date.now())}, ${expiresAt}, ${false})
          `;

          const loginUrl = `${process.env.BASE_URL}/login?token=${token}`;
          const directoryUrl = `${process.env.BASE_URL}/dashboard/club-directory`;

          const mailOptions = {
            from: process.env.GMAIL_USERNAME,
            to: club.contactEmail,
            subject: 'Club Renewal - Semester 1',
            html: `
              <div>
                <p>Good morning. We're reviewing the club lists and want to see how things are going and to check on the status of your club, ${club.club_name}.</p>
                <ol>
                  <li>Please use <a href="${loginUrl}">this form</a> to let us know if your club is going to continue next year. The link will expire in 14 days.</li>
                  <li>Review the current details about your club at the <a href="${directoryUrl}">Poolesville Club Hub</a>, and use the form linked above to update necessary changes to your club - student leader, meeting details, sponsor, etc.</li>
                </ol>
                <p>Thank you,<br>Mr. Young</p>
              </div>
            `,
          };

          await transporter.sendMail(mailOptions);
          console.log('Email sent to:', club.contactEmail);
          results.success++;
        } catch (error) {
          console.error(`Failed to send email to ${club.contactEmail}:`, error);
          results.failed++;
        }
      });

      await Promise.allSettled(batchPromises);
      
      // Add delay between batches to be respectful to SMTP server
      if (i + BATCH< clubList.length) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Email job completed',
        results: {
          total: clubList.length,
          success: results.success,
          failed: results.failed,
          skipped: results.skipped
        }
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Cron job error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', detail: error instanceof Error ? error.message : 'Unknown error' }), 
      { status: 500 }
    );
  }
}
