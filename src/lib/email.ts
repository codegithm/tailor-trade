interface EmailParams {
  email: string;
  subject: string;
  text: string;
}

export async function sendEmail({
  email,
  subject,
  text,
}: EmailParams): Promise<void> {
  // Implement your email sending logic here
  // For now, just log to console
  console.log(`Sending email to ${email}`);
  console.log(`Subject: ${subject}`);
  console.log(`Text: ${text}`);
}
