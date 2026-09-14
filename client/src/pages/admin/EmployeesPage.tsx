import { useEffect, useMemo, useState } from 'react';
import { Pencil, Search, Trash2 } from 'lucide-react';
import SEO from '../../components/SEO';
import { api, ApiError } from '../../lib/api';

interface EmployeeRecord {
  id: number;
  employeeCode: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  designation?: string | null;
  status: string;
  username?: string | null;
  joiningDate?: string | null;
}

interface EmployeeFormState {
  name: string;
  email: string;
  phone: string;
  address: string;
  designation: string;
  status: string;
}

const emptyForm = (): EmployeeFormState => ({
  name: '',
  email: '',
  phone: '',
  address: '',
  designation: '',
  status: 'Active',
});

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState<EmployeeFormState>(emptyForm());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchEmployees = async () => {
    try {
      const data = await api.get<EmployeeRecord[]>('/api/employees');
      setEmployees(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to load employees.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchEmployees();
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return employees;
    return employees.filter((employee) =>
      [employee.fullName, employee.email, employee.phone, employee.employeeCode, employee.username]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }, [employees, query]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setSaving(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        designation: form.designation,
        status: form.status,
      };

      if (editingId) {
        const updated = await api.put<EmployeeRecord>(`/api/employees/${editingId}`, payload);
        setEmployees((prev) => prev.map((emp) => (emp.id === editingId ? updated : emp)));
        setMessage('Employee updated successfully.');
      } else {
        const response = await api.post<{ employee: EmployeeRecord; credentials?: { username?: string; temporaryPassword?: string } }>(
          '/api/employees',
          payload
        );
        setEmployees((prev) => [response.employee, ...prev]);
        if (response.credentials) {
          setMessage(
            `Employee created. Username: ${response.credentials.username}. Temporary password: ${response.credentials.temporaryPassword}`
          );
        } else {
          setMessage('Employee created successfully.');
        }
      }

      setForm(emptyForm());
      setEditingId(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong while saving the employee.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (employee: EmployeeRecord) => {
    setEditingId(employee.id);
    setForm({
      name: employee.fullName,
      email: employee.email || '',
      phone: employee.phone || '',
      address: employee.address || '',
      designation: employee.designation || '',
      status: employee.status,
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Deactivate this employee?')) return;
    try {
      await api.del('/api/employees/' + id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      setMessage('Employee deactivated successfully.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to deactivate employee.');
    }
  };

  return (
    <>
      <SEO title="Employee Management | MANISH ELECTRICALS Admin" />
      <div className="portal-page">
        <header className="portal-page-head">
          <div>
            <span className="eyebrow">Admin Portal</span>
            <h1>Employee Management</h1>
          </div>
        </header>

        <div className="card admin-panel">
          <form className="employee-form" onSubmit={handleSubmit} noValidate>
            <div className="form-header-row">
              <h2>{editingId ? 'Edit Employee' : 'Add Employee'}</h2>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => { setEditingId(null); setForm(emptyForm()); }}>
                Reset
              </button>
            </div>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-grid-2">
              <div className="form-field">
                <label htmlFor="employee-name">Full name</label>
                <input id="employee-name" className="input" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
              </div>
              <div className="form-field">
                <label htmlFor="employee-phone">Phone</label>
                <input id="employee-phone" className="input" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
              </div>
              <div className="form-field">
                <label htmlFor="employee-email">Email</label>
                <input id="employee-email" className="input" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
              </div>
              <div className="form-field">
                <label htmlFor="employee-designation">Designation</label>
                <input id="employee-designation" className="input" value={form.designation} onChange={(e) => setForm((prev) => ({ ...prev, designation: e.target.value }))} />
              </div>
              <div className="form-field wide">
                <label htmlFor="employee-address">Address</label>
                <input id="employee-address" className="input" value={form.address} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} />
              </div>
              <div className="form-field">
                <label htmlFor="employee-status">Status</label>
                <select id="employee-status" className="select" value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="form-actions-right">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Update Employee' : 'Create Employee'}
              </button>
            </div>
          </form>
        </div>

        <div className="card admin-panel" style={{ marginTop: 20 }}>
          <div className="toolbar-row">
            <div className="search-box">
              <Search size={16} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search employees" />
            </div>
            <div className="pill-count">{filtered.length} employees</div>
          </div>

          {loading ? (
            <div className="state-panel"><div className="spinner" aria-hidden="true" /><p>Loading employees…</p></div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Designation</th>
                    <th>Status</th>
                    <th>Username</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.employeeCode}</td>
                      <td>{employee.fullName}</td>
                      <td>{employee.phone || '-'}</td>
                      <td>{employee.designation || '-'}</td>
                      <td><span className={`status-badge ${employee.status === 'Active' ? 'active' : 'inactive'}`}>{employee.status}</span></td>
                      <td>{employee.username || '-'}</td>
                      <td>
                        <div className="row-actions">
                          <button type="button" className="icon-btn" onClick={() => handleEdit(employee)} aria-label="Edit employee">
                            <Pencil size={15} />
                          </button>
                          <button type="button" className="icon-btn danger" onClick={() => handleDelete(employee.id)} aria-label="Deactivate employee">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
