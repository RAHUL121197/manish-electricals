const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && /neon|render|postgres/i.test(process.env.DATABASE_URL)
    ? { rejectUnauthorized: false }
    : false,
});

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ success: false, message: 'Method not allowed.' });

  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  try {
    const token = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    const result = await pool.query(
      `SELECT id, name, username, login_id, email, role, must_reset_password, last_login_at
       FROM users WHERE id = $1 AND is_active = true`,
      [token.id]
    );
    const row = result.rows[0];
    if (!row) return res.status(401).json({ success: false, message: 'Account no longer exists.' });

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: row.id,
          name: row.name || row.username || row.login_id || row.email || 'User',
          loginId: row.username || row.login_id || row.email,
          role: row.role,
          mustResetPassword: row.must_reset_password,
          lastLoginAt: row.last_login_at,
        },
      },
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session.' });
  }
};
