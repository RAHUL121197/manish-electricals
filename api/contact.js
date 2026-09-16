// Public contact form: saves an enquiry to the database and notifies the
// business email. Reuses the server's controller for validation and logic.
const { setup, normalizeEnquiry, fail } = require('./_shared');
const { createEnquiry } = require('../server/src/controllers/enquiryController');

module.exports = (req, res) => {
  if (!setup(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  normalizeEnquiry(req);
  createEnquiry(req, res, (err) => fail(err, req, res));
};