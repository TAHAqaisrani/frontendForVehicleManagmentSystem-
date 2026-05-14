import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Navbar from '../../components/Navbar.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import Loader from '../../components/Loader.jsx';

export default function TechnicianQueue() {
  const { user } = useAuth();
  const [jobs, setJobs]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/job-cards/technician/${user.id}`)
      .then(r => setJobs(r.data))
      .finally(() => setLoading(false));
  }, [user.id]);

  const priorityOrder = ['in_service','waiting_for_parts','booked','inspected','ready_for_pickup'];
  const sorted = [...jobs].sort((a, b) => priorityOrder.indexOf(a.repair_status) - priorityOrder.indexOf(b.repair_status));

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">My Work Queue</h1>
          <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{jobs.length} active job{jobs.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          {['in_service','waiting_for_parts','inspected','booked','ready_for_pickup'].map(s => (
            <div key={s} className="stat-card">
              <div className="stat-label" style={{ textTransform: 'capitalize' }}>{s.replace(/_/g,' ')}</div>
              <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>
                {jobs.filter(j => j.repair_status === s).length}
              </div>
            </div>
          ))}
        </div>

        {loading ? <Loader /> : sorted.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon">🔧</div>
            <div className="empty-title">No jobs assigned</div>
            <div className="empty-desc">You have no active work orders</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sorted.map(j => (
              <div key={j.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem' }}>{j.make} {j.model} {j.year}</span>
                    <StatusBadge status={j.repair_status} />
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>🔑 {j.license_plate} &nbsp;·&nbsp; 👤 {j.customer_name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '4px' }}>📋 {j.issue_description}</div>
                  {j.package_name && <div style={{ fontSize: '0.82rem', color: 'var(--primary)', marginTop: '4px' }}>📦 {j.package_name}</div>}
                </div>
                <Link to={`/technician/job/${j.id}`} className="btn btn-primary btn-sm">Update →</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
