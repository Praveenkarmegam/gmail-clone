import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

export default async function sendMail({ from, to, subject, text, attachments }) {
  await transporter.sendMail({ from, to, subject, text, attachments });
}
