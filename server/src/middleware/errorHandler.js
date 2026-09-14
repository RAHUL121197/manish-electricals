/**
 * Central error handler. Never leaks raw database/internal errors to clients.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error('[error]', err.message);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  if (
    err.code === 'ECONNREFUSED' ||
    err.code === 'ENOTFOUND' ||
    err.code === 'ETIMEDOUT' ||
    (err.message && /ECONNREFUSED|ENOTFOUND|ETIMEDOUT|Connection terminated/i.test(err.message))
  ) {
    return res.status(503).json({
      success: false,
      message: 'Database is unavailable. Please try again later.',
    });
  }

  if (err.code === '23505') {
    return res.status(409).json({ success: false, message: 'A record with this value already exists.' });
  }
  if (err.code === '23503') {
    return res.status(400).json({ success: false, message: 'Related record not found. Please check your input.' });
  }
  if (err.code === '23514') {
    return res.status(400).json({ success: false, message: 'Invalid value provided for one of the fields.' });
  }

  const status = err.status || 500;
  const message = status === 500 ? 'Something went wrong. Please try again later.' : err.message;
  res.status(status).json({ success: false, message });
}

function notFoundHandler(req, res) {
  res.status(404).json({ success: false, message: 'The requested resource was not found.' });
}

class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

module.exports = { errorHandler, notFoundHandler, AppError };
