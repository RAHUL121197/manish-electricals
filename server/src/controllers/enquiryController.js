const { query } = require('../config/db');
const { AppError } = require('../middleware/errorHandler');
const { sendEnquiryEmail } = require('../services/emailService');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[6-9]\d{9}$/;

function normalizeStatus(status, allowEmpty) {
  const value = String(status || 'new').trim().toLowerCase();
  if (!value) return allowEmpty ? null : 'new';
  const allowed = ['new', 'contacted', 'closed'];
  return allowed.includes(value) ? value : null;
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

/**
 * Trims and caps every free-text field to safe lengths. Works with both
 * the snake_case client payload and the camelCase API payload.
 */
function sanitizeEnquiryInput(body) {
  const raw = body || {};
  const str = (value) => (value === null || value === undefined ? '' : String(value).trim());

  return {
    customer_name: str(raw.customerName || raw.customer_name).slice(0, 150),
    email: str(raw.email).slice(0, 150),
    phone: str(raw.phone || raw.mobile).slice(0, 20),
    subject: str(raw.subject).slice(0, 200),
    message: str(raw.message).slice(0, 5000),
    status: 'new',
  };
}

function validateEnquiryPayload(payload) {
  if (!payload.customer_name) return 'Customer name is required.';
  if (payload.customer_name.length < 2) return 'Enter your full name (at least 2 characters).';

  if (!payload.email) return 'Email is required.';
  if (!EMAIL_RE.test(payload.email)) return 'A valid email address is required.';

  if (!payload.phone) return 'Mobile number is required.';
  if (!PHONE_RE.test(payload.phone)) return 'Enter a valid 10-digit mobile number.';

  if (!payload.subject) return 'Subject is required.';

  if (!payload.message) return 'Message is required.';
  if (payload.message.length < 10) return 'Message must be at least 10 characters.';

  return null;
}

async function createEnquiry(req, res, next) {
  try {
    const payload = sanitizeEnquiryInput(req.body);

    const validationError = validateEnquiryPayload(payload);
    if (validationError) throw new AppError(validationError, 400);

    // Guard against rapid duplicate submissions (e.g. double-click or retries)
    // from the same sender within a short window.
    const duplicate = await query(
      `SELECT id FROM enquiries
       WHERE email = $1 AND phone = $2 AND message = $3
         AND created_at > now() - interval '5 minutes'
       LIMIT 1`,
      [payload.email, payload.phone, payload.message]
    );

    if (duplicate.rowCount > 0) {
      return res.status(409).json({
        success: false,
        message: 'We already received your enquiry. Our team will contact you shortly.',
      });
    }

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

    const hasStatusField = status !== undefined && status !== null && String(status).trim() !== '';
    const nextStatus = hasStatusField ? normalizeStatus(status, false) : null;
    if (hasStatusField && !nextStatus) {
      throw new AppError('Invalid status. Allowed values: new, contacted, closed.', 400);
    }

    const result = await query('SELECT * FROM enquiries WHERE id = $1 LIMIT 1', [id]);
    if (!result.rowCount) throw new AppError('Enquiry not found.', 404);

    const current = result.rows[0];
    const effectiveStatus = nextStatus || current.status;
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
      [nextCustomerName, nextEmail, nextPhone, nextSubject, nextMessage, effectiveStatus, id]
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
