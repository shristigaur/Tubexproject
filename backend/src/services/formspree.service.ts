import { env } from "../config/env.js";

interface SendOtpOptions {
  toEmail: string;
  otp: string;
  purpose: "verification" | "password_reset";
}

export async function sendFormspreeOtpEmail({ toEmail, otp, purpose }: SendOtpOptions) {
  try {
    const formId = process.env.FORMSPREE_FORM_ID || "xzeddagb";
    
    // We send a beautifully formatted plain-text string, because Formspree
    // strips HTML tags or renders them as raw text in their default templates.
    const title = purpose === "password_reset" ? "Password Reset" : "Verification Code";
    
    const textBody = `
TubeX

${title}

Your verification code is:

   ${otp}

This code will expire in 10 minutes.

For your security, do not share this code with anyone.

If you did not request this code, you can safely ignore this email.
    `.trim();

    console.log(`OTP email submission sent to Formspree for ${toEmail}`);

    const response = await fetch(`https://formspree.io/f/${formId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        email: toEmail,
        message: textBody,
        subject: `TubeX ${title}`,
        _replyto: toEmail
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Formspree OTP submission failed: ${response.status} ${response.statusText} - ${errorText}`);
      return { success: false, error: "Failed to send email via Formspree." };
    }

    return { success: true };
  } catch (error) {
    console.error("Formspree OTP submission failed:", error instanceof Error ? error.message : "Unknown network error");
    return { success: false, error: "Failed to send email via Formspree." };
  }
}
