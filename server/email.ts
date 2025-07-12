import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailData {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail(emailData: EmailData): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured');
    return false;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@yourdomain.com',
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html || emailData.text,
    });

    if (error) {
      console.error('Email error:', error);
      return false;
    } else {
      console.log('Email sent:', data);
      return true;
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    return false;
  }
}

export async function sendWelcomeEmail(toEmail: string, userName?: string): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured');
    return false;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@yourdomain.com',
      to: toEmail,
      subject: 'Connecting with E3 World 🌍',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; padding: 20px;">
          <h2>Hello${userName ? ` ${userName}` : ''},</h2>
          <p><strong>Thank you for submitting your response — we appreciate your time and curiosity.</strong> Rest assured, your answers remain completely anonymous.</p>

          <p>We're thrilled to welcome you to <strong>E3 World</strong>.</p>

          <p>At E3, our mission is simple: to help people reconnect in meaningful ways. In a world where digital noise often drowns out real connection, we exist to make it easy for you to organise your next face to face meet up. Whether it's reconnecting with an old friend or turning a passing conversation into something more, our platform powered by a simple tap of a ring helps transform fleeting moments into lasting opportunities.</p>

          <p>As we continue to grow, we are excited to share that once we reach <strong>500 users</strong>, we will be introducing an <strong>E3 World application</strong>. This app will allow ring and circle owners to seamlessly connect, schedule meet ups, and build real, in-person communities with ease.</p>

          <p>If you would like to be part of this movement and claim your own <strong>E3 Ring</strong> or <strong>E3 Circle</strong>, click below to get started:</p>

          <p style="text-align: center; margin: 30px 0;">
            👉 <a href="https://e3world.co.uk" style="background-color: #0055ff; color: #fff; padding: 12px 20px; border-radius: 6px; text-decoration: none;">Visit e3world.co.uk</a>
          </p>

          <p>We look forward to reconnecting the world with you.</p>

          <p>Warmly,<br><strong>The E3 World Team</strong></p>
        </div>
      `
    });

    if (error) {
      console.error('Email error:', error);
      return false;
    } else {
      console.log('Welcome email sent:', data);
      return true;
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    return false;
  }
}

export function formatAnswerEmail(profileName: string, userEmail: string, questionText: string, selectedAnswer: string): EmailData {
  const subject = `New Answer from ${profileName}`;
  const text = `
New answer submission:

Profile Name: ${profileName}
User Email: ${userEmail}
Question: ${questionText}
Answer: ${selectedAnswer}

Submitted at: ${new Date().toISOString()}
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #292929; border-bottom: 2px solid #e7e6e3; padding-bottom: 10px;">New Answer Submission</h2>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Profile Name:</strong> ${profileName}</p>
        <p><strong>User Email:</strong> ${userEmail}</p>
        <p><strong>Question:</strong> ${questionText}</p>
        <p><strong>Answer:</strong> <span style="color: #292929; font-weight: bold;">${selectedAnswer}</span></p>
      </div>
      
      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        Submitted at: ${new Date().toLocaleString()}
      </p>
    </div>
  `;

  return {
    to: 'hello@e3world.co.uk',
    subject,
    text,
    html
  };
}