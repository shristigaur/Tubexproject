import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: env.SMTP_FROM,
      to,
      subject,
      text,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send email to", to, error instanceof Error ? error.message : "Unknown error");
    // Return structured error to prevent crashing the whole backend
    return { success: false, error: "Failed to send email" };
  }
}

export async function verifyMailConnection() {
  try {
    const success = await transporter.verify();
    if (success) {
      console.log("SMTP configuration verified");
    }
  } catch (error) {
    console.error("SMTP configuration verification failed");
    // Do not log the specific error credentials or crash production
  }
}
