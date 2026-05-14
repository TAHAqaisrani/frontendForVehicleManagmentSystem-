import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import Navbar from '../../components/Navbar.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import Loader from '../../components/Loader.jsx';

export default function AdvisorDashboard() {
  const [stats, setStats]         = useState(null);
  const [recent, setRecent]       = useState({ recentBookings: [], recentJobCards: [] });
  const [pendingBooks, setPending] = useState([]);
  const [loading, setLoading]     = useState(true);

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

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">Advisor Dashboard</h1>
          <Link to="/advisor/job-cards" className="btn btn-primary">View All Job Cards</Link>
        </div>

        <div className="stats-grid">
          {[
            { label: 'Total Bookings',  value: stats?.totalBookings,  icon: '📋', color: 'var(--primary)'  },
            { label: 'Pending Confirm', value: stats?.pendingBookings, icon: '⏳', color: 'var(--warning)'  },
            { label: 'Active Jobs',     value: stats?.activeJobs,      icon: '🔧', color: 'var(--info)'     },
            { label: 'Completed',       value: stats?.completedJobs,   icon: '✅', color: 'var(--success)'  },
            { label: 'Revenue Collected', value: `$${(stats?.totalRevenue || 0).toFixed(2)}`, icon: '💰', color: 'var(--accent)' },
            { label: 'Pending Revenue', value: `$${(stats?.pendingRevenue || 0).toFixed(2)}`, icon: '📤', color: 'var(--danger)' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {pendingBooks.length > 0 && (
          <>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>⏳ Pending Bookings ({pendingBooks.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {pendingBooks.map(b => (
                <div key={b.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{b.customer_name} <span style={{ color: 'var(--muted)', fontWeight: 400 }}>· {b.make} {b.model} ({b.license_plate})</span></div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '2px' }}>{b.issue_description}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '4px' }}>📅 {new Date(b.preferred_date).toLocaleDateString()}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/advisor/job-cards/new/${b.id}`} className="btn btn-primary btn-sm">Create Job Card</Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>🕒 Recent Job Cards</h2>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Customer</th><th>Vehicle</th><th>Status</th><th>Approval</th><th>Updated</th></tr></thead>
            <tbody>
              {recent.recentJobCards.map(j => (
                <tr key={j.id}>
                  <td>{j.customer_name}</td>
                  <td>{j.make} {j.model} · <span style={{ color: 'var(--muted)' }}>{j.license_plate}</span></td>
                  <td><StatusBadge status={j.repair_status} /></td>
                  <td>
                    {j.is_approved ? 
                      <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.8rem' }}>✅ Approved</span> : 
                      <span style={{ color: 'var(--warning)', fontWeight: 600, fontSize: '0.8rem' }}>⏳ Pending Admin</span>
                    }
                  </td>
                  <td style={{ color: 'var(--muted)' }}>{new Date(j.updated_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
