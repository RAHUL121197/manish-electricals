// GET /api/enquiries/:id -> admin only
// PUT /api/enquiries/:id -> admin only (used by the enquiry list status update)
// DELETE /api/enquiries/:id -> admin only
const { setup, authenticateAdmin, setParams, fail } = require('../_shared');
const { getEnquiryById, updateEnquiry, deleteEnquiry } = require('../../server/src/controllers/enquiryController');

module.exports = (req, res) => {
  if (!setup(req, res)) return;
  if (!authenticateAdmin(req, res)) return;

  setParams(req, { id: String(req.query.id || '') });

  if (req.method === 'GET') return getEnquiryById(req, res, (err) => fail(err, req, res));
  if (req.method === 'PUT') return updateEnquiry(req, res, (err) => fail(err, req, res));
  if (req.method === 'DELETE') return deleteEnquiry(req, res, (err) => fail(err, req, res));

  res.status(405).json({ success: false, message: 'Method not allowed.' });
};