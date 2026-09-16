const { query } = require('../config/db');

/**
 * GET /api/dashboard/stats (admin only)
 * Returns real aggregate statistics from the database.
 */
async function getStats(req, res, next) {
  try {
    const [employees, enquiries, todayEnquiries] = await Promise.all([
      query(`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE status = 'Active')::int AS active,
          COUNT(*) FILTER (WHERE status = 'Inactive')::int AS inactive
        FROM employees
      `),
      query(`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE status = 'new')::int AS new,
          COUNT(*) FILTER (WHERE status = 'contacted')::int AS contacted,
          COUNT(*) FILTER (WHERE status = 'closed')::int AS closed
        FROM enquiries
      `),
      query(`SELECT COUNT(*)::int AS count FROM enquiries WHERE created_at >= date_trunc('day', now())`),
    ]);

    res.json({
      success: true,
      data: {
        employees: employees.rows[0],
        enquiries: { ...enquiries.rows[0], today: todayEnquiries.rows[0].count },
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getStats };