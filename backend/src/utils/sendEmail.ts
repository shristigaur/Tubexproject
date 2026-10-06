import nodemailer from "nodemailer";

export async function sendOtpEmail(toEmail: string, otp: string) {
  try {
    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      MAIL_FROM
    } = process.env;

    const port = Number(SMTP_PORT);
    const secure = port === 465;

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: port,
      secure: secure,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>TubeX Password Reset</h2>
        <p>You requested a password reset. Here is your 6-digit OTP code:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This code expires in 10 minutes.</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          If you did not request this email, please ignore it.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: MAIL_FROM,
      to: toEmail,
      subject: "TubeX password reset code",
      html: htmlBody,
    });
    
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Unable to send the password reset email. Please try again later.");
  }
}
