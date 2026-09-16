// GET /api/employees -> admin only, lists employees
// POST /api/employees -> admin only, creates employee + login credentials
const { setup, authenticateAdmin, fail } = require('../_shared');
const { listEmployees, createEmployee } = require('../../server/src/controllers/employeeController');

module.exports = (req, res) => {
  if (!setup(req, res)) return;
  if (!authenticateAdmin(req, res)) return;

  if (req.method === 'GET') return listEmployees(req, res, (err) => fail(err, req, res));
  if (req.method === 'POST') return createEmployee(req, res, (err) => fail(err, req, res));

  res.status(405).json({ success: false, message: 'Method not allowed.' });
};