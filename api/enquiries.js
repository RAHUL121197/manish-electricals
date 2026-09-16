// GET  /api/enquiries  -> admin only, lists enquiries (newest first)
// POST /api/enquiries  -> public, saves a new enquiry and emails the business
const { setup, authenticateAdmin, normalizeEnquiry, fail } = require('./_shared');
const { listEnquiries, createEnquiry } = require('../server/src/controllers/enquiryController');

module.exports = (req, res) => {
  if (!setup(req, res)) return;

  if (req.method === 'GET') {
    if (!authenticateAdmin(req, res)) return;
    return listEnquiries(req, res, (err) => fail(err, req, res));
  }

  if (req.method === 'POST') {
    normalizeEnquiry(req);
    return createEnquiry(req, res, (err) => fail(err, req, res));
  }

  res.status(405).json({ success: false, message: 'Method not allowed.' });
};