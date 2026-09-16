// GET /api/employees/:id -> admin only
// PUT /api/employees/:id -> admin only
// DELETE /api/employees/:id -> admin only (soft-deactivates the employee + login)
const { setup, authenticateAdmin, setParams, fail } = require('../_shared');
const { getEmployeeById, updateEmployee, deleteEmployee } = require('../../server/src/controllers/employeeController');

module.exports = (req, res) => {
  if (!setup(req, res)) return;
  if (!authenticateAdmin(req, res)) return;

  setParams(req, { id: String(req.query.id || '') });

  if (req.method === 'GET') return getEmployeeById(req, res, (err) => fail(err, req, res));
  if (req.method === 'PUT') return updateEmployee(req, res, (err) => fail(err, req, res));
  if (req.method === 'DELETE') return deleteEmployee(req, res, (err) => fail(err, req, res));

  res.status(405).json({ success: false, message: 'Method not allowed.' });
};