export interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
  try {
    const response = await fetch("https://formspree.io/f/xzeddagb", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: to,
        subject: subject,
        message: html || text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Formspree error: ${response.statusText}`);
    }

    return { success: true, messageId: `formspree-${Date.now()}` };
  } catch (error) {
    console.error("Failed to send email to", to, error instanceof Error ? error.message : "Unknown error");
    return { success: false, error: "Failed to send email" };
  }
}

export async function verifyMailConnection() {
  console.log("Using Formspree for emails. No SMTP connection required.");
}
