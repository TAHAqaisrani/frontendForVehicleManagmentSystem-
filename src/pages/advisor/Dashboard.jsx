import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import Navbar from '../../components/Navbar.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import Loader from '../../components/Loader.jsx';

const STATUS_OPTIONS = [
  { value: 'all',                label: 'All Statuses' },
  { value: 'booked',             label: 'Booked' },
  { value: 'inspected',          label: 'Inspected' },
  { value: 'in service',         label: 'In Service' },
  { value: 'waiting for parts',  label: 'Waiting for Parts' },
  { value: 'ready for pickup',   label: 'Ready for Pickup' },
  { value: 'delivered',          label: 'Delivered' },
  { value: 'returned to advisor',   label: 'Returned to Advisor' },
  { value: 'returned to customer',  label: 'Returned to Customer' },
];

export default function AdvisorDashboard() {
  const [stats, setStats]          = useState(null);
  const [recent, setRecent]        = useState({ recentBookings: [], recentJobCards: [] });
  const [pendingBooks, setPending]  = useState([]);
  const [loading, setLoading]      = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/stats'),
      api.get('/dashboard/recent'),
      api.get('/bookings'),
    ]).then(([s, r, b]) => {
      setStats(s.data);
      setRecent(r.data);
      setPending(b.data.filter(x => x.status === 'pending'));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <><Navbar /><Loader /></>;

  const filteredJobCards = statusFilter === 'all'
    ? recent.recentJobCards
    : recent.recentJobCards.filter(j =>
        j.repair_status?.toLowerCase() === statusFilter
      );

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">Advisor Dashboard</h1>
          <Link to="/advisor/job-cards" className="btn btn-primary">View All Job Cards</Link>
        </div>

        {/* ── Stats ── */}
        <div className="stats-grid">
          {[
            { label: 'Total Bookings',    value: stats?.totalBookings,                              icon: '📋', color: 'var(--color-primary)' },
            { label: 'Pending Confirm',   value: stats?.pendingBookings,                            icon: '⏳', color: 'var(--color-warning)' },
            { label: 'Active Jobs',       value: stats?.activeJobs,                                 icon: '🔧', color: 'var(--color-info)'    },
            { label: 'Completed',         value: stats?.completedJobs,                              icon: '✅', color: 'var(--color-success)' },
            { label: 'Revenue Collected', value: `$${(stats?.totalRevenue    || 0).toFixed(2)}`,    icon: '💰', color: 'var(--color-accent)'  },
            { label: 'Pending Revenue',   value: `$${(stats?.pendingRevenue  || 0).toFixed(2)}`,    icon: '📤', color: 'var(--color-danger)'  },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* ── Pending Bookings ── */}
        {pendingBooks.length > 0 && (
          <>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>
              ⏳ Pending Bookings ({pendingBooks.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {pendingBooks.map(b => (
                <div
                  key={b.id}
                  className="card"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>
                      {b.customer_name}{' '}
                      <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>
                        · {b.make} {b.model} ({b.license_plate})
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: '2px' }}>{b.issue_description}</div>
                    <div style={{ fontSize: '0.8rem',  color: 'var(--color-muted)', marginTop: '4px' }}>
                      📅 {new Date(b.preferred_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/advisor/job-cards/new/${b.id}`} className="btn btn-primary btn-sm">
                      Create Job Card
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Recent Job Cards with filter ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>🕒 Recent Job Cards</h2>

          {/* Status Filter Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Filter by Status
            </span>
            <select
              className="form-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ width: 'auto', minWidth: '180px', paddingTop: '8px', paddingBottom: '8px' }}
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Status</th>
                <th>Approval</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobCards.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
                      <div className="empty-icon">🔍</div>
                      <div className="empty-title">No job cards found</div>
                      <div className="empty-desc">No job cards match the selected status.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredJobCards.map(j => (
                  <tr key={j.id}>
                    <td>{j.customer_name}</td>
                    <td>
                      {j.make} {j.model} ·{' '}
                      <span style={{ color: 'var(--color-muted)' }}>{j.license_plate}</span>
                    </td>
                    <td><StatusBadge status={j.repair_status} /></td>
                    <td>
                      {j.is_approved
                        ? <span style={{ color: 'var(--color-success)', fontWeight: 600, fontSize: '0.8rem' }}>✅ Approved</span>
                        : <span style={{ color: 'var(--color-warning)', fontWeight: 600, fontSize: '0.8rem' }}>⏳ Pending Admin</span>
                      }
                    </td>
                    <td style={{ color: 'var(--color-muted)' }}>
                      {new Date(j.updated_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
