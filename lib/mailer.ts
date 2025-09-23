// src/lib/mailer.ts
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // use TLS (true for 465, false for other ports)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.APP_URL}/api/auth/verify?token=${token}`;

  await transporter.sendMail({
    from: `"CodeChat" <no-reply@codechat.com>`,
    to: email,
    subject: "Verify your email",
    html: `
      <h1>Verify your email</h1>
      <p>Click below to verify your account:</p>
      <a href="${verifyUrl}">Verify Email</a>
      <p>If you didn’t create this account, ignore this message.</p>
    `,
  });
}

export async function sendResetPasswordEmail(email: string, token: string) {
  const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"CodeChat Support" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset your password",
    html: `
      <h1>Reset your password</h1>
      <p>Click below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>If you didn’t request this, please ignore this email.</p>
    `,
  });
}
