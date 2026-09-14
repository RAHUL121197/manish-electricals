const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const { AppError } = require('../middleware/errorHandler');

/**
 * Loads a user by login_id together with their employee profile (if any).
 */
async function findUserWithProfile(loginId) {
  const res = await query(
    `SELECT u.id, u.name, u.username, u.login_id, u.email, u.phone, u.password_hash, u.role, u.is_active, u.must_reset_password, u.last_login_at, u.employee_id,
            e.id AS employee_pk, e.employee_code, e.employee_id AS employee_ref, e.full_name, e.designation, e.work_location,
            e.phone AS employee_phone, e.status AS employee_status
     FROM users u
     LEFT JOIN employees e ON e.user_id = u.id
     WHERE u.username = $1 OR u.email = $1 OR u.login_id = $1`,
    [String(loginId || '').trim()]
  );
  return res.rows[0] || null;
}

function signToken(user) {
  const payload = {
    id: user.id,
    loginId: user.username || user.login_id || user.email || null,
    role: user.role,
    employeeId: user.employee_ref || user.employee_id || null,
    employeePk: user.employee_pk || null,
  };
  const expiresIn = process.env.JWT_EXPIRES_IN || '8h';
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

function publicUser(row) {
  const user = {
    id: row.id,
    name: row.name || row.full_name || row.username || row.login_id || 'User',
    loginId: row.username || row.login_id || row.email || 'user',
    role: row.role,
    mustResetPassword: row.must_reset_password,
    lastLoginAt: row.last_login_at,
  };
  if (row.employee_ref || row.employee_id) {
    user.employee = {
      id: row.employee_pk,
      employeeId: row.employee_ref || row.employee_id,
      fullName: row.full_name || row.name,
      designation: row.designation,
      workLocation: row.work_location,
      mobileNumber: row.employee_phone || row.phone,
      profilePhoto: row.profile_photo || null,
      status: row.employee_status,
    };
  }
  return user;
}

/**
 * POST /api/auth/login
 * Verifies credentials against the database. The role passed by the client is
 * intentionally ignored — the role stored in the DB is authoritative.
 */
async function login(req, res, next) {
  const { loginId, password } = req.body;

  try {
    const row = await findUserWithProfile(String(loginId || '').trim());

    if (!row || !row.is_active) {
      throw new AppError('Invalid login ID or password.', 401);
    }

    const valid = await bcrypt.compare(String(password || ''), row.password_hash);
    if (!valid) {
      throw new AppError('Invalid login ID or password.', 401);
    }

    await query('UPDATE users SET last_login_at = now(), updated_at = now() WHERE id = $1', [row.id]);

    const token = signToken(row);
    res.json({ success: true, data: { token, user: publicUser(row) } });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Returns a fresh copy of the authenticated user and profile.
 */
async function me(req, res, next) {
  try {
    const row = await findUserWithProfile(req.user.loginId);
    if (!row) throw new AppError('Account no longer exists.', 401);
    res.json({ success: true, data: { user: publicUser(row) } });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/logout
 * JWT sessions are stateless; logging out simply acknowledges the request.
 * The client discards the stored token.
 */
async function logout(req, res) {
  res.json({ success: true, data: { message: 'Logged out successfully.' } });
}

/**
 * POST /api/auth/change-password
 * Requires the current password to be verified before updating.
 */
async function changePassword(req, res, next) {
  const { currentPassword, newPassword } = req.body;

  try {
    const resRow = await query('SELECT password_hash, login_id FROM users WHERE id = $1', [req.user.id]);
    const row = resRow.rows[0];
    if (!row) throw new AppError('Account not found.', 404);

    const valid = await bcrypt.compare(String(currentPassword || ''), row.password_hash);
    if (!valid) throw new AppError('Current password is incorrect.', 400);

    const hash = await bcrypt.hash(String(newPassword), 10);
    await query(
      'UPDATE users SET password_hash = $1, must_reset_password = false, updated_at = now() WHERE id = $2',
      [hash, req.user.id]
    );

    // Optionally record a notification so admins can audit password changes.
    if (req.user.role === 'admin') {
      res.json({ success: true, data: { message: 'Password updated successfully.' } });
      return;
    }
    res.json({ success: true, data: { message: 'Password updated successfully.' } });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, me, logout, changePassword };