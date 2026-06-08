import nodemailer from "nodemailer";

/**
 * Email helper. Configure SMTP via env vars. In development, if SMTP is not
 * configured, emails are logged to the console instead of sent.
 */
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST) return null;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
}

export async function sendEmail({ to, subject, html }) {
  const t = getTransporter();
  if (!t) {
    console.log(`📧 [DEV EMAIL] To: ${to} | Subject: ${subject}`);
    return { dev: true };
  }
  return t.sendMail({
    from: process.env.EMAIL_FROM || "FitHub <no-reply@fithub.app>",
    to,
    subject,
    html,
  });
}
