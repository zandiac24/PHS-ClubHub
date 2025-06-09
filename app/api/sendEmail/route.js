//send an email notification to Mr. Young via nodemailer
//for new club applications (only valid/non-duplicate ones)
import nodemailer from 'nodemailer';

export async function POST(req) {
  //get club information
  const body = await req.json();
  const { club_name, studentName, studentEmail, description, category, contactName, contactEmail, meeting_days_time, meeting_location, additional_info} = body;

  //defines the sender
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  //email format/message
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USERNAME,
      to: 'brycefowlkes@gmail.com',
      subject: `New Club Application`,
      html: `
            <div>
              <p>Club Name: ${club_name}</p>
              <p>Category: ${category}</p>
              <p>Description: ${description}</p>
              <p>Student Name: ${studentName}</p>
              <p>Student Email: ${studentEmail}</p>
              <p>Sponsor Name: ${contactName}</p>
              <p>Sponsor Email: ${contactEmail}</p>
              <p>Meeting Days/Times: ${meeting_days_time}</p>
              <p>Meeting Location: ${meeting_location}</p>
              ${additional_info && `<p>Additional Information: ${additional_info}</p>`}
              <p>Click <a href="https://phs-clubhub.vercel.app/dashboard/approval">here</a> to review pending club details.</p>
            </div>
          `,
    });

    return new Response(JSON.stringify({ message: 'Email sent successfully!' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to send email.' }), { status: 500 });
  }
}
