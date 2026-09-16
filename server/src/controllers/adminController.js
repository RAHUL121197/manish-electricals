const jwt = require('jsonwebtoken');
const { AppError } = require('../middleware/errorHandler');

/**
 * Admin credentials come from environment variables (no database required).
 * Defaults exist for local development only - always set real values in prod.
 */
function resolveAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
  };
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) diff |= left[i] ^ right[i];
  return diff === 0;
}

async function login(req, res, next) {
  try {
    const { username, password } = req.body || {};
    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new AppError('Username and password are required.', 400);
    }

    const creds = resolveAdminCredentials();
    if (!safeEqual(username.trim(), creds.username) || !safeEqual(password, creds.password)) {
      throw new AppError('Invalid admin credentials.', 401);
    }

    if (
      process.env.NODE_ENV === 'production' &&
      (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD)
    ) {
      throw new AppError('Admin credentials are not configured on the server.', 500);
    }

    // role 'admin' is what the existing enquiry/dashboard admin routes check for.
    const token = jwt.sign(
      { loginId: 'admin', role: 'admin', authProvider: 'env' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.json({
      success: true,
      data: { token, expiresIn: process.env.JWT_EXPIRES_IN || '8h' },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { login };