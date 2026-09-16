const nodemailer = require('nodemailer');

function getTransporter() {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = Number(process.env.EMAIL_PORT || 587);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  if (!user || !pass) {
    throw new Error('Email configuration is missing. Set EMAIL_USER and EMAIL_PASSWORD in the environment.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: Number(port) === 465,
    auth: { user, pass },
  });
}

async function sendEnquiryEmail({ customerName, email, phone, subject, message }) {
  const businessEmail = process.env.BUSINESS_EMAIL || 'manisheletricals9@gmail.com';
  const transporter = getTransporter();

  const now = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const e = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin-bottom: 12px; color: #0f172a;">MANISH ELECTRICALS – NEW ENQUIRY</h2>
      <p><strong>Customer Name:</strong> ${e(customerName) || 'N/A'}</p>
      <p><strong>Email:</strong> ${e(email) || 'N/A'}</p>
      <p><strong>Mobile:</strong> ${e(phone) || 'N/A'}</p>
      <p><strong>Subject:</strong> ${e(subject) || 'N/A'}</p>
      <p><strong>Message:</strong></p>
      <div style="padding: 12px; background: #f8fafc; border-left: 4px solid #f59e0b; white-space: pre-wrap;">${e(message) || 'N/A'}</div>
      <p style="margin-top: 16px;"><strong>Date & Time:</strong> ${e(now)}</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"MANISH ELECTRICALS" <${process.env.EMAIL_USER}>`,
    to: businessEmail,
    replyTo: email || businessEmail,
    subject: 'MANISH ELECTRICALS – NEW ENQUIRY',
    html,
    text: `MANISH ELECTRICALS – NEW ENQUIRY\n\nCustomer Name: ${customerName}\nEmail: ${email}\nMobile: ${phone}\nSubject: ${subject}\nMessage: ${message}\nDate & Time: ${now}`,
  });
}

module.exports = { sendEnquiryEmail };
