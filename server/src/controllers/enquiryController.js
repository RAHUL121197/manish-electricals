const { query } = require('../config/db');
const { AppError } = require('../middleware/errorHandler');
const { sendEnquiryEmail } = require('../services/emailService');

function normalizeStatus(status) {
  const value = String(status || 'new').trim().toLowerCase();
  const allowed = ['new', 'contacted', 'closed'];
  return allowed.includes(value) ? value : 'new';
}

function formatEnquiry(row) {
  return {
    id: row.id,
    customerName: row.customer_name || row.name,
    email: row.email,
    phone: row.phone || row.mobile,
    subject: row.subject,
    message: row.message,
    status: row.status || 'new',
    createdAt: row.created_at,
  };
}

async function createEnquiry(req, res, next) {
  const { customerName, email, phone, subject, message } = req.body || {};

  try {
    if (!customerName || !String(customerName).trim()) throw new AppError('Customer name is required.', 400);
    if (!email || !String(email).trim()) throw new AppError('Email is required.', 400);
    if (!phone || !String(phone).trim()) throw new AppError('Mobile number is required.', 400);
    if (!subject || !String(subject).trim()) throw new AppError('Subject is required.', 400);
    if (!message || !String(message).trim()) throw new AppError('Message is required.', 400);

    const payload = {
      customer_name: String(customerName).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      subject: String(subject).trim(),
      message: String(message).trim(),
      status: 'new',
    };

    const result = await query(
      `INSERT INTO enquiries (customer_name, email, phone, subject, message, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, now(), now())
       RETURNING *`,
      [payload.customer_name, payload.email, payload.phone, payload.subject, payload.message, payload.status]
    );

    const saved = formatEnquiry(result.rows[0]);

    try {
      await sendEnquiryEmail({
        customerName: payload.customer_name,
        email: payload.email,
        phone: payload.phone,
        subject: payload.subject,
        message: payload.message,
      });
    } catch (emailError) {
      console.error('[email] enquiry notification failed:', emailError.message);
    }

    res.status(201).json({
      success: true,
      data: {
        enquiry: saved,
        message: 'Thank you for contacting Manish Electricals. Your enquiry has been submitted successfully. Our team will contact you shortly.',
      },
    });
  } catch (error) {
    next(error);
  }
}

async function listEnquiries(req, res, next) {
  try {
    const result = await query(
      `SELECT * FROM enquiries ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      data: result.rows.map((row) => formatEnquiry(row)),
    });
  } catch (error) {
    next(error);
  }
}

async function getEnquiryById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM enquiries WHERE id = $1 LIMIT 1', [id]);

    if (!result.rowCount) throw new AppError('Enquiry not found.', 404);
    res.json({ success: true, data: formatEnquiry(result.rows[0]) });
  } catch (error) {
    next(error);
  }
}

async function updateEnquiry(req, res, next) {
  try {
    const { id } = req.params;
    const { status, customerName, email, phone, subject, message } = req.body || {};
    const result = await query('SELECT * FROM enquiries WHERE id = $1 LIMIT 1', [id]);

    if (!result.rowCount) throw new AppError('Enquiry not found.', 404);

    const current = result.rows[0];
    const nextStatus = normalizeStatus(status || current.status);
    const nextCustomerName = customerName ? String(customerName).trim() : current.customer_name;
    const nextEmail = email ? String(email).trim() : current.email;
    const nextPhone = phone ? String(phone).trim() : current.phone;
    const nextSubject = subject ? String(subject).trim() : current.subject;
    const nextMessage = message ? String(message).trim() : current.message;

    const updated = await query(
      `UPDATE enquiries
       SET customer_name = $1, email = $2, phone = $3, subject = $4, message = $5, status = $6, updated_at = now()
       WHERE id = $7
       RETURNING *`,
      [nextCustomerName, nextEmail, nextPhone, nextSubject, nextMessage, nextStatus, id]
    );

    res.json({ success: true, data: formatEnquiry(updated.rows[0]) });
  } catch (error) {
    next(error);
  }
}

async function deleteEnquiry(req, res, next) {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM enquiries WHERE id = $1 RETURNING id', [id]);

    if (!result.rowCount) throw new AppError('Enquiry not found.', 404);
    res.json({ success: true, data: { message: 'Enquiry deleted successfully.' } });
  } catch (error) {
    next(error);
  }
}

module.exports = { createEnquiry, listEnquiries, getEnquiryById, updateEnquiry, deleteEnquiry };
