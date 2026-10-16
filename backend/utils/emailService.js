import 'dotenv/config';
import nodemailer from 'nodemailer';

/**
 * Create SMTP transporter based on environment configuration
 */
const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = (process.env.SMTP_USER || process.env.EMAIL_USER || 'hemantkakran100@gmail.com').trim();
  const rawPass = (process.env.SMTP_PASS || process.env.EMAIL_PASS || 'tcpg ethu rkqb yotm').trim();
  const pass = rawPass.replace(/\s+/g, '');

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  // Gmail SMTP transporter
  if (user && pass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });
  }

  return null;
};

/**
 * Send 6-digit verification OTP email to new user
 */
export const sendOtpEmail = async (email, otp, name = 'Patient') => {
  const userEmail = email.trim();
  const userName = name.trim() || 'Patient';
  const transporter = createTransporter();

  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const mailOptions = {
    from: process.env.SMTP_FROM || (user ? `"ArogyaCareAI Healthcare" <${user}>` : '"ArogyaCareAI Healthcare" <no-reply@arogyacare.ai>'),
    to: userEmail,
    subject: `🔐 Your ArogyaCareAI Verification Code: ${otp}`,
    text: `Hello ${userName},\n\nYour 6-digit verification code for ArogyaCareAI registration is: ${otp}\n\nThis code is valid for 10 minutes. Please do not share this code with anyone.\n\nThank you,\nArogyaCareAI Healthcare Team`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ArogyaCareAI Verification Code</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #04120e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #04120e; padding: 40px 10px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="540" cellpadding="0" cellspacing="0" style="max-width: 540px; background-color: #071a14; border: 1px solid rgba(0, 229, 153, 0.25); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                
                <!-- Header -->
                <tr>
                  <td style="padding: 32px 36px; background: linear-gradient(135deg, #061c15 0%, #0a2d22 100%); border-bottom: 1px solid rgba(0, 229, 153, 0.2); text-align: center;">
                    <div style="display: inline-block; padding: 10px 18px; border-radius: 12px; background: rgba(0, 229, 153, 0.12); border: 1px solid rgba(0, 229, 153, 0.3); margin-bottom: 12px;">
                      <span style="font-size: 22px; font-weight: 800; color: #00e599; letter-spacing: -0.5px;">ArogyaCare<span style="color: #ffffff;">AI</span></span>
                    </div>
                    <h2 style="margin: 0; font-size: 18px; font-weight: 700; color: #ffffff;">Email Verification Code</h2>
                    <p style="margin: 6px 0 0; font-size: 12px; color: #94a3b8;">Secure Digital Health & Appointment Portal</p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 36px 36px 24px;">
                    <p style="margin: 0 0 16px; font-size: 15px; color: #cbd5e1; line-height: 1.6;">
                      Hello <strong style="color: #00e599;">${userName}</strong>,
                    </p>
                    <p style="margin: 0 0 24px; font-size: 13px; color: #94a3b8; line-height: 1.6;">
                      Thank you for joining ArogyaCareAI. To complete your patient registration and secure your medical account, please use the 6-digit one-time verification code below:
                    </p>

                    <!-- OTP Code Box -->
                    <div style="background-color: #04120e; border: 2px dashed #00e599; border-radius: 16px; padding: 24px; text-align: center; margin: 28px 0;">
                      <span style="display: block; font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 2px; color: #94a3b8; margin-bottom: 8px;">Your 6-Digit OTP</span>
                      <span style="font-family: monospace, Courier, sans-serif; font-size: 38px; font-weight: 800; color: #00e599; letter-spacing: 8px; text-shadow: 0 0 15px rgba(0, 229, 153, 0.4);">${otp}</span>
                      <span style="display: block; font-size: 11px; color: #64748b; margin-top: 10px;">Expires in <strong>10 minutes</strong></span>
                    </div>

                    <!-- Security Alert -->
                    <div style="background-color: rgba(239, 68, 68, 0.08); border-left: 3px solid #ef4444; border-radius: 8px; padding: 12px 16px; margin: 24px 0 10px;">
                      <p style="margin: 0; font-size: 11px; color: #fca5a5; line-height: 1.5;">
                        <strong>Security Notice:</strong> Never share this OTP with anyone. ArogyaCareAI doctors and medical staff will never ask you for your verification code.
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 24px 36px; background-color: #051410; border-top: 1px solid rgba(0, 229, 153, 0.1); text-align: center;">
                    <p style="margin: 0; font-size: 11px; color: #64748b;">
                      If you did not request this registration, you can safely ignore this email.
                    </p>
                    <p style="margin: 8px 0 0; font-size: 10px; color: #475569;">
                      © ${new Date().getFullYear()} ArogyaCareAI Healthcare Systems. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };

  // If real transporter is configured, attempt sending
  if (transporter) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`[ArogyaCareAI Mailer] OTP email successfully dispatched to ${userEmail} (Message ID: ${info.messageId})`);
      return { success: true, delivered: true, messageId: info.messageId };
    } catch (err) {
      console.error(`[ArogyaCareAI Mailer] SMTP sending error to ${userEmail}:`, err.message);
      // Fallback to console delivery log in dev
    }
  }

  // Fallback / Development mode logging
  console.log(`\n======================================================`);
  console.log(`[ArogyaCareAI Mailer - LOCAL / DEV MODE]`);
  console.log(`To:        ${userEmail} (${userName})`);
  console.log(`OTP Code:  >>> ${otp} <<<`);
  console.log(`Validity:  10 Minutes`);
  console.log(`Note:      Configure SMTP_USER & SMTP_PASS in backend/.env for live inbox delivery`);
  console.log(`======================================================\n`);

  return { success: true, delivered: false, simulated: true, otp };
};
