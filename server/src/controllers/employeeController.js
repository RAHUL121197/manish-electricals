const bcrypt = require('bcryptjs');
const { query } = require('../config/db');
const { AppError } = require('../middleware/errorHandler');

function slugifyName(name) {
  return String(name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.|\.$/g, '')
    .slice(0, 24) || 'employee';
}

function generateTempPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  let value = '';
  for (let i = 0; i < 12; i += 1) {
    value += chars[Math.floor(Math.random() * chars.length)];
  }
  return value;
}

async function nextEmployeeCode() {
  const res = await query(
    `UPDATE id_sequences
     SET last_value = last_value + 1
     WHERE seq_name = 'employee_id'
     RETURNING last_value`
  );

  const nextValue = Number(res.rows[0]?.last_value || 1);
  return `EMP${String(nextValue).padStart(3, '0')}`;
}

function formatEmployee(row) {
  return {
    id: row.id,
    employeeCode: row.employee_code || row.employee_id,
    fullName: row.full_name || row.name,
    email: row.email,
    phone: row.mobile_number || row.phone,
    address: row.address,
    designation: row.designation,
    workLocation: row.work_location,
    joiningDate: row.joining_date,
    status: row.status || 'Active',
    username: row.username || row.login_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function listEmployees(req, res, next) {
  try {
    const rows = await query(`
      SELECT e.*, u.username, u.name, u.email AS user_email, u.phone AS user_phone, u.login_id,
             COALESCE(e.employee_code, e.employee_id) AS employee_code
      FROM employees e
      LEFT JOIN users u ON u.id = e.user_id
      ORDER BY e.created_at DESC
    `);

    res.json({
      success: true,
      data: rows.rows.map((row) => formatEmployee(row)),
    });
  } catch (error) {
    next(error);
  }
}

async function getEmployeeById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT e.*, u.username, u.name, u.email AS user_email, u.phone AS user_phone, u.login_id,
              COALESCE(e.employee_code, e.employee_id) AS employee_code
       FROM employees e
       LEFT JOIN users u ON u.id = e.user_id
       WHERE e.id = $1 LIMIT 1`,
      [id]
    );

    if (!result.rowCount) {
      throw new AppError('Employee not found.', 404);
    }

    res.json({ success: true, data: formatEmployee(result.rows[0]) });
  } catch (error) {
    next(error);
  }
}

async function createEmployee(req, res, next) {
  const { name, email, phone, address, designation, status = 'Active' } = req.body || {};

  try {
    if (!name || !String(name).trim()) throw new AppError('Employee name is required.', 400);
    if (!phone || !String(phone).trim()) throw new AppError('Employee phone number is required.', 400);

    const trimmedName = String(name).trim();
    const trimmedPhone = String(phone).trim();
    const trimmedEmail = email ? String(email).trim() : '';
    const trimmedAddress = address ? String(address).trim() : '';
    const trimmedDesignation = designation ? String(designation).trim() : '';

    const code = await nextEmployeeCode();
    const usernameBase = `${slugifyName(trimmedName)}.${code.toLowerCase()}`;
    const password = generateTempPassword();
    const passwordHash = await bcrypt.hash(password, 10);

    let username = usernameBase;
    let counter = 1;
    while (true) {
      const existing = await query('SELECT id FROM users WHERE username = $1 OR login_id = $1', [username]);
      if (!existing.rowCount) break;
      username = `${slugifyName(trimmedName)}.${code.toLowerCase()}${counter}`;
      counter += 1;
    }

    const userResult = await query(
      `INSERT INTO users (name, username, email, phone, password_hash, role, employee_id, must_reset_password, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 'employee', $6, true, true, now(), now())
       RETURNING id, username, employee_id`,
      [trimmedName, username, trimmedEmail || null, trimmedPhone, passwordHash, code]
    );

    const userId = userResult.rows[0].id;
    const employeeResult = await query(
      `INSERT INTO employees (employee_code, employee_id, user_id, full_name, email, mobile_number, address, designation, joining_date, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_DATE, $9, now(), now())
       RETURNING *`,
      [code, code, userId, trimmedName, trimmedEmail || null, trimmedPhone, trimmedAddress || null, trimmedDesignation || null, status]
    );

    const employee = formatEmployee(employeeResult.rows[0]);
    res.status(201).json({
      success: true,
      data: {
        employee,
        credentials: {
          employeeCode: code,
          username,
          temporaryPassword: password,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

async function updateEmployee(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, phone, address, designation, status, username } = req.body || {};

    const existing = await query('SELECT * FROM employees WHERE id = $1', [id]);
    if (!existing.rowCount) throw new AppError('Employee not found.', 404);

    const current = existing.rows[0];
    const nextName = name ? String(name).trim() : current.full_name;
    const nextEmail = email ? String(email).trim() : current.email;
    const nextPhone = phone ? String(phone).trim() : current.mobile_number;
    const nextAddress = address !== undefined ? String(address).trim() : current.address;
    const nextDesignation = designation !== undefined ? String(designation).trim() : current.designation;
    const nextStatus = status || current.status;
    const nextUsername = username ? String(username).trim() : (current.username || current.login_id || '');

    await query(
      `UPDATE employees
       SET full_name = $1, email = $2, mobile_number = $3, address = $4, designation = $5, status = $6, updated_at = now()
       WHERE id = $7`,
      [nextName, nextEmail || null, nextPhone || null, nextAddress || null, nextDesignation || null, nextStatus, id]
    );

    await query(
      `UPDATE users
       SET name = $1, email = $2, phone = $3, username = $4, updated_at = now()
       WHERE id = $5`,
      [nextName, nextEmail || null, nextPhone || null, nextUsername || null, current.user_id]
    );

    const updated = await query(
      `SELECT e.*, u.username, u.name, u.email AS user_email, u.phone AS user_phone, u.login_id,
              COALESCE(e.employee_code, e.employee_id) AS employee_code
       FROM employees e
       LEFT JOIN users u ON u.id = e.user_id
       WHERE e.id = $1 LIMIT 1`,
      [id]
    );

    res.json({ success: true, data: formatEmployee(updated.rows[0]) });
  } catch (error) {
    next(error);
  }
}

async function deleteEmployee(req, res, next) {
  try {
    const { id } = req.params;
    const row = await query('SELECT user_id FROM employees WHERE id = $1', [id]);
    if (!row.rowCount) throw new AppError('Employee not found.', 404);

    await query(`UPDATE employees SET status = 'Inactive', updated_at = now() WHERE id = $1`, [id]);
    await query(`UPDATE users SET is_active = false, updated_at = now() WHERE id = $1`, [row.rows[0].user_id]);

    res.json({ success: true, data: { message: 'Employee deactivated successfully.' } });
  } catch (error) {
    next(error);
  }
}

module.exports = { listEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee };
