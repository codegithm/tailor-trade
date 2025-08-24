// This file defines reusable email sending functionality
// You can implement your preferred email sending service here (SendGrid, SMTP, etc)

interface EmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const sendEmail = async (params: EmailParams): Promise<void> => {
  // For now, just log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("Email would be sent with params:", params);
    return;
  }

  // TODO: Implement actual email sending logic
  // Example with nodemailer:
  // const transporter = nodemailer.createTransport({...})
  // await transporter.sendMail({...params})
};
