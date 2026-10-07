export async function sendOtpEmail(toEmail: string, otp: string) {
  try {
    const textBody = `
========================================
🔐 TubeX Authentication
========================================

You requested an OTP code for ${toEmail}.

🔑 Your 6-digit OTP code is: 
${otp}

⏳ This code expires in 10 minutes.

If you did not request this email, please ignore it.
========================================
    `.trim();
    const response = await fetch("https://formspree.io/f/xzeddagb", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: toEmail,
        message: textBody,
        subject: "TubeX password reset code",
        otp: otp
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Formspree response error: ${response.status} ${response.statusText}`);
    }
    
  } catch (error) {
    console.error("Failed to send email via Formspree:", error);
    throw new Error("Unable to send the password reset email. Please try again later.");
  }
}
