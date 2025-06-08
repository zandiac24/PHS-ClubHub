//semester 2 emails
import type { NextRequest } from 'next/server';
import { fetchInfo } from '@/app/lib/sponsor-emails';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: 'require',
  prepare: false,
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  const authHeader = request.headers.get('authorization');
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
  
  if (!authHeader || authHeader !== expectedAuth) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    //parse batch parameters from request body
    const body = await request.json().catch(() => ({}));
    const { batchNumber = 1, totalBatches = 4 } = body;

    console.log(`Processing batch ${batchNumber}/${totalBatches}`);

    //fetch all clubs
    const clubList = await fetchInfo();
    const validClubs = clubList.filter(club => 
      club.contactEmail && club.contactEmail.includes('@')
    );

    //calculate batch size and range
    const batchSize = Math.ceil(validClubs.length / totalBatches);
    const startIndex = (batchNumber - 1) * batchSize;
    const endIndex = Math.min(startIndex + batchSize, validClubs.length);
    const batchClubs = validClubs.slice(startIndex, endIndex);

    console.log(`Batch ${batchNumber}: Processing ${batchClubs.length} clubs (indices ${startIndex}-${endIndex-1})`);

    //if this is the first batch, clear sessions
    if (batchNumber === 1) {
      await sql`DELETE FROM sponsor_sessions`;
      console.log('Cleared sponsor_sessions table');
    }

    //generate tokens and email content for this batch
    const emailJobs = batchClubs.map(club => {
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + (336 * 60 * 60 * 1000));
      
      return {
        club,
        token,
        expiresAt,
        loginUrl: `${process.env.BASE_URL}/login?token=${token}`,
        directoryUrl: `${process.env.BASE_URL}/dashboard/club-directory`,
        mailOptions: {
          from: process.env.GMAIL_USERNAME,
          to: club.contactEmail,
          subject: 'Club Renewal - Semester 2',
          html:  `
            <div>    
            <p>Good morning. Thank you for your work with your club, ${club.club_name}, this year. To prepare for next year, we're in the process of updating the club list and details for each club. Please let us know the following details:</p>
            <ol>
                <li>Please use <a href="${process.env.BASE_URL}/login?token=${token}">this form</a> to let us know if your club is going to continue next year. The link will expire in 14 days.</li>
                <li>Review the current details about your club at the <a href="${process.env.BASE_URL}/dashboard/club-directory">Poolesville Club Hub</a>, and use the form linked above to update necessary changes to your club - student leader, meeting details, sponsor, etc.</li>
            </ol>
            <p>Thank you, <br>Mr. Young</p>
            </div>
          `,
        }
      };
    });

    //insert database records for this batch
    if (emailJobs.length > 0) {
      const dbPromises = emailJobs.map(job => 
        sql`
          INSERT INTO sponsor_sessions (token, sponsor_email, created_at, expires_at, used)
          VALUES (${job.token}, ${job.club.contactEmail}, ${new Date()}, ${job.expiresAt}, ${false})
        `
      );
      
      await Promise.all(dbPromises);
      console.log(`Inserted ${emailJobs.length} database records`);
    }

    //send emails for this batch
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateLimit: 10,
    });

    const results = { success: 0, failed: 0 };
    
    //send emails with staggered timing
    const emailPromises = emailJobs.map(async (job, index) => {
      try {
        //stagger emails to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, index * 200)); // 200ms stagger
        
        await transporter.sendMail(job.mailOptions);
        results.success++;
        console.log(`Sent email to ${job.club.contactEmail}`);
      } catch (error) {
        results.failed++;
        console.error(`Failed to send email to ${job.club.contactEmail}:`, error);
      }
    });

    //wait for all emails with timeout
    const emailTimeout = 45000;
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Email sending timeout')), emailTimeout)
    );

    try {
      await Promise.race([
        Promise.allSettled(emailPromises),
        timeoutPromise
      ]);
    } catch (timeoutError) {
      console.warn('Email sending hit timeout, but some may still be processing');
    }

    transporter.close();
    
    const totalTime = Date.now() - startTime;
    console.log(`Batch ${batchNumber} completed in ${totalTime}ms`);

    return new Response(
      JSON.stringify({ 
        message: `Batch ${batchNumber}/${totalBatches} completed`,
        batchNumber,
        totalBatches,
        executionTime: `${totalTime}ms`,
        results: {
          total: validClubs.length,
          processed: emailJobs.length,
          success: results.success,
          failed: results.failed,
          skipped: clubList.length - validClubs.length
        }
      }), 
      { status: 200 }
    );
    
  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`Batch job error after ${totalTime}ms:`, error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        detail: error instanceof Error ? error.message : 'Unknown error',
        executionTime: `${totalTime}ms`
      }), 
      { status: 500 }
    );
  }
}
