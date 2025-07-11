import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export interface EmailData {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SendGrid API key not configured');
      return false;
    }

    const msg = {
      to: emailData.to,
      from: 'noreply@e3world.co.uk', // This should be a verified sender domain
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html || emailData.text,
    };

    await sgMail.send(msg);
    console.log('Email sent successfully to:', emailData.to);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export function formatAnswerEmail(eNumber: string, userEmail: string, questionText: string, selectedAnswer: string): EmailData {
  const subject = eNumber;
  const text = `
New answer submission:

E Number: ${eNumber}
User Email: ${userEmail}
Question: ${questionText}
Answer: ${selectedAnswer}

Submitted at: ${new Date().toISOString()}
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #292929; border-bottom: 2px solid #e7e6e3; padding-bottom: 10px;">New Answer Submission</h2>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>E Number:</strong> ${eNumber}</p>
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