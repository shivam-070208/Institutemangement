import nodemailer from "nodemailer";

// Transporter configuration using environment variables for security and flexibility
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,       // e.g., your email address
    pass: process.env.EMAIL_PASS,       // e.g., your email app password
  },
});

export async function sendMail(to, data) {
  const mailOptions = {
    from: process.env.EMAIL_USER, // sender address
    to: to,                      // list of receivers
    subject: data.subject,
    text: data.text,
    html: data.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (err) {
    throw err;
  }
}
