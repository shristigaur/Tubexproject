import crypto from "crypto";
import { prisma } from "../lib/prisma.js";
import { hashPassword } from "../lib/auth.js";
import { sendFormspreeOtpEmail } from "./formspree.service.js";

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

  const emailResult = await sendFormspreeOtpEmail({
    toEmail: user.email,
    otp,
    purpose: "verification",
  });

  if (!emailResult.success) {
    throw new Error("Failed to send verification code. Please try again later.");
  }

  // Never return the OTP to the caller or API
  return { success: true };
}
