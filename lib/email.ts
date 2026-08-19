import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@skyrellac.com';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
});

export async function sendVerificationEmail(toEmail: string, fullName: string, verificationLink: string) {
  const mailOptions = {
    from: `"Skyrellac Education" <${FROM_EMAIL}>`,
    to: toEmail,
    subject: 'Verify your Skyrellac Account Email',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; color: #161616; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e0e0e0; padding: 40px; }
          .header { border-b: 2px solid #0f62fe; padding-bottom: 16px; margin-bottom: 24px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; font-size: 14px; color: #161616; }
          .button { display: inline-block; background-color: #0f62fe; color: #ffffff !important; padding: 14px 28px; text-decoration: none; font-size: 14px; font-weight: 500; margin: 24px 0; }
          .footer { font-size: 12px; color: #8d8d8d; margin-top: 32px; border-t: 1px solid #e0e0e0; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">SKYRELLAC</div>
          <h2>Verify your email address</h2>
          <p>Hello ${fullName},</p>
          <p>Thank you for signing up for Skyrellac. Please click the button below to verify your email address and activate your account:</p>
          <a href="${verificationLink}" class="button" target="_blank">Verify Email Address</a>
          <p>Or copy and paste this link into your browser:</p>
          <p><a href="${verificationLink}">${verificationLink}</a></p>
          <p>This link will expire in 24 hours.</p>
          <div class="footer">
            If you did not request this email, please ignore it.
          </div>
        </div>
      </body>
      </html>
    `,
  };

  // In production / configured SMTP mode, send the mail
  if (SMTP_USER && SMTP_PASS) {
    await transporter.sendMail(mailOptions);
  } else {
    // Development mode fallback logging
    console.log('\n========================================');
    console.log('📧 [EMAIL VERIFICATION PREVIEW]');
    console.log(`To: ${toEmail}`);
    console.log(`Verification Link: ${verificationLink}`);
    console.log('========================================\n');
  }
}
