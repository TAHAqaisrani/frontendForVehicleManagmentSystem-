import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios.js';
import Navbar from '../../components/Navbar.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import RepairTimeline from '../../components/RepairTimeline.jsx';
import Loader from '../../components/Loader.jsx';

const STATUSES = ['booked','inspected','in_service','waiting_for_parts','ready_for_pickup','delivered', 'returned_to_advisor', 'returned_to_customer'];

export default function JobCardDetail() {
  const { id } = useParams();
  const [jc, setJc]           = useState(null);
  const [logs, setLogs]       = useState([]);
  const [packages, setPackages] = useState([]);
  const [technicians, setTechs] = useState([]);
  const [form, setForm]       = useState({});
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [jcRes, logsRes, pkgRes, userRes] = await Promise.all([
      api.get(`/job-cards/${id}`),
      api.get(`/repair-logs/${id}`),
      api.get('/packages'),
      api.get('/dashboard/users'),
    ]);
    setJc(jcRes.data);
    setLogs(logsRes.data);
    setPackages(pkgRes.data);
    setTechs(userRes.data.filter(u => u.role === 'technician'));
    setForm({
      repair_status:    jcRes.data.repair_status,
      technician_id:    jcRes.data.technician_id || '',
      package_id:       jcRes.data.package_id || '',
      inspection_notes: jcRes.data.inspection_notes || '',
      estimated_cost:   jcRes.data.estimated_cost || '',
      actual_cost:      jcRes.data.actual_cost || '',
      notes:            '',
    });
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setMsg('');
    try {
      await api.patch(`/job-cards/${id}`, form);
      setMsg('✅ Job card updated successfully');
      load();
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.error || 'Update failed'));
    } finally { setSaving(false); }
  };

  if (loading) return <><Navbar /><Loader /></>;
  if (!jc) return <><Navbar /><div className="page"><div className="alert alert-error">Not found</div></div></>;

  return (
    <>
      <Navbar />
      <div className="page" style={{ maxWidth: '900px' }}>
        <div className="page-header">
          <h1 className="page-title">Job Card #{jc.id}</h1>
          <StatusBadge status={jc.repair_status} />
        </div>

        {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}

        <div className="grid-2" style={{ marginBottom: '20px' }}>
          <div className="card">
            <div className="card-title">👤 Customer</div>
            <div style={{ fontWeight: 700 }}>{jc.customer_name}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{jc.customer_email}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{jc.customer_phone}</div>
          </div>
          <div className="card">
            <div className="card-title">🚗 Vehicle</div>
            <div style={{ fontWeight: 700 }}>{jc.make} {jc.model} {jc.year}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{jc.license_plate} · {jc.color}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '4px' }}>{jc.issue_description}</div>
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: '20px' }}>
          <div className="card">
            <div className="card-title">🔧 Edit Job Card</div>
            <form onSubmit={save}>
              <div className="form-group">
                <label className="form-label">Repair Status</label>
                <select className="form-select" value={form.repair_status} onChange={e => setForm(f => ({ ...f, repair_status: e.target.value }))}>
                  {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Technician</label>
                <select className="form-select" value={form.technician_id} onChange={e => setForm(f => ({ ...f, technician_id: e.target.value }))}>
                  <option value="">-- Unassigned --</option>
                  {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Package</label>
                <select className="form-select" value={form.package_id} onChange={e => setForm(f => ({ ...f, package_id: e.target.value }))}>
                  <option value="">-- None --</option>
                  {packages.map(p => <option key={p.id} value={p.id}>{p.name} (${p.base_price})</option>)}
                </select>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Estimated ($)</label>
                  <input className="form-input" type="number" step="0.01" value={form.estimated_cost} onChange={e => setForm(f => ({ ...f, estimated_cost: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Actual ($)</label>
                  <input className="form-input" type="number" step="0.01" value={form.actual_cost} onChange={e => setForm(f => ({ ...f, actual_cost: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Inspection Notes</label>
                <textarea className="form-textarea" value={form.inspection_notes} onChange={e => setForm(f => ({ ...f, inspection_notes: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Update Note (for log)</label>
                <input className="form-input" placeholder="What was done?" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
                {saving ? 'Saving…' : '💾 Save Changes'}
              </button>
            </form>
          </div>

          <div className="card">
            <div className="card-title">📍 Repair Timeline</div>
            <RepairTimeline logs={logs} currentStatus={jc.repair_status} />
          </div>
        </div>
      </div>
    </>
  );
}
