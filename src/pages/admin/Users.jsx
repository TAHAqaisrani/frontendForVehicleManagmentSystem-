import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import Navbar from '../../components/Navbar.jsx';
import Loader from '../../components/Loader.jsx';

const ROLE_COLORS = { admin: 'var(--danger)', advisor: 'var(--primary)', technician: 'var(--warning)', customer: 'var(--success)' };
const ROLE_ICONS  = { admin: '🛡', advisor: '📋', technician: '🔧', customer: '👤' };

export default function AdminUsers() {
  const [users, setUsers]   = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'technician', phone: '' });

  const load = () => {
    setLoading(true);
    api.get('/users').then(r => setUsers(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', newUser);
      setShowAdd(false);
      setNewUser({ name: '', email: '', password: '', role: 'technician', phone: '' });
      load();
    } catch (err) { alert(err.response?.data?.error || 'Failed to add user'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? This action cannot be undone.')) return;
    try {
      await api.delete(`/users/${id}`);
      load();
    } catch (err) { alert(err.response?.data?.error || 'Failed to delete user'); }
  };

  const filtered = filter === 'all' ? users : users.filter(u => u.role === filter);

  return (
    <>
      <Navbar />
      <div className="page animate-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">Identity Management</h1>
            <p style={{ color: 'var(--muted)' }}>Manage your workshop staff and customer accounts.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
            {showAdd ? 'Close' : '➕ Add Staff'}
          </button>
        </div>

        {showAdd && (
          <div className="card" style={{ marginBottom: '24px', maxWidth: '600px' }}>
            <h3 style={{ marginBottom: '16px' }}>Add New Personnel</h3>
            <form onSubmit={handleAdd} className="grid-2" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={newUser.name} onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" value={newUser.password} onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-select" value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}>
                  <option value="technician">Technician</option>
                  <option value="advisor">Advisor</option>
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={newUser.phone} onChange={e => setNewUser(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create User</button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {['all','admin','advisor','technician','customer'].map(r => (
            <button key={r} className={`btn btn-sm ${filter === r ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter(r)} style={{ textTransform: 'capitalize' }}>{r}</button>
          ))}
        </div>

        {loading ? <Loader /> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {filtered.map(u => (
              <div key={u.id} className="card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', position: 'relative' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${ROLE_COLORS[u.role]}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
                  {ROLE_ICONS[u.role]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{u.name}</div>
                    <button className="btn btn-danger btn-sm" style={{ padding: '4px 8px', background: 'transparent', border: 'none', color: 'var(--danger)', opacity: 0.5 }}
                      onClick={() => handleDelete(u.id)}>🗑</button>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '12px' }}>{u.email}</div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', padding: '4px 12px', borderRadius: '99px', background: `${ROLE_COLORS[u.role]}15`, color: ROLE_COLORS[u.role], fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {u.role}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                      Joined {new Date(u.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
