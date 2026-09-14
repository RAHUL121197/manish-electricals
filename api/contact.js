require('dotenv').config();
const { Pool } = require('pg');
const nodemailer = require('nodemailer');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && /neon|render|postgres/i.test(process.env.DATABASE_URL)
    ? { rejectUnauthorized: false }
    : false,
});

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id SERIAL PRIMARY KEY,
      customer_name VARCHAR(150) NOT NULL,
      email VARCHAR(150) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      subject VARCHAR(200) NOT NULL,
      message TEXT NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','closed')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}

async function sendEmail(payload) {
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;
  const businessEmail = process.env.BUSINESS_EMAIL || 'manisheletricals9@gmail.com';

  if (!emailUser || !emailPassword) {
    throw new Error('Email configuration missing: EMAIL_USER and EMAIL_PASSWORD are required.');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT || 587),
    secure: Number(process.env.EMAIL_PORT || 587) === 465,
    auth: { user: emailUser, pass: emailPassword },
  });

  const dateTime = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  await transporter.sendMail({
    from: `"MANISH ELECTRICALS" <${emailUser}>`,
    to: businessEmail,
    replyTo: payload.email,
    subject: 'MANISH ELECTRICALS - NEW ENQUIRY',
    text: [
      'MANISH ELECTRICALS - NEW ENQUIRY',
      '',
      `Customer Name: ${payload.customer_name}`,
      `Email: ${payload.email}`,
      `Mobile Number: ${payload.phone}`,
      `Subject: ${payload.subject}`,
      `Message: ${payload.message}`,
      `Date & Time: ${dateTime}`,
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6; color:#111827;">
        <h2 style="margin-bottom:12px;">MANISH ELECTRICALS - NEW ENQUIRY</h2>
        <p><strong>Customer Name:</strong> ${payload.customer_name}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Mobile Number:</strong> ${payload.phone}</p>
        <p><strong>Subject:</strong> ${payload.subject}</p>
        <p><strong>Message:</strong></p>
        <div style="padding:12px; background:#f8fafc; border-left:4px solid #f59e0b; white-space:pre-wrap;">${payload.message}</div>
        <p style="margin-top: 16px;"><strong>Date & Time:</strong> ${dateTime}</p>
      </div>
    `,
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const customer_name = String(body.customer_name || body.customerName || '').trim();
    const email = String(body.email || '').trim();
    const phone = String(body.phone || '').trim();
    const subject = String(body.subject || '').trim() || 'General Enquiry';
    const message = String(body.message || '').trim();

    if (!customer_name) {
      return res.status(400).json({ success: false, message: 'Customer name is required.' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'A valid email is required.' });
    }
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Mobile number is required.' });
    }
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    await ensureTable();

    const insert = await pool.query(
      `INSERT INTO enquiries (customer_name, email, phone, subject, message, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 'new', now(), now())
       RETURNING id`,
      [customer_name, email, phone, subject, message]
    );

    const enquiryId = insert.rows[0]?.id;

    try {
      await sendEmail({ customer_name, email, phone, subject, message });
    } catch (emailError) {
      console.error('[contact-email]', emailError.message || emailError);
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you for contacting Manish Electricals. Your enquiry has been submitted successfully. Our team will contact you shortly.',
      enquiryId,
    });
  } catch (error) {
    console.error('[contact-api]', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to save your enquiry. Please try again.',
    });
  }
};
