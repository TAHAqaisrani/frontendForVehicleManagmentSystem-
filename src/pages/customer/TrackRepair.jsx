import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios.js';
import Navbar from '../../components/Navbar.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import RepairTimeline from '../../components/RepairTimeline.jsx';
import Loader from '../../components/Loader.jsx';

export default function TrackRepair() {
  const { jobCardId } = useParams();
  const [jc, setJc]     = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/job-cards/${jobCardId}`),
      api.get(`/repair-logs/${jobCardId}`),
    ]).then(([jcRes, logsRes]) => {
      setJc(jcRes.data);
      setLogs(logsRes.data);
    }).finally(() => setLoading(false));
  }, [jobCardId]);

  if (loading) return <><Navbar /><Loader /></>;
  if (!jc) return <><Navbar /><div className="page"><div className="alert alert-error">Job card not found</div></div></>;

  return (
    <>
      <Navbar />
      <div className="page" style={{ maxWidth: '800px' }}>
        <div className="page-header">
          <h1 className="page-title">Repair Tracker</h1>
          <StatusBadge status={jc.repair_status} />
        </div>

        <div className="grid-2" style={{ marginBottom: '20px' }}>
          <div className="card">
            <div className="card-title">🚗 Vehicle</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{jc.make} {jc.model} {jc.year}</div>
            <div style={{ color: 'var(--muted)' }}>{jc.license_plate} · {jc.color}</div>
          </div>
          <div className="card">
            <div className="card-title">📋 Job Card #{jc.id}</div>
            <div><span style={{ color: 'var(--muted)' }}>Package: </span>{jc.package_name || 'Not assigned'}</div>
            <div><span style={{ color: 'var(--muted)' }}>Technician: </span>{jc.technician_name || 'Not assigned'}</div>
            <div><span style={{ color: 'var(--muted)' }}>Est. Cost: </span><span style={{ color: 'var(--accent)', fontWeight: 700 }}>${parseFloat(jc.estimated_cost || 0).toFixed(2)}</span></div>
          </div>
        </div>

        {jc.inspection_notes && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-title">🔍 Inspection Notes</div>
            <p style={{ color: 'var(--muted)' }}>{jc.inspection_notes}</p>
          </div>
        )}

        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-title">📍 Repair Progress</div>
          <RepairTimeline logs={logs} currentStatus={jc.repair_status} />
        </div>

        {(jc.repair_status === 'ready_for_pickup' || jc.repair_status === 'delivered') && (
          <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🧾</div>
            <div style={{ fontWeight: 700, marginBottom: '4px' }}>Invoice Ready</div>
            <div style={{ color: 'var(--muted)', marginBottom: '16px' }}>Total: <strong style={{ color: 'var(--accent)' }}>${parseFloat(jc.estimated_cost * 1.1 || 0).toFixed(2)}</strong></div>
            <Link to={`/customer/invoice/${jc.id}`} className="btn btn-primary">View & Pay Invoice →</Link>
          </div>
        )}
      </div>
    </>
  );
}
