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

  try {
    // Clear sponsor sessions first
    await sql`DELETE FROM sponsor_sessions`;
    
    // Get club information
    const clubList = await fetchInfo();
    
    // Create transporter once
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
      // Add connection pooling for better performance
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
    });

    // Pre-generate all tokens and database entries
    const validClubs = clubList.filter(club => 
      club.contactEmail && club.contactEmail.includes('@')
    );
    
    const emailData = validClubs.map(club => {
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + (336 * 60 * 60 * 1000)); // 14 days
      return {
        club,
        token,
        expiresAt,
        loginUrl: `${process.env.BASE_URL}/login?token=${token}`,
        directoryUrl: `${process.env.BASE_URL}/dashboard/club-directory`
      };
    });

    // Insert tokens in small batches to avoid timeout while still being efficient
    if (emailData.length > 0) {
      const BATCH_INSERT_SIZE = 10;
      for (let i = 0; i < emailData.length; i += BATCH_INSERT_SIZE) {
        const batch = emailData.slice(i, i + BATCH_INSERT_SIZE);
        const insertPromises = batch.map(data => 
          sql`
            INSERT INTO sponsor_sessions (token, sponsor_email, created_at, expires_at, used)
            VALUES (${data.token}, ${data.club.contactEmail}, ${new Date()}, ${data.expiresAt}, ${false})
          `
        );
        await Promise.all(insertPromises);
      }
    }

    // Send emails in smaller, faster batches
    const BATCH_SIZE = 10; // Increased batch size
    const results = { success: 0, failed: 0, skipped: clubList.length - validClubs.length };
    
    for (let i = 0; i < emailData.length; i += BATCH_SIZE) {
      const batch = emailData.slice(i, i + BATCH_SIZE);
      
      const batchPromises = batch.map(async (data) => {
        try {
          const mailOptions = {
            from: process.env.GMAIL_USERNAME,
            to: data.club.contactEmail,
            subject: 'Club Renewal - Semester 1',
            html: `
              <div>
                <p>Good morning. We're reviewing the club lists and want to see how things are going and to check on the status of your club, ${data.club.club_name}.</p>
                <ol>
                  <li>Please use <a href="${data.loginUrl}">this form</a> to let us know if your club is going to continue next year. The link will expire in 14 days.</li>
                  <li>Review the current details about your club at the <a href="${data.directoryUrl}">Poolesville Club Hub</a>, and use the form linked above to update necessary changes to your club - student leader, meeting details, sponsor, etc.</li>
                </ol>
                <p>Thank you,<br>Mr. Young</p>
              </div>
            `,
          };

          await transporter.sendMail(mailOptions);
          console.log('Email sent to:', data.club.contactEmail);
          results.success++;
        } catch (error) {
          console.error(`Failed to send email to ${data.club.contactEmail}:`, error);
          results.failed++;
        }
      });

      await Promise.allSettled(batchPromises);
      
      // Reduced delay between batches
      if (i + BATCH_SIZE < emailData.length) {
        await new Promise(resolve => setTimeout(resolve, 500)); // 0.5 second delay
      }
    }

    // Close the transporter
    transporter.close();

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