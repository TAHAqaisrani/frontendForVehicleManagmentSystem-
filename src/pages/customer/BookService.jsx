import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios.js';
import Navbar from '../../components/Navbar.jsx';

export default function BookService() {
  const [vehicles, setVehicles]   = useState([]);
  const [packages, setPackages]   = useState([]);
  const [form, setForm]           = useState({ vehicle_id: '', package_id: '', issue_description: '', preferred_date: '', preferred_time: '09:00' });
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({ make: '', model: '', year: '', license_plate: '', color: '', mileage: '' });
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/vehicles/my').then(r => setVehicles(r.data));
    api.get('/packages').then(r => setPackages(r.data));
  }, []);

  const addVehicle = async (e) => {
    e.preventDefault(); setError('');
    try {
      const res = await api.post('/vehicles', vehicleForm);
      setVehicles(v => [...v, res.data]);
      setForm(f => ({ ...f, vehicle_id: res.data.id }));
      setShowAddVehicle(false);
      setVehicleForm({ make: '', model: '', year: '', license_plate: '', color: '', mileage: '' });
    } catch (err) { setError(err.response?.data?.error || 'Failed to add vehicle'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await api.post('/bookings', form);
      setSuccess('🎉 Booking submitted! Our advisor will confirm shortly.');
      setTimeout(() => navigate('/customer/bookings'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <div className="page" style={{ maxWidth: '680px' }}>
        <div className="page-header">
          <h1 className="page-title">Book a Service</h1>
        </div>
        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="card">
          <form onSubmit={handleSubmit}>
            {/* Vehicle Selection */}
            <div className="form-group">
              <label className="form-label">Select Vehicle</label>
              <select className="form-select" value={form.vehicle_id}
                onChange={e => setForm(f => ({ ...f, vehicle_id: e.target.value }))} required>
                <option value="">-- Choose your vehicle --</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.make} {v.model} ({v.year}) — {v.license_plate}</option>
                ))}
              </select>
              <button type="button" className="btn btn-outline btn-sm" style={{ width: 'fit-content', marginTop: '8px' }}
                onClick={() => setShowAddVehicle(!showAddVehicle)}>
                {showAddVehicle ? '✕ Cancel' : '➕ Add New Vehicle'}
              </button>
            </div>

            {/* Add Vehicle Inline */}
            {showAddVehicle && (
              <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: '16px', border: '1px solid var(--border)' }}>
                <p style={{ fontWeight: 600, marginBottom: '12px' }}>New Vehicle Details</p>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Make</label>
                    <input className="form-input" placeholder="Toyota" value={vehicleForm.make}
                      onChange={e => setVehicleForm(f => ({ ...f, make: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Model</label>
                    <input className="form-input" placeholder="Corolla" value={vehicleForm.model}
                      onChange={e => setVehicleForm(f => ({ ...f, model: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Year</label>
                    <input className="form-input" type="number" placeholder="2020" value={vehicleForm.year}
                      onChange={e => setVehicleForm(f => ({ ...f, year: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">License Plate</label>
                    <input className="form-input" placeholder="ABC-1234" value={vehicleForm.license_plate}
                      onChange={e => setVehicleForm(f => ({ ...f, license_plate: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Color</label>
                    <input className="form-input" placeholder="White" value={vehicleForm.color}
                      onChange={e => setVehicleForm(f => ({ ...f, color: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mileage (km)</label>
                    <input className="form-input" type="number" placeholder="45000" value={vehicleForm.mileage}
                      onChange={e => setVehicleForm(f => ({ ...f, mileage: e.target.value }))} />
                  </div>
                </div>
                <button type="button" className="btn btn-success btn-sm" onClick={addVehicle}>Save Vehicle</button>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Issue Description</label>
              <textarea className="form-textarea" placeholder="Describe the problem with your vehicle..."
                value={form.issue_description} onChange={e => setForm(f => ({ ...f, issue_description: e.target.value }))} required />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Preferred Date</label>
                <input className="form-input" type="date" min={new Date().toISOString().split('T')[0]}
                  value={form.preferred_date} onChange={e => setForm(f => ({ ...f, preferred_date: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Time</label>
                <input className="form-input" type="time" value={form.preferred_time}
                  onChange={e => setForm(f => ({ ...f, preferred_time: e.target.value }))} />
              </div>
            </div>

            {/* Service Package Selection */}
            {packages.length > 0 && (
              <div className="form-group">
                <label className="form-label">Select Service Package</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {packages.map(p => (
                    <label key={p.id} className={`card ${form.package_id === p.id ? 'border-primary' : ''}`} 
                      style={{ cursor: 'pointer', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input type="radio" name="package" value={p.id} checked={form.package_id === p.id}
                          onChange={() => setForm(f => ({ ...f, package_id: p.id }))} />
                        <span style={{ fontWeight: 600 }}>{p.name}</span>
                      </div>
                      <span style={{ color: 'var(--accent)', fontWeight: 700 }}>${parseFloat(p.base_price).toFixed(2)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
              {loading ? 'Submitting…' : '🚗 Submit Booking'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
