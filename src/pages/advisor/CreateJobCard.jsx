import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios.js';
import Navbar from '../../components/Navbar.jsx';
import Loader from '../../components/Loader.jsx';

export default function CreateJobCard() {
  const { bookingId } = useParams();
  const navigate      = useNavigate();
  const [booking, setBooking]     = useState(null);
  const [packages, setPackages]   = useState([]);
  const [technicians, setTechs]   = useState([]);
  const [form, setForm] = useState({ technician_id: '', package_id: '', inspection_notes: '', estimated_cost: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/bookings/${bookingId}`),
      api.get('/packages'),
      api.get('/dashboard/users'),
    ]).then(([b, p, u]) => {
      setBooking(b.data);
      setPackages(p.data);
      setTechs(u.data.filter(x => x.role === 'technician'));
      
      // Pre-fill from booking if customer chose a package
      if (b.data.package_id) {
        const pkg = p.data.find(pkg => pkg.id === b.data.package_id);
        setForm(f => ({ 
          ...f, 
          package_id: b.data.package_id, 
          estimated_cost: pkg ? pkg.base_price : '' 
        }));
      }
    }).finally(() => setLoading(false));
  }, [bookingId]);

  const handlePackageChange = (pkgId) => {
    const pkg = packages.find(p => p.id === parseInt(pkgId));
    setForm(f => ({ ...f, package_id: pkgId, estimated_cost: pkg ? pkg.base_price : f.estimated_cost }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    try {
      await api.post('/job-cards', { booking_id: parseInt(bookingId), ...form, technician_id: form.technician_id || null, package_id: form.package_id || null });
      navigate('/advisor/job-cards');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create job card');
    } finally { setSubmitting(false); }
  };

  if (loading) return <><Navbar /><Loader /></>;

  return (
    <>
      <Navbar />
      <div className="page" style={{ maxWidth: '680px' }}>
        <div className="page-header">
          <h1 className="page-title">Create Job Card</h1>
        </div>
        {error && <div className="alert alert-error">{error}</div>}

        {booking && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-title">📋 Booking #{booking.id}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem' }}>
              <div><span style={{ color: 'var(--muted)' }}>Customer: </span><strong>{booking.customer_name}</strong> · {booking.customer_phone}</div>
              <div><span style={{ color: 'var(--muted)' }}>Vehicle: </span><strong>{booking.make} {booking.model} ({booking.year})</strong> · {booking.license_plate}</div>
              <div><span style={{ color: 'var(--muted)' }}>Issue: </span>{booking.issue_description}</div>
              <div><span style={{ color: 'var(--muted)' }}>Date: </span>{new Date(booking.preferred_date).toLocaleDateString()} at {booking.preferred_time}</div>
            </div>
          </div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Assign Technician</label>
              <select className="form-select" value={form.technician_id} onChange={e => setForm(f => ({ ...f, technician_id: e.target.value }))}>
                <option value="">-- Unassigned --</option>
                {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Service Package</label>
              <select className="form-select" value={form.package_id} onChange={e => handlePackageChange(e.target.value)}>
                <option value="">-- Select package --</option>
                {packages.map(p => <option key={p.id} value={p.id}>{p.name} — ${parseFloat(p.base_price).toFixed(2)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Estimated Cost ($)</label>
              <input className="form-input" type="number" step="0.01" placeholder="0.00"
                value={form.estimated_cost} onChange={e => setForm(f => ({ ...f, estimated_cost: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Inspection Notes</label>
              <textarea className="form-textarea" placeholder="Initial inspection observations..."
                value={form.inspection_notes} onChange={e => setForm(f => ({ ...f, inspection_notes: e.target.value }))} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={submitting} style={{ width: '100%', justifyContent: 'center' }}>
              {submitting ? 'Creating…' : '✅ Create Job Card'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
