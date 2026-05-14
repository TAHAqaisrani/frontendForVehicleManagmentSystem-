import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios.js';
import Navbar from '../../components/Navbar.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import RepairTimeline from '../../components/RepairTimeline.jsx';
import Loader from '../../components/Loader.jsx';

const STATUSES = ['booked','inspected','in_service','waiting_for_parts','ready_for_pickup','delivered', 'returned_to_advisor', 'returned_to_customer'];

export default function TechnicianJobDetail() {
  const { id } = useParams();
  const [jc, setJc]     = useState(null);
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({ status: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]   = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [jcRes, logsRes] = await Promise.all([
      api.get(`/job-cards/${id}`),
      api.get(`/repair-logs/${id}`),
    ]);
    setJc(jcRes.data);
    setLogs(logsRes.data);
    setForm(f => ({ ...f, status: jcRes.data.repair_status }));
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault(); setSaving(true); setMsg('');
    try {
      await api.post('/repair-logs', { job_card_id: parseInt(id), status: form.status, notes: form.notes });
      setMsg('✅ Status updated!');
      setForm(f => ({ ...f, notes: '' }));
      load();
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.error || 'Update failed'));
    } finally { setSaving(false); }
  };

  if (loading) return <><Navbar /><Loader /></>;
  if (!jc) return <><Navbar /><div className="page"><div className="alert alert-error">Job not found</div></div></>;

  return (
    <>
      <Navbar />
      <div className="page" style={{ maxWidth: '860px' }}>
        <div className="page-header">
          <div>
            <h1 className="page-title">Job #{jc.id}</h1>
            <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{jc.make} {jc.model} · {jc.license_plate}</div>
          </div>
          <StatusBadge status={jc.repair_status} />
        </div>

        {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}

        <div className="grid-2" style={{ marginBottom: '20px' }}>
          <div className="card">
            <div className="card-title">📋 Job Info</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
              <div><span style={{ color: 'var(--muted)' }}>Customer: </span><strong>{jc.customer_name}</strong></div>
              <div><span style={{ color: 'var(--muted)' }}>Phone: </span>{jc.customer_phone}</div>
              <div><span style={{ color: 'var(--muted)' }}>Package: </span>{jc.package_name || 'Custom'}</div>
              <div><span style={{ color: 'var(--muted)' }}>Est. Cost: </span><span style={{ color: 'var(--accent)', fontWeight: 700 }}>${parseFloat(jc.estimated_cost || 0).toFixed(2)}</span></div>
              {jc.inspection_notes && <div><span style={{ color: 'var(--muted)' }}>Notes: </span>{jc.inspection_notes}</div>}
            </div>
          </div>
          <div className="card">
            <div className="card-title">🔧 Issue Reported</div>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{jc.issue_description}</p>
            <div style={{ marginTop: '12px', padding: '10px', background: 'var(--surface)', borderRadius: 'var(--radius)', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--muted)' }}>Date: </span>{new Date(jc.preferred_date).toLocaleDateString()} at {jc.preferred_time}
            </div>
          </div>
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-title">⬆️ Update Status</div>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label">New Status</label>
                <select className="form-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Work Notes</label>
                <textarea className="form-textarea" placeholder="Describe what was done..."
                  value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
                {saving ? 'Saving…' : '📤 Submit Update'}
              </button>
            </form>
          </div>
          <div className="card">
            <div className="card-title">📍 Progress Timeline</div>
            <RepairTimeline logs={logs} currentStatus={jc.repair_status} />
          </div>
        </div>
      </div>
    </>
  );
}
