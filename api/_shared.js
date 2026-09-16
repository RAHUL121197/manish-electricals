// Small shared helpers for the Vercel serverless entry points in this folder.
// Each wrapper reuses the server's own controllers/middleware so the production
// API has a single source of truth for validation, auth and database logic.
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { errorHandler } = require('../server/src/middleware/errorHandler');

// Serverless functions skip server.js, which normally provides a dev fallback.
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'dev_only_insecure_secret_change_me';
}

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

function getBearer(req) {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

function cors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/**
 * Prepares req/res for the shared controllers. Returns false when the request
 * should not continue (e.g. OPTIONS preflight handled inline).
 */
function setup(req, res) {
  cors(req, res);
  req.body = parseBody(req);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return false;
  }
  return true;
}

function authenticateUser(req, res) {
  const token = getBearer(req);
  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required.' });
    return false;
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired session. Please log in again.' });
    return false;
  }
}

function authenticateAdmin(req, res) {
  if (!authenticateUser(req, res)) return false;
  if (req.user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'You do not have permission to access this resource.' });
    return false;
  }
  return true;
}

function setParams(req, params) {
  req.params = { ...(req.params || {}), ...params };
}

// The public ContactPage posts snake_case keys; controllers use camelCase.
function normalizeEnquiry(req) {
  const body = req.body || {};
  if (body.customer_name && !body.customerName) {
    body.customerName = body.customer_name;
  }
}

function fail(err, req, res) {
  errorHandler(err, req, res, () => {});
}

module.exports = { setup, authenticateUser, authenticateAdmin, setParams, normalizeEnquiry, fail, getBearer };