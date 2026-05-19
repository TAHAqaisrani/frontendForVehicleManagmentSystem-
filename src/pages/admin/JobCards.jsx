import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import Navbar from '../../components/Navbar.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import Loader from '../../components/Loader.jsx';

export default function AdminJobCards() {
  const [jobCards, setJobCards] = useState([]);
  const [filter, setFilter]     = useState('all');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get('/job-cards').then(r => setJobCards(r.data)).finally(() => setLoading(false));
  }, []);

  const approveJobCard = async (id) => {
    try {
      await api.patch(`/job-cards/${id}/approve`);
      setJobCards(js => js.map(j => j.id === id ? { ...j, is_approved: true } : j));
    } catch (err) { alert(err.response?.data?.error || 'Failed to approve job card'); }
  };

  const deleteJobCard = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job card?')) return;
    try {
      await api.delete(`/job-cards/${id}`);
      setJobCards(js => js.filter(j => j.id !== id));
    } catch (err) { alert(err.response?.data?.error || 'Failed to delete job card'); }
  };

  const STATUSES = ['all','booked','inspected','in_service','waiting_for_parts','ready_for_pickup','delivered', 'returned_to_advisor', 'returned_to_customer'];
  const filtered = filter === 'all' ? jobCards : jobCards.filter(j => j.repair_status === filter);

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">All Job Cards</h1>
          <span style={{ color: 'var(--muted)' }}>{filtered.length} records</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {STATUSES.map(s => (
            <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter(s)} style={{ textTransform: 'capitalize' }}>
              {s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
        {loading ? <Loader /> : filtered.length === 0 ? (
          <div className="card empty-state"><div className="empty-icon">🗂</div><div className="empty-title">No job cards</div></div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>#</th><th>Customer</th><th>Vehicle</th><th>Package</th><th>Technician</th><th>Status</th><th>Est.</th><th>Actual</th><th>Invoice</th></tr>
              </thead>
              <tbody>
                {filtered.map(j => (
                  <tr key={j.id}>
                    <td style={{ color: 'var(--muted)' }}>#{j.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{j.customer_name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{j.customer_email}</div>
                    </td>
                    <td>
                      <div>{j.make} {j.model}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{j.license_plate}</div>
                    </td>
                    <td>{j.package_name || '—'}</td>
                    <td>{j.technician_name || <span style={{ color: 'var(--muted)' }}>—</span>}</td>
                    <td><StatusBadge status={j.repair_status} /></td>
                    <td style={{ color: 'var(--accent)' }}>${parseFloat(j.estimated_cost || 0).toFixed(2)}</td>
                    <td style={{ color: j.actual_cost > 0 ? 'var(--success)' : 'var(--muted)' }}>
                      {j.actual_cost > 0 ? `$${parseFloat(j.actual_cost).toFixed(2)}` : '—'}
                    </td>
                    <td style={{ display: 'flex', gap: '6px' }}>
                    
                      {j.is_approved && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--success)', alignSelf: 'center', fontWeight: 600 }}>Approved</span>
                      )}
                      <button className="btn btn-danger btn-sm" onClick={() => deleteJobCard(j.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
