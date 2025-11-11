import nodemailer from "nodemailer";

// Transporter configuration using environment variables for security and flexibility
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,       // e.g., your email address
    pass: process.env.EMAIL_PASS,       // e.g., your email app password
  },
});

// Utility function to send email
/**
 * Send an email to a recipient.
 * @param {string} to - Recipient's email address.
 * @param {Object} data - Mail data (subject, text, html).
 * @param {string} data.subject - Email subject.
 * @param {string} [data.text] - Plain text body.
 * @param {string} [data.html] - HTML body (optional).
 * @returns {Promise<Object>} - Resolves with nodemailer response or rejects with error.
 */
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
