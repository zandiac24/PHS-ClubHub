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
      text: `Club Name: ${club_name}  \n\nCategory: ${category} \n\nDescription: ${description} \n\nStudent Name: ${studentName} \n\nStudent Email: ${studentEmail} \n\nSponsor Name: ${contactName}  \n\nSponsor Email: ${contactEmail} \n\nMeeting Days/Times: ${meeting_days_time} \n\nMeeting Location: ${meeting_location} ${additional_info && `\n\nAdditional Information: ${additional_info}`}`,
    });

    return new Response(JSON.stringify({ message: 'Email sent successfully!' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to send email.' }), { status: 500 });
  }
}
