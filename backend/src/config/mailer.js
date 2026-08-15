const nodemailer = require('nodemailer');

// The app must not crash if SMTP is not configured (e.g. local development).
// We build a transporter only if credentials are present; otherwise we log
// emails to the console instead of sending them.

let transporter = null;

const smtpConfigured =
  !!process.env.SMTP_HOST && !!process.env.SMTP_USER && !!process.env.SMTP_PASS;

if (smtpConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} else {
  console.warn(
    'SMTP is not configured (SMTP_HOST/SMTP_USER/SMTP_PASS missing). ' +
      'Emails will be logged to the console instead of being sent. ' +
      'Set these in your .env to enable real email delivery.'
  );
}

/**
 * Sends an email. Never throws - a failed/unconfigured email should never
 * crash a request (e.g. a booking must still save even if the email fails).
 */
async function sendEmail({ to, subject, html, text }) {
  const fromName = process.env.SMTP_FROM_NAME || "Meer Brother's Salon";
  const from = `"${fromName}" <${process.env.SMTP_USER || 'no-reply@meerbrotherssalon.local'}>`;

  if (!transporter) {
    console.log('--- EMAIL (SMTP not configured, logging only) ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(text || html);
    console.log('---------------------------------------------------');
    return { delivered: false, reason: 'SMTP not configured' };
  }

  try {
    await transporter.sendMail({ from, to, subject, html, text });
    return { delivered: true };
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err.message);
    return { delivered: false, reason: err.message };
  }
}

module.exports = { sendEmail, smtpConfigured };
