import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import Navbar from '../../components/Navbar.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import Loader from '../../components/Loader.jsx';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch]     = useState('');
  const [searchType, setType]   = useState('vehicle');
  const [statusFilter, setStatus] = useState('all');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get('/bookings').then(r => { setBookings(r.data); setFiltered(r.data); }).finally(() => setLoading(false));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) { setFiltered(bookings); return; }
    try {
      const res = await api.get(`/search?q=${encodeURIComponent(search)}&type=${searchType}`);
      const ids = new Set(res.data.results.map(r => r.booking_id));
      setFiltered(bookings.filter(b => ids.has(b.id)));
    } catch (err) { console.error(err); }
  };

  const display = statusFilter === 'all' ? filtered : filtered.filter(b => b.status === statusFilter);

  const confirm = async (id) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status: 'confirmed' });
      setBookings(bs => bs.map(b => b.id === id ? { ...b, status: 'confirmed' } : b));
      setFiltered(bs => bs.map(b => b.id === id ? { ...b, status: 'confirmed' } : b));
    } catch (err) { alert('Failed to confirm booking'); }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Erase this record? This cannot be undone.')) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(bs => bs.filter(b => b.id !== id));
      setFiltered(bs => bs.filter(b => b.id !== id));
    } catch (err) { alert(err.response?.data?.error || 'Failed to delete booking'); }
  };

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 animate-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white mb-2 italic">Queue Registry</h1>
            <p className="text-muted font-medium uppercase tracking-[0.2em] text-[10px]">Filter and manage incoming service requests</p>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-8 bg-surface/30 backdrop-blur-3xl border border-white/5 rounded-[40px] mb-8">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-6 items-end">
            <div className="flex-1 min-w-[280px] space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Search Identifier</label>
              <input 
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-6 text-sm font-bold text-white focus:outline-none focus:border-primary/50 transition-all"
                placeholder="Plate, Customer Name, or Issue..."
                value={search} onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="w-48 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Parameter</label>
              <select 
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-bold text-white focus:outline-none"
                value={searchType} onChange={e => setType(e.target.value)}
              >
                <option value="vehicle">License Plate</option>
                <option value="customer">Customer</option>
                <option value="service">Issue Description</option>
                <option value="date">Scheduled Date</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="h-12 px-8 bg-primary text-white font-black text-sm rounded-xl hover:scale-105 transition-all">
                🔍 Filter
              </button>
              <button type="button" className="h-12 px-6 bg-white/5 border border-white/10 text-white font-black text-sm rounded-xl hover:bg-white/10 transition-all"
                onClick={() => { setSearch(''); setFiltered(bookings); }}>
                Reset
              </button>
            </div>
          </form>
          
          <div className="mt-8 pt-8 border-t border-white/5 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['all','pending','confirmed','cancelled'].map(s => (
              <button key={s} 
                className={`
                  px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                  ${statusFilter === s ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-muted hover:text-white'}
                `}
                onClick={() => setStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? <Loader /> : display.length === 0 ? (
          <div className="p-20 text-center bg-surface/20 border border-white/5 rounded-[40px]">
            <div className="text-6xl mb-6 opacity-20">📋</div>
            <div className="text-xl font-black text-muted italic">No records found in current segment.</div>
          </div>
        ) : (
          <div className="bg-surface/30 backdrop-blur-3xl border border-white/5 rounded-[40px] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted">Log ID</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted">Client Entity</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted">Vehicle Data</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted">Schedule</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted">Status</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {display.map(b => (
                  <tr key={b.id} className="group hover:bg-white/5 transition-all">
                    <td className="p-6 text-sm font-bold text-muted tabular-nums">#{b.id}</td>
                    <td className="p-6">
                      <div className="text-sm font-black text-white group-hover:text-primary transition-colors">{b.customer_name}</div>
                      <div className="text-[10px] font-bold text-muted">{b.customer_email}</div>
                    </td>
                    <td className="p-6">
                      <div className="text-sm font-black text-white">{b.make} {b.model}</div>
                      <div className="text-[10px] font-bold text-primary tracking-widest uppercase">{b.license_plate}</div>
                    </td>
                    <td className="p-6">
                      <div className="text-sm font-black text-white">{new Date(b.preferred_date).toLocaleDateString()}</div>
                      <div className="text-[10px] font-bold text-muted">{b.preferred_time || 'UNSPECIFIED'}</div>
                    </td>
                    <td className="p-6"><StatusBadge status={b.status} /></td>
                    <td className="p-6">
                      <div className="flex justify-end gap-2">
                        {b.status === 'pending' && (
                          <button onClick={() => confirm(b.id)} className="h-10 px-4 bg-success/20 text-success border border-success/20 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-success hover:text-black transition-all">
                            Approve
                          </button>
                        )}
                        <Link to={`/advisor/job-cards/new/${b.id}`} className="h-10 px-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all flex items-center">
                          Initialize Job
                        </Link>
                        <button onClick={() => deleteBooking(b.id)} className="h-10 w-10 bg-danger/10 text-danger border border-danger/20 rounded-xl hover:bg-danger hover:text-white transition-all flex items-center justify-center">
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
