-- MANISH ELECTRICALS - Initial Database Schema
-- PostgreSQL / Neon compatible

CREATE TABLE IF NOT EXISTS users (
    id               SERIAL PRIMARY KEY,
    name             VARCHAR(150),
    email            VARCHAR(150),
    phone            VARCHAR(20),
    username         VARCHAR(100) UNIQUE,
    login_id         VARCHAR(100) UNIQUE,
    password_hash    TEXT NOT NULL,
    role             VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'employee')),
    employee_id      VARCHAR(50),
    must_reset_password BOOLEAN NOT NULL DEFAULT true,
    is_active        BOOLEAN NOT NULL DEFAULT true,
    last_login_at    TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS employees (
    id               SERIAL PRIMARY KEY,
    employee_code    VARCHAR(50) UNIQUE,
    employee_id      VARCHAR(50) UNIQUE,
    user_id          INTEGER REFERENCES users(id) ON DELETE SET NULL,
    full_name        VARCHAR(150) NOT NULL,
    email            VARCHAR(150),
    phone            VARCHAR(20),
    address          TEXT,
    joining_date     DATE NOT NULL DEFAULT CURRENT_DATE,
    designation      VARCHAR(100),
    work_location    VARCHAR(150),
    status           VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS enquiries (
    id              SERIAL PRIMARY KEY,
    customer_name   VARCHAR(150) NOT NULL,
    email           VARCHAR(150) NOT NULL,
    phone           VARCHAR(20) NOT NULL,
    subject         VARCHAR(200) NOT NULL,
    message         TEXT NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS settings (
    id                  SERIAL PRIMARY KEY,
    company_name        VARCHAR(200) NOT NULL DEFAULT 'MANISH ELECTRICALS',
    company_phone       VARCHAR(20) NOT NULL DEFAULT '+91 99241 09256',
    company_whatsapp    VARCHAR(20) NOT NULL DEFAULT '+91 99241 09256',
    company_email       VARCHAR(150) NOT NULL DEFAULT 'manisheletricals9@gmail.com',
    company_address     TEXT NOT NULL DEFAULT 'P No. 17, Kuber Park Society, Ved Road, Surat - 395004, Gujarat, India',
    default_language    VARCHAR(10) NOT NULL DEFAULT 'en',
    theme               VARCHAR(20) NOT NULL DEFAULT 'dark',
    logo_url            TEXT DEFAULT '/logo/logo.png',
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO settings (id)
SELECT 1
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE id = 1);

CREATE TABLE IF NOT EXISTS id_sequences (
    seq_name    VARCHAR(50) PRIMARY KEY,
    last_value  INTEGER NOT NULL DEFAULT 0
);

INSERT INTO id_sequences (seq_name, last_value) VALUES ('employee_id', 0)
ON CONFLICT (seq_name) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_employees_employee_code ON employees(employee_code);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at);
