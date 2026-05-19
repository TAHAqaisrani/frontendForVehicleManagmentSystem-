import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Navbar from '../../components/Navbar.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import Loader from '../../components/Loader.jsx';

export default function TechnicianQueue() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // State for the dropdown filter

  useEffect(() => {
    api.get(`/job-cards/technician/${user.id}`)
      .then(r => setJobs(r.data))
      .finally(() => setLoading(false));
  }, [user.id]);

  const priorityOrder = ['in_service', 'waiting_for_parts', 'booked', 'inspected', 'ready_for_pickup', 'returned_to_customer'];
  
  // Filter jobs based on selected dropdown value
  const filteredJobs = filterStatus === 'all' 
    ? jobs 
    : jobs.filter(j => j.repair_status === filterStatus);

  const sorted = [...filteredJobs].sort((a, b) => priorityOrder.indexOf(a.repair_status) - priorityOrder.indexOf(b.repair_status));

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">My Work Queue</h1>
          <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{filteredJobs.length} active job{filteredJobs.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          {['in_service', 'waiting_for_parts', 'inspected', 'booked', 'ready_for_pickup'].map(s => (
            <div key={s} className="stat-card">
              <div className="stat-label" style={{ textTransform: 'capitalize' }}>{s.replace(/_/g, ' ')}</div>
              <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>
                {jobs.filter(j => j.repair_status === s).length}
              </div>
            </div>
          ))}
        </div>

        {/* Status Filter Dropdown */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <select 
            className="form-select" 
            style={{ width: '200px', cursor: 'pointer' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="booked">Booked</option>
            <option value="inspected">Inspected</option>
            <option value="in_service">In Service</option>
            <option value="waiting_for_parts">Waiting For Parts</option>
            <option value="ready_for_pickup">Ready For Pickup</option>
            <option value="returned_to_customer">Returned to Customer</option>
          </select>
        </div>

        {loading ? <Loader /> : sorted.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon">🔧</div>
            <div className="empty-title">No jobs found</div>
            <div className="empty-desc">No active work orders for the selected status.</div>
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
