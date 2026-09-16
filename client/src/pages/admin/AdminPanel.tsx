import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  FileText,
  Inbox,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Mail,
  Phone,
  RefreshCw,
  ShieldCheck,
  Trash2,
  User,
} from 'lucide-react';
import { api, ApiError, getToken, setToken } from '../../lib/api';
import { COMPANY } from '../../lib/company';

type Status = 'new' | 'contacted' | 'closed';

interface Enquiry {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: Status;
  createdAt: string;
}

const STATUS_LABELS: Record<Status, string> = {
  new: 'New',
  contacted: 'Contacted',
  closed: 'Closed',
};

const STATUS_OPTIONS: Status[] = ['new', 'contacted', 'closed'];

export default function AdminPanel() {
  const isTokenSet = Boolean(getToken());
  const [authenticated, setAuthenticated] = useState(isTokenSet);

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(isTokenSet);
  const [loadError, setLoadError] = useState('');
  const [filter, setFilter] = useState<'all' | Status>('all');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [notice, setNotice] = useState('');
  const [pendingId, setPendingId] = useState<number | null>(null);

  const loadEnquiries = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const list = await api.get<Enquiry[]>('/api/enquiries');
      setEnquiries(list);
    } catch (error) {
      const err = error as ApiError;
      if (err.status === 401 || err.status === 403) {
        setToken(null);
        setAuthenticated(false);
        setLoginError('Your session has expired. Please log in again.');
        return;
      }
      setLoadError(err.message || 'Could not load enquiries.');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = (showMessage = true) => {
    setToken(null);
    setAuthenticated(false);
    setEnquiries([]);
    if (showMessage) setLoginError('You have been signed out.');
  };

  useEffect(() => {
    if (getToken()) loadEnquiries();
  }, [loadEnquiries]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginBusy(true);
    setLoginError('');
    try {
      const data = await api.post<{ token: string }>('/api/admin/login', { username, password });
      setToken(data.token);
      setUsername('');
      setPassword('');
      setAuthenticated(true);
      await loadEnquiries();
    } catch (error) {
      const err = error as ApiError;
      setLoginError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoginBusy(false);
    }
  };

  const handleStatusChange = async (id: number, status: Status) => {
    setPendingId(id);
    setNotice('');
    try {
      const updated = await api.put<Enquiry>(`/api/enquiries/${id}`, { status });
      setEnquiries((prev) => prev.map((row) => (row.id === id ? { ...updated } : row)));
    } catch (error) {
      const err = error as ApiError;
      if (err.status === 401 || err.status === 403) return logout();
      setNotice(`Could not update status: ${err.message}`);
    } finally {
      setPendingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this enquiry permanently?')) return;
    setPendingId(id);
    setNotice('');
    try {
      await api.del(`/api/enquiries/${id}`);
      setEnquiries((prev) => prev.filter((row) => row.id !== id));
      setNotice('Enquiry deleted.');
    } catch (error) {
      const err = error as ApiError;
      if (err.status === 401 || err.status === 403) return logout();
      setNotice(`Could not delete enquiry: ${err.message}`);
    } finally {
      setPendingId(null);
    }
  };

  const visible = useMemo(() => {
    if (filter === 'all') return enquiries;
    return enquiries.filter((row) => row.status === filter);
  }, [enquiries, filter]);

  const counts = useMemo(
    () => ({
      all: enquiries.length,
      new: enquiries.filter((row) => row.status === 'new').length,
      contacted: enquiries.filter((row) => row.status === 'contacted').length,
      closed: enquiries.filter((row) => row.status === 'closed').length,
    }),
    [enquiries]
  );

  if (!authenticated) {
    return (
      <div className="portal admin-login-wrap">
        <form className="card admin-login-card" onSubmit={handleLogin} noValidate>
          <div className="admin-login-head">
            <span className="admin-login-icon">
              <ShieldCheck aria-hidden="true" size={22} />
            </span>
            <h1>MANISH ELECTRICALS</h1>
            <p className="text-muted">Admin Panel — Contact Enquiries</p>
          </div>

          {loginError && (
            <div className="alert alert-error" role="alert">
              {loginError}
            </div>
          )}

          <div className="form-field">
            <label htmlFor="admin-username">Username</label>
            <div className="admin-input-wrap">
              <User aria-hidden="true" size={17} />
              <input
                id="admin-username"
                className="input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="Admin username"
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="admin-password">Password</label>
            <div className="admin-input-wrap">
              <LockKeyhole aria-hidden="true" size={17} />
              <input
                id="admin-password"
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Admin password"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loginBusy} style={{ width: '100%' }}>
            {loginBusy ? (
              <>
                <span className="spinner" aria-hidden="true" /> Signing in…
              </>
            ) : (
              <>Sign in</>
            )}
          </button>

          <a href="/" className="admin-back-link">
            ← Back to website
          </a>
        </form>
      </div>
    );
  }

  return (
    <div className="portal">
      <div className="admin-shell">
        <header className="admin-top">
          <a href="/" className="admin-brand">
            <span className="admin-logo">
              <LayoutDashboard aria-hidden="true" size={18} />
            </span>
            <span className="admin-brand-text">
              <strong>{COMPANY.name}</strong>
              <span>Admin · Contact Enquiries</span>
            </span>
          </a>
          <div className="admin-top-actions">
            <button type="button" className="btn btn-outline admin-btn-sm" onClick={() => loadEnquiries()}>
              <RefreshCw aria-hidden="true" size={16} /> Refresh
            </button>
            <button type="button" className="btn btn-outline admin-btn-sm" onClick={() => logout()}>
              <LogOut aria-hidden="true" size={16} /> Sign out
            </button>
          </div>
        </header>

        <main className="admin-content">
          <div className="admin-head">
            <div>
              <h1 className="admin-title">
                <Inbox aria-hidden="true" size={20} /> Contact Enquiries
              </h1>
              <p className="admin-subtitle">
                Submissions from the Contact Us form, newest first. Received on:{' '}
                {new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })}
              </p>
            </div>
            <span className="pill-count">
              <Mail aria-hidden="true" size={14} style={{ verticalAlign: 'text-bottom' }} /> Auto-email on every submission
            </span>
          </div>

          <div className="admin-tiles">
            <Tile label="Total" value={counts.all} tone="total" onClick={() => setFilter('all')} active={filter === 'all'} />
            <Tile label="New" value={counts.new} tone="new" onClick={() => setFilter('new')} active={filter === 'new'} />
            <Tile
              label="Contacted"
              value={counts.contacted}
              tone="contacted"
              onClick={() => setFilter('contacted')}
              active={filter === 'contacted'}
            />
            <Tile
              label="Closed"
              value={counts.closed}
              tone="closed"
              onClick={() => setFilter('closed')}
              active={filter === 'closed'}
            />
          </div>

          {notice && (
            <div className="alert alert-success" role="status">
              {notice}
            </div>
          )}
          {loadError && (
            <div className="alert alert-error" role="alert">
              {loadError}
            </div>
          )}

          {loading ? (
            <div className="admin-loading">
              <span className="spinner" aria-hidden="true" /> Loading enquiries…
            </div>
          ) : visible.length === 0 ? (
            <div className="card admin-empty">
              <FileText aria-hidden="true" size={26} />
              <p>
                {filter === 'all'
                  ? 'No enquiries yet. Submissions from the Contact Us form will appear here.'
                  : `No enquiries with status "${STATUS_LABELS[filter]}".`}
              </p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date &amp; Time</th>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row, index) => (
                    <tr key={row.id}>
                      <td className="text-muted">{index + 1}</td>
                      <td className="nowrap">{formatDate(row.createdAt)}</td>
                      <td>{row.customerName}</td>
                      <td>
                        <a href={`mailto:${row.email}`}>{row.email}</a>
                        <span className="block text-muted">
                          <Phone aria-hidden="true" size={12} style={{ verticalAlign: 'text-bottom' }} /> {row.phone}
                        </span>
                      </td>
                      <td>{row.subject}</td>
                      <td>
                        <span className="msg-cell" title={row.message}>
                          {row.message}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${row.status}`}>{STATUS_LABELS[row.status]}</span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <select
                            className="select compact"
                            value={row.status}
                            disabled={pendingId === row.id}
                            onChange={(e) => handleStatusChange(row.id, e.target.value as Status)}
                            aria-label="Update status"
                          >
                            {STATUS_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {STATUS_LABELS[option]}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="icon-btn danger"
                            disabled={pendingId === row.id}
                            onClick={() => handleDelete(row.id)}
                            aria-label="Delete enquiry"
                            title="Delete"
                          >
                            <Trash2 aria-hidden="true" size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

function Tile({
  label,
  value,
  tone,
  onClick,
  active,
}: {
  label: string;
  value: number;
  tone: 'total' | 'new' | 'contacted' | 'closed';
  onClick: () => void;
  active: boolean;
}) {
  return (
    <button type="button" className={`admin-tile ${active ? 'active' : ''}`} onClick={onClick}>
      <span className={`tile-dot ${tone}`} aria-hidden="true" />
      <strong>{value}</strong>
      <span className="tile-label">{label}</span>
    </button>
  );
}