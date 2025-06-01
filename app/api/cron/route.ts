//send renewal emails to club sponsors via nodemailer
import type { NextRequest} from 'next/server';
import { fetchInfo } from '@/app/lib/sponsor-emails';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
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
            <li>Please use <a href="https://phs-clubhub-git-main-bryces-projects-04fe9edd.vercel.app/dashboard/update">this form</a> to let us know if your club is going to continue next year.</li>
            <li>Review the current details about your club at the <a href="https://phs-clubhub-git-main-bryces-projects-04fe9edd.vercel.app/dashboard/club-directory">Poolesville Club Hub</a>, and use this form (insert the link to your form here) to update necessary changes to your club - student leader, meeting details, sponsor, etc.</li>
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
