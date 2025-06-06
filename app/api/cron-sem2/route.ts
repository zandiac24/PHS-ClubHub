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
//   const authHeader = request.headers.get('authorization');
//   if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
//     return new Response('Unauthorized', {
//       status: 401,
//     });
//   }
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
  try {
    for (const club of clubList) {
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + (336 * 60 * 60 * 1000));
        
        await sql`
            INSERT INTO sponsor_sessions (token, sponsor_email, created_at, expires_at, used)
            VALUES (${token}, ${club.contactEmail}, ${new Date(Date.now())}, ${expiresAt}, ${false})
        `
        const loginUrl = `${process.env.BASE_URL}/login?token=${token}`;
        const directoryUrl = `${process.env.BASE_URL}/dashboard/club-directory`;

        if (!club.contactEmail || !club.contactEmail.includes('@')) {
            console.log(`Skipping invalid email for club ${club.club_name}: ${club.contactEmail}`);
            continue;
        }
    console.log('Sending email to admin:', club.contactEmail);
    const mailOptions = {
        from: process.env.GMAIL_USERNAME,
        to: club.contactEmail,
        subject: 'Club Renewal',
        html:  `
        <div>    
        <p>Good morning. Thank you for your work with your club this year. To prepare for next year, we're in the process of updating the club list and details for each club. Please let us know the following details:</p>
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
    await new Promise(resolve => setTimeout(resolve, 1000));    
}

    return new Response(JSON.stringify({ message: 'Email sent successfully!' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to send email.' }), { status: 500 });
  }
}
