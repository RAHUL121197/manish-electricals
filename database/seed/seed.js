/**
 * Seed script for MANISH ELECTRICALS database.
 * Creates the default admin account and optional demo employees.
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../server/.env') });
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('neon') ? { rejectUnauthorized: false } : undefined,
});

async function nextSequence(client, seqName) {
  const result = await client.query(
    `UPDATE id_sequences SET last_value = last_value + 1 WHERE seq_name = $1 RETURNING last_value`,
    [seqName]
  );
  return Number(result.rows[0]?.last_value || 1);
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.|\.$/g, '')
    .slice(0, 24) || 'employee';
}

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const adminUsername = (process.env.ADMIN_USERNAME || 'admin').trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
    const adminExists = await client.query('SELECT id FROM users WHERE username = $1 OR login_id = $1', [adminUsername]);

    if (adminExists.rowCount === 0) {
      const hash = await bcrypt.hash(adminPassword, 10);
      await client.query(
        `INSERT INTO users (name, username, login_id, email, phone, password_hash, role, employee_id, must_reset_password, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, 'admin', 'ADMIN', false, true, now(), now())`,
        ['Administrator', adminUsername, adminUsername, 'admin@manish.com', '+919999999999', hash]
      );
      console.log(`Created default admin -> username: ${adminUsername} / password: ${adminPassword}`);
    } else {
      console.log('Admin user already exists, skipping seed.');
    }

    const demoEmployees = [
      { name: 'Rahul Patel', phone: '9000000001', designation: 'Electrician' },
      { name: 'Nitin Shah', phone: '9000000002', designation: 'Supervisor' },
    ];

    for (const emp of demoEmployees) {
      const pending = await client.query('SELECT id FROM employees WHERE phone = $1', [emp.phone]);
      if (pending.rowCount > 0) continue;

      const value = await nextSequence(client, 'employee_id');
      const employeeCode = `EMP${String(value).padStart(3, '0')}`;
      const username = `${slugify(emp.name)}.${employeeCode.toLowerCase()}`;
      const tempPassword = 'Welcome@123';
      const passwordHash = await bcrypt.hash(tempPassword, 10);

      const userResult = await client.query(
        `INSERT INTO users (name, username, login_id, email, phone, password_hash, role, employee_id, must_reset_password, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, 'employee', $7, true, true, now(), now())
         RETURNING id`,
        [emp.name, username, username, `${slugify(emp.name)}@demo.local`, emp.phone, passwordHash, employeeCode]
      );

      await client.query(
        `INSERT INTO employees (employee_code, employee_id, user_id, full_name, email, phone, designation, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'Active', now(), now())`,
        [employeeCode, employeeCode, userResult.rows[0].id, emp.name, `${slugify(emp.name)}@demo.local`, emp.phone, emp.designation]
      );

      console.log(`Created demo employee ${employeeCode} -> username: ${username} / password: ${tempPassword}`);
    }

    await client.query('COMMIT');
    console.log('Seeding complete.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
