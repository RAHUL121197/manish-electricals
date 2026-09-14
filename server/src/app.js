const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { pool } = require('./config/db');

// Ensure upload directories exist on boot (used from Phase 8 onwards).
require('./middleware/upload');

function createApp() {
  const app = express();

  app.set('trust proxy', 1);

  // CORS: allow comma-separated origins from env, or the default dev origin.
  const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin || origins.includes(origin)) return cb(null, true);
        return cb(new Error('Origin not allowed by CORS'));
      },
      credentials: true,
    })
  );

  app.use(helmet());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: false }));

  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }

  // Public health check (used by the client to detect DB status).
  app.get('/api/health', async (req, res) => {
    let dbStatus = 'ok';
    try {
      await pool.query('SELECT 1');
    } catch {
      dbStatus = 'unavailable';
    }
    res.json({ success: true, data: { status: 'ok', db: dbStatus, time: new Date().toISOString() } });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/employees', employeeRoutes);
  app.use('/api/enquiries', enquiryRoutes);

  app.post('/api/contact', async (req, res, next) => {
    try {
      const { customerName, email, phone, subject, message } = req.body || {};
      if (!customerName || !String(customerName).trim()) {
        return res.status(400).json({ success: false, message: 'Customer name is required.' });
      }
      if (!email || !String(email).trim()) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
      }
      if (!phone || !String(phone).trim()) {
        return res.status(400).json({ success: false, message: 'Mobile number is required.' });
      }
      if (!subject || !String(subject).trim()) {
        return res.status(400).json({ success: false, message: 'Subject is required.' });
      }
      if (!message || !String(message).trim()) {
        return res.status(400).json({ success: false, message: 'Message is required.' });
      }

      const { createEnquiry } = require('./controllers/enquiryController');
      req.body = { customerName, email, phone, subject, message };
      return createEnquiry(req, res, next);
    } catch (error) {
      next(error);
    }
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };