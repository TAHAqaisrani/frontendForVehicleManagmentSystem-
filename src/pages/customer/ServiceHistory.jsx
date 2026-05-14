import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import Navbar from '../../components/Navbar.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import Loader from '../../components/Loader.jsx';

export default function ServiceHistory() {
  const [vehicles, setVehicles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [history, setHistory]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [histLoading, setHistLoading] = useState(false);

  useEffect(() => {
    api.get('/vehicles/my').then(r => setVehicles(r.data)).finally(() => setLoading(false));
  }, []);

  const loadHistory = async (vehicleId) => {
    setSelected(vehicleId); setHistLoading(true);
    const res = await api.get(`/vehicles/${vehicleId}/history`);
    setHistory(res.data.history);
    setHistLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">Service History</h1>
        </div>
        {loading ? <Loader /> : (
          <>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {vehicles.map(v => (
                <button key={v.id} className={`btn ${selected === v.id ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => loadHistory(v.id)}>
                  🚗 {v.make} {v.model} · {v.license_plate}
                </button>
              ))}
            </div>
            {histLoading ? <Loader /> : history.length > 0 ? (
              <div className="table-wrap">
                <table className="table">
                  <thead><tr><th>Date</th><th>Issue</th><th>Package</th><th>Status</th><th>Cost</th><th>Payment</th></tr></thead>
                  <tbody>
                    {history.map((h, i) => (
                      <tr key={i}>
                        <td>{new Date(h.preferred_date).toLocaleDateString()}</td>
                        <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.issue_description}</td>
                        <td>{h.package_name || '—'}</td>
                        <td>{h.repair_status ? <StatusBadge status={h.repair_status} /> : <StatusBadge status={h.booking_status} />}</td>
                        <td style={{ color: 'var(--accent)', fontWeight: 700 }}>{h.total ? `$${parseFloat(h.total).toFixed(2)}` : '—'}</td>
                        <td>{h.payment_status ? <StatusBadge status={h.payment_status} /> : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : selected ? (
              <div className="card empty-state"><div className="empty-icon">📋</div><div className="empty-title">No history for this vehicle</div></div>
            ) : (
              <div className="card empty-state"><div className="empty-icon">🚗</div><div className="empty-title">Select a vehicle above</div></div>
            )}
          </>
        )}
      </div>
    </>
  );
}
