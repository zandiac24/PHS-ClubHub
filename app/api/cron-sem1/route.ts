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
  const emailJobs = clubList.map(async (club) => {
  try {
    if (!club.contactEmail || !club.contactEmail.includes('@')) {
            console.log(`Skipping invalid email for club ${club.club_name}: ${club.contactEmail}`);
            return;
        }
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + (336 * 60 * 60 * 1000));
        
        await sql`
            INSERT INTO sponsor_sessions (token, sponsor_email, created_at, expires_at, used)
            VALUES (${token}, ${club.contactEmail}, ${new Date(Date.now())}, ${expiresAt}, ${false})
        `
        const loginUrl = `${process.env.BASE_URL}/login?token=${token}`;
        const directoryUrl = `${process.env.BASE_URL}/dashboard/club-directory`;

    const mailOptions = {
        from: process.env.GMAIL_USERNAME,
        to: club.contactEmail,
        subject: 'Club Renewal',
        html:  `
        <div>    
        <p>Good morning. We're reviewing the club lists and want to see how things are going and to check on the the status of your club, ${club.club_name}.</p>
        <ol>
            <li>Please use <a href=${loginUrl}>this form</a> to let us know if your club is going to continue next year. The link will expire in 14 days.</li>
            <li>Review the current details about your club at the <a href=${directoryUrl}>Poolesville Club Hub</a>, and use the form linked above to update necessary changes to your club - student leader, meeting details, sponsor, etc.</li>
        </ol>
        <p>Thank you, <br>Mr. Young</p>
        </div>
        `,
    };
    await transporter.sendMail(mailOptions);
    console.log('Email sent to admin:', club.contactEmail);
    } catch (error) {
    console.error(error);
   }
});
  await Promise.allSettled(emailJobs);
  return new Response(JSON.stringify({ message: 'Emails attempted for all clubs!' }), { status: 200 });
}
  
