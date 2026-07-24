import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLeads, updateLeadStatus } from '../api.js';

const STATUSES = ['New', 'Contacted', 'Closed'];

export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('ld_token');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchLeads(token, { search, status: statusFilter });
      setLeads(data);
    } catch (err) {
      if (err.message.includes('expired') || err.message.includes('Missing')) {
        localStorage.removeItem('ld_token');
        navigate('/admin/login');
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(load, 250); // light debounce on search
    return () => clearTimeout(timer);
  }, [load]);

  async function handleStatusChange(id, status) {
    try {
      await updateLeadStatus(token, id, status);
      setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, status } : l)));
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem('ld_token');
    localStorage.removeItem('ld_email');
    navigate('/admin/login');
  }

  return (
    <div className="page admin-page">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="login-title">Leads</h1>
        </div>
        <button className="btn-secondary" onClick={handleLogout}>
          Log out
        </button>
      </header>

      <div className="admin-controls">
        <input
          type="text"
          placeholder="Search by name, email, or message…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <p className="muted">Loading leads…</p>
      ) : leads.length === 0 ? (
        <p className="muted">No leads match this view yet.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Budget</th>
                <th>Message</th>
                <th>Received</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.budgetRange}</td>
                  <td className="msg-cell">{lead.message}</td>
                  <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                      className={`status-pill status-${lead.status.toLowerCase()}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
