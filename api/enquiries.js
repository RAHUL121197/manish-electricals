require('dotenv').config();
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && /neon|render|postgres/i.test(process.env.DATABASE_URL)
    ? { rejectUnauthorized: false }
    : false,
});

function getToken(req) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}

function requireAdmin(req, res) {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_only_insecure_secret_change_me');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required.' });
    }
    return decoded;
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session.' });
  }
}

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

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await ensureTable();

    if (req.method === 'GET') {
      const admin = requireAdmin(req, res);
      if (admin && admin !== true) {
        const rows = await pool.query('SELECT * FROM enquiries ORDER BY created_at DESC');
        return res.status(200).json({ success: true, data: rows.rows });
      }
      return;
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const customer_name = String(body.customer_name || body.customerName || '').trim();
      const email = String(body.email || '').trim();
      const phone = String(body.phone || '').trim();
      const subject = String(body.subject || '').trim() || 'General Enquiry';
      const message = String(body.message || '').trim();

      if (!customer_name || !email || !phone || !message) {
        return res.status(400).json({ success: false, message: 'All enquiry fields are required.' });
      }

      const result = await pool.query(
        `INSERT INTO enquiries (customer_name, email, phone, subject, message, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, 'new', now(), now()) RETURNING *`,
        [customer_name, email, phone, subject, message]
      );

      return res.status(201).json({ success: true, message: 'Enquiry submitted successfully.', data: result.rows[0] });
    }

    if (req.method === 'PUT') {
      const admin = requireAdmin(req, res);
      if (admin && admin !== true) {
        const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
        const status = String(body.status || '').trim().toLowerCase();
        const id = Number(req.query.id || body.id || 0);
        if (!['new', 'contacted', 'closed'].includes(status)) {
          return res.status(400).json({ success: false, message: 'Status is invalid.' });
        }
        const result = await pool.query(
          `UPDATE enquiries SET status = $1, updated_at = now() WHERE id = $2 RETURNING *`,
          [status, id]
        );
        if (!result.rowCount) {
          return res.status(404).json({ success: false, message: 'Enquiry not found.' });
        }
        return res.status(200).json({ success: true, data: result.rows[0] });
      }
      return;
    }

    if (req.method === 'DELETE') {
      const admin = requireAdmin(req, res);
      if (admin && admin !== true) {
        const id = Number(req.query.id || 0);
        const result = await pool.query('DELETE FROM enquiries WHERE id = $1 RETURNING id', [id]);
        if (!result.rowCount) {
          return res.status(404).json({ success: false, message: 'Enquiry not found.' });
        }
        return res.status(200).json({ success: true, message: 'Enquiry deleted successfully.' });
      }
      return;
    }

    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  } catch (error) {
    console.error('[enquiries-api]', error);
    return res.status(500).json({ success: false, message: 'Unable to process your request at the moment.' });
  }
};
