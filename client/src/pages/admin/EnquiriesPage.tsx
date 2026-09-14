import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import SEO from '../../components/SEO';
import { api, ApiError } from '../../lib/api';

interface EnquiryRecord {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt?: string;
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnquiries = async () => {
    try {
      const data = await api.get<EnquiryRecord[]>('/api/enquiries');
      setEnquiries(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to load enquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchEnquiries();
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return enquiries.filter((item) => {
      const matchesFilter = filter === 'all' || item.status === filter;
      const matchesQuery = !term || `${item.customerName} ${item.email} ${item.phone} ${item.subject} ${item.message}`.toLowerCase().includes(term);
      return matchesFilter && matchesQuery;
    });
  }, [enquiries, filter, query]);

  const updateStatus = async (id: number, status: EnquiryRecord['status']) => {
    try {
      await api.put(`/api/enquiries/${id}`, { status });
      setEnquiries((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to update enquiry status.');
    }
  };

  return (
    <>
      <SEO title="Enquiries | MANISH ELECTRICALS Admin" />
      <div className="portal-page">
        <header className="portal-page-head">
          <div>
            <span className="eyebrow">Admin Portal</span>
            <h1>Enquiries</h1>
          </div>
        </header>

        <div className="card admin-panel" style={{ marginBottom: 20 }}>
          <div className="toolbar-row">
            <div className="search-box">
              <Search size={16} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search enquiries" />
            </div>
            <select className="select" value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
              <option value="all">All statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
        </div>

        <div className="card admin-panel">
          {loading ? (
            <div className="state-panel"><div className="spinner" aria-hidden="true" /><p>Loading enquiries…</p></div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id}>
                      <td>{item.customerName}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td>{item.subject}</td>
                      <td><span className={`status-badge ${item.status}`}>{item.status}</span></td>
                      <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</td>
                      <td>
                        <div className="row-actions">
                          <select className="select compact" value={item.status} onChange={(e) => updateStatus(item.id, e.target.value as EnquiryRecord['status'])}>
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                          </select>
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
