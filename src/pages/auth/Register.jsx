import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Register() {
  const [form, setForm]   = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.user, res.data.token);
      navigate('/customer/dashboard');
    } catch (err) {
      console.error('Registration error details:', err.response?.data);
      const msg = err.response?.data?.error || 'Registration failed. Check console for details.';
      setError(msg);
    } finally { setLoading(false); }

  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'radial-gradient(ellipse at 50% 0%, #6366f120 0%, transparent 70%)' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🚗</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, background: 'linear-gradient(135deg, #fff, var(--muted))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Create Account</h1>
          <p style={{ color: 'var(--muted)', marginTop: '4px' }}>Register as a customer</p>
        </div>
        <div className="card" style={{ padding: '32px' }}>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" placeholder="John Doe"
                value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" type="text" placeholder="0300-1234567"
                value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Min 6 characters"
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={6} />
            </div>
            <button className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Creating…' : 'Create Account'}
            </button>
          </form>
        <p
  style={{
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '0.95rem',
    color: 'var(--muted)',
    background: 'rgba(255,255,255,0.03)',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.08)',
    backdropFilter: 'blur(6px)',
  }}
>
  Already have an account?{' '}
  <Link
    to="/login"
    style={{
      color: 'var(--primary)',
      fontWeight: '600',
      textDecoration: 'none',
      marginLeft: '4px',
      transition: 'all 0.3s ease',
    }}
    onMouseOver={(e) => {
      e.target.style.opacity = '0.8';
      e.target.style.textDecoration = 'underline';
    }}
    onMouseOut={(e) => {
      e.target.style.opacity = '1';
      e.target.style.textDecoration = 'none';
    }}
  >
    Sign In →
  </Link>
</p>
        </div>
      </div>
    </div>
  );
}
