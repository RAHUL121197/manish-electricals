const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && /neon|render|postgres/i.test(process.env.DATABASE_URL)
    ? { rejectUnauthorized: false }
    : false,
});

function publicUser(row) {
  return {
    id: row.id,
    name: row.name || row.full_name || row.username || row.login_id || 'User',
    loginId: row.username || row.login_id || row.email || 'user',
    role: row.role,
    mustResetPassword: row.must_reset_password,
    lastLoginAt: row.last_login_at,
    ...(row.employee_ref || row.employee_id ? {
      employee: {
        id: row.employee_pk,
        employeeId: row.employee_ref || row.employee_id,
        fullName: row.full_name || row.name,
        designation: row.designation,
        workLocation: row.work_location,
        mobileNumber: row.employee_phone || row.phone,
        profilePhoto: null,
        status: row.employee_status,
      },
    } : {}),
  };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed.' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const loginId = String(body.loginId || '').trim();
    const password = String(body.password || '');

    if (!loginId || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Login ID and password are required.' });
    }

    const result = await pool.query(
      `SELECT u.id, u.name, u.username, u.login_id, u.email, u.phone, u.password_hash,
              u.role, u.is_active, u.must_reset_password, u.last_login_at, u.employee_id,
              e.id AS employee_pk, e.employee_id AS employee_ref, e.full_name,
              e.designation, e.work_location, e.phone AS employee_phone, e.status AS employee_status
       FROM users u
       LEFT JOIN employees e ON e.user_id = u.id
       WHERE u.username = $1 OR u.email = $1 OR u.login_id = $1
       LIMIT 1`,
      [loginId]
    );
    const row = result.rows[0];

    if (!row || !row.is_active || !(await bcrypt.compare(password, row.password_hash))) {
      return res.status(401).json({ success: false, message: 'Invalid login ID or password.' });
    }

    await pool.query('UPDATE users SET last_login_at = now(), updated_at = now() WHERE id = $1', [row.id]);

    const token = jwt.sign({
      id: row.id,
      loginId: row.username || row.login_id || row.email,
      role: row.role,
      employeeId: row.employee_ref || row.employee_id || null,
      employeePk: row.employee_pk || null,
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });

    return res.status(200).json({ success: true, data: { token, user: publicUser(row) } });
  } catch (error) {
    console.error('[auth-login-api]', error);
    return res.status(500).json({ success: false, message: 'Unable to sign in at the moment.' });
  }
};
