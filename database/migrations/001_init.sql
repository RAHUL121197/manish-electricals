-- MANISH ELECTRICALS - Initial Database Schema
-- PostgreSQL / Neon compatible

-- ============================================================
-- USERS (Admin + Employee login accounts)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    login_id        VARCHAR(50) UNIQUE NOT NULL,      -- e.g. ME-0091 or admin
    password_hash   TEXT NOT NULL,
    role            VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'employee')),
    must_reset_password BOOLEAN NOT NULL DEFAULT true,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- EMPLOYEES
-- ============================================================
CREATE TABLE IF NOT EXISTS employees (
    id                  SERIAL PRIMARY KEY,
    sr_no               SERIAL,
    employee_id         VARCHAR(20) UNIQUE NOT NULL,   -- e.g. ME-0091
    user_id             INTEGER REFERENCES users(id) ON DELETE SET NULL,
    full_name           VARCHAR(150) NOT NULL,
    mobile_number       VARCHAR(15) NOT NULL,
    alternate_mobile    VARCHAR(15),
    email               VARCHAR(150),
    aadhaar_number      VARCHAR(20),
    address             TEXT,
    date_of_birth       DATE,
    joining_date        DATE NOT NULL DEFAULT CURRENT_DATE,
    designation         VARCHAR(100),
    work_location       VARCHAR(150),
    emergency_contact   VARCHAR(15),
    pf_number           VARCHAR(50),
    esic_number         VARCHAR(50),
    status              VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    profile_photo       TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_name ON employees(full_name);

-- ============================================================
-- ATTENDANCE
-- ============================================================
CREATE TABLE IF NOT EXISTS attendance (
    id              SERIAL PRIMARY KEY,
    employee_id     INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status          VARCHAR(20) NOT NULL CHECK (status IN ('Present', 'Absent', 'Half Day', 'Leave')),
    check_in        TIME,
    check_out       TIME,
    remarks         TEXT,
    marked_by       INTEGER REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (employee_id, attendance_date)
);

CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_employee ON attendance(employee_id);

-- ============================================================
-- TASKS
-- ============================================================
CREATE TABLE IF NOT EXISTS tasks (
    id                  SERIAL PRIMARY KEY,
    task_id             VARCHAR(20) UNIQUE NOT NULL,   -- e.g. TSK-0001
    title               VARCHAR(200) NOT NULL,
    description         TEXT,
    assigned_employee_id INTEGER REFERENCES employees(id) ON DELETE SET NULL,
    priority            VARCHAR(20) NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    start_date          DATE,
    due_date            DATE,
    status              VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Cancelled')),
    completed_date      DATE,
    remarks             TEXT,
    created_by          INTEGER REFERENCES users(id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_employee ON tasks(assigned_employee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- ============================================================
-- DAILY WORK REPORTS
-- ============================================================
CREATE TABLE IF NOT EXISTS daily_work_reports (
    id              SERIAL PRIMARY KEY,
    employee_id     INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    report_date     DATE NOT NULL,
    module_task     VARCHAR(200) NOT NULL,
    description     TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Completed', 'Pending', 'In Progress')),
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    total_hours     NUMERIC(5,2) NOT NULL DEFAULT 0,
    remarks         TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reports_date ON daily_work_reports(report_date);
CREATE INDEX IF NOT EXISTS idx_reports_employee ON daily_work_reports(employee_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON daily_work_reports(status);

-- ============================================================
-- PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
    id              SERIAL PRIMARY KEY,
    project_name    VARCHAR(200) NOT NULL,
    client          VARCHAR(150),
    location        VARCHAR(150),
    description     TEXT,
    start_date      DATE,
    end_date        DATE,
    status          VARCHAR(20) NOT NULL DEFAULT 'Ongoing' CHECK (status IN ('Ongoing', 'Completed', 'Upcoming')),
    image_url       TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- GALLERY
-- ============================================================
CREATE TABLE IF NOT EXISTS gallery (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(200),
    description     TEXT,
    category        VARCHAR(50) NOT NULL DEFAULT 'Other' CHECK (category IN ('Field Work', 'Employees', 'Electrical Work', 'Office', 'Other')),
    image_url       TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);

-- ============================================================
-- CONTACT ENQUIRIES
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_enquiries (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    mobile          VARCHAR(15) NOT NULL,
    email           VARCHAR(150),
    subject         VARCHAR(200),
    message         TEXT NOT NULL,
    is_read         BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_enquiries_created ON contact_enquiries(created_at);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role_target     VARCHAR(20) CHECK (role_target IN ('admin', 'employee')),
    title           VARCHAR(200) NOT NULL,
    message         TEXT,
    type            VARCHAR(50) DEFAULT 'info',
    is_read         BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

-- ============================================================
-- SETTINGS (single row company settings)
-- ============================================================
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

-- ============================================================
-- SEQUENCE tracker for Employee/Task ID generation (never reuse IDs)
-- ============================================================
CREATE TABLE IF NOT EXISTS id_sequences (
    seq_name    VARCHAR(50) PRIMARY KEY,
    last_value  INTEGER NOT NULL DEFAULT 0
);

INSERT INTO id_sequences (seq_name, last_value) VALUES ('employee_id', 0)
ON CONFLICT (seq_name) DO NOTHING;

INSERT INTO id_sequences (seq_name, last_value) VALUES ('task_id', 0)
ON CONFLICT (seq_name) DO NOTHING;
