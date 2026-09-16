// POST /api/admin/login -> admin login using env-configured credentials.
const { setup, fail } = require('../_shared');
const { login } = require('../server/src/controllers/adminController');

module.exports = (req, res) => {
  if (!setup(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  login(req, res, (err) => fail(err, req, res));
};