import crypto from "crypto";
import { prisma } from "../lib/prisma.js";
import { hashPassword } from "../lib/auth.js";
import { sendEmail } from "./mail.service.js";

const OTP_EXPIRATION_MINUTES = 10;

export async function generateAndSendOtp(user: { id: string; email: string }) {
  // Generate cryptographically secure 6-digit OTP
  // randomInt ensures uniform distribution unlike Math.random()
  const otp = crypto.randomInt(100000, 1000000).toString();

  // Hash the OTP securely before storing
  const codeHash = await hashPassword(otp);

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRATION_MINUTES);

  // Invalidate any existing OTPs for this user
  await prisma.verificationToken.deleteMany({
    where: { userId: user.id },
  });

  // Store the new hashed OTP
  await prisma.verificationToken.create({
    data: {
      userId: user.id,
      codeHash,
      expiresAt,
    },
  });

  // Send the plaintext OTP via email only
  const subject = "Your TubeX verification code";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>TubeX Verification</h2>
      <p>This is a TubeX verification code. Please use it to securely access your account.</p>
      <div style="background-color: #f4f4f4; padding: 16px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; margin: 20px 0;">
        ${otp}
      </div>
      <p>This code will expire in <strong>${OTP_EXPIRATION_MINUTES} minutes</strong>.</p>
      <p style="color: #d93025; font-weight: bold;">Do not share this code with anyone.</p>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject,
    html,
  });

  // Never return the OTP to the caller or API
  return { success: true };
}
