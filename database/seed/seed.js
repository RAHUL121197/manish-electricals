/**
 * Seed script for MANISH ELECTRICALS database.
 * Creates the default Admin account and a small set of clearly-marked
 * demo employees so the application can be explored safely.
 *
 * Usage: node database/seed/seed.js
 * Requires DATABASE_URL in server/.env (loaded via dotenv).
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../server/.env') });
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('neon') ? { rejectUnauthorized: false } : undefined,
});

async function nextSequence(client, seqName) {
  const res = await client.query(
    `UPDATE id_sequences SET last_value = last_value + 1 WHERE seq_name = $1 RETURNING last_value`,
    [seqName]
  );
  return res.rows[0].last_value;
}

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ---------- Admin ----------
    const adminLoginId = 'admin';
    const adminExists = await client.query('SELECT id FROM users WHERE login_id = $1', [adminLoginId]);
    if (adminExists.rowCount === 0) {
      const passwordHash = await bcrypt.hash('Admin@123', 10);
      await client.query(
        `INSERT INTO users (login_id, password_hash, role, must_reset_password, is_active)
         VALUES ($1, $2, 'admin', false, true)`,
        [adminLoginId, passwordHash]
      );
      console.log('Created default admin -> login: admin / password: Admin@123 (please change after first login)');
    } else {
      console.log('Admin user already exists, skipping.');
    }

    // ---------- Demo Employees (clearly marked demo data) ----------
    const demoEmployees = [
      { name: 'Demo Employee One', mobile: '9000000001', designation: 'Skilled Worker' },
      { name: 'Demo Employee Two', mobile: '9000000002', designation: 'Technician' },
    ];

    for (const emp of demoEmployees) {
      const already = await client.query('SELECT id FROM employees WHERE mobile_number = $1', [emp.mobile]);
      if (already.rowCount > 0) continue;

      const seq = await nextSequence(client, 'employee_id');
      const employeeId = `ME-${String(seq).padStart(4, '0')}`;
      const tempPassword = 'Welcome@123';
      const passwordHash = await bcrypt.hash(tempPassword, 10);

      const userRes = await client.query(
        `INSERT INTO users (login_id, password_hash, role, must_reset_password, is_active)
         VALUES ($1, $2, 'employee', true, true) RETURNING id`,
        [employeeId, passwordHash]
      );

      await client.query(
        `INSERT INTO employees (employee_id, user_id, full_name, mobile_number, designation, status)
         VALUES ($1, $2, $3, $4, $5, 'Active')`,
        [employeeId, userRes.rows[0].id, `${emp.name} (DEMO)`, emp.mobile, emp.designation]
      );

      console.log(`Created demo employee ${employeeId} -> password: ${tempPassword}`);
    }

    await client.query('COMMIT');
    console.log('Seeding complete.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
