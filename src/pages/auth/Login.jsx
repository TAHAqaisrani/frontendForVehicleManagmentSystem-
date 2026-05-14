import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';

const ROLE_REDIRECT = { customer: '/customer/dashboard', advisor: '/advisor/dashboard', technician: '/technician/queue', admin: '/admin/dashboard' };

export default function Login() {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      navigate(ROLE_REDIRECT[res.data.user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication Failed');
    } finally { setLoading(false); }
  };

  const demoLogin = async (role) => {
    setError(''); setLoading(true);
    try {
      const res = await api.post('/auth/demo', { role });
      login(res.data.user, res.data.token);
      navigate(ROLE_REDIRECT[res.data.user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.error || 'Demo Access Denied');
    } finally { setLoading(false); }
  };


  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[440px] z-10 animate-in">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-2xl shadow-primary/40 mb-6">
            🚗
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2 italic">VSC.PRO</h1>
          <p className="text-muted font-bold tracking-widest uppercase text-[10px]">Secure Gateway Terminal</p>
        </div>

        <div className="bg-surface/40 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 shadow-2xl">
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger text-xs font-bold p-4 rounded-xl mb-6 flex items-center gap-3">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Terminal ID</label>
              <input 
                type="email" 
                placeholder="operator@vsc.pro"
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-medium"
                value={form.email} 
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Access Key</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-medium"
                value={form.password} 
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))} 
                required 
              />
            </div>
            
            <button 
              disabled={loading}
              className="w-full h-14 bg-white text-black font-black rounded-2xl hover:bg-primary hover:text-white transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2 group"
            >
              {loading ? 'Authenticating...' : (
                <>
                  Establish Connection
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-bold text-muted">
            New operator? <Link to="/register" className="text-primary hover:underline">Request Initialization</Link>
          </div>
        </div>

        {/* Demo Simulations */}
        <div className="mt-12">
          <p className="text-[10px] font-black text-center text-muted uppercase tracking-[0.3em] mb-6">Simulator Environments</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Admin', icon: '🛡', role: 'admin' },
              { label: 'Advisor', icon: '📋', role: 'advisor' },
              { label: 'Technician', icon: '🔧', role: 'technician' },
              { label: 'Customer', icon: '👤', role: 'customer' },
            ].map(d => (
              <button 
                key={d.label}
                onClick={() => demoLogin(d.role)}
                className="h-12 bg-white/5 border border-white/5 rounded-xl text-[11px] font-black text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <span>{d.icon}</span> {d.label}
              </button>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}
