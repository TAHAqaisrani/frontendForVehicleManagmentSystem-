import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import Navbar from '../../components/Navbar.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import Loader from '../../components/Loader.jsx';

export default function CustomerDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/vehicles'), api.get('/job-cards')])
      .then(([v, j]) => { setVehicles(v.data); setJobs(j.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <><Navbar /><Loader /></>;

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 animate-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white mb-2">My Garage</h1>
            <p className="text-muted font-medium">Manage your fleet and track active service sessions.</p>
          </div>
          <Link to="/customer/book" className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all">
            ➕ Schedule Service
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-8 bg-surface/30 backdrop-blur-xl border border-white/5 rounded-[32px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 text-4xl opacity-20 group-hover:scale-110 transition-transform">🚗</div>
            <div className="text-xs font-black uppercase tracking-widest text-primary mb-2">Active Fleet</div>
            <div className="text-4xl font-black text-white">{vehicles.length}</div>
          </div>
          <div className="p-8 bg-surface/30 backdrop-blur-xl border border-white/5 rounded-[32px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 text-4xl opacity-20 group-hover:scale-110 transition-transform">🔧</div>
            <div className="text-xs font-black uppercase tracking-widest text-secondary mb-2">In Workshop</div>
            <div className="text-4xl font-black text-white">{jobs.filter(j => j.repair_status !== 'delivered').length}</div>
          </div>
          <div className="p-8 bg-surface/30 backdrop-blur-xl border border-white/5 rounded-[32px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 text-4xl opacity-20 group-hover:scale-110 transition-transform">✅</div>
            <div className="text-xs font-black uppercase tracking-widest text-success mb-2">Service History</div>
            <div className="text-4xl font-black text-white">{jobs.filter(j => j.repair_status === 'delivered').length}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Active Jobs */}
          <section className="lg:col-span-2">
            <h2 className="text-xl font-black mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center text-sm">🛠</span>
              Live Service Tracking
            </h2>
            <div className="space-y-4">
              {jobs.filter(j => j.repair_status !== 'delivered').length === 0 ? (
                <div className="p-12 text-center bg-surface/20 border border-white/5 rounded-[32px] text-muted font-bold italic">
                  No active service sessions at the moment.
                </div>
              ) : (
                jobs.filter(j => j.repair_status !== 'delivered').map(j => (
                  <Link to={`/customer/track/${j.id}`} key={j.id} className="block group">
                    <div className="p-6 bg-surface/40 backdrop-blur-xl border border-white/5 rounded-[24px] hover:border-primary/50 transition-all flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-bg border border-white/5 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                          {j.make === 'Toyota' ? '🇯🇵' : j.make === 'BMW' ? '🇩🇪' : j.make === 'Tesla' ? '⚡' : '🚗'}
                        </div>
                        <div>
                          <div className="text-lg font-black text-white group-hover:text-primary transition-colors">{j.make} {j.model}</div>
                          <div className="text-sm font-bold text-muted">{j.license_plate} · {j.package_name || 'General Repair'}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <StatusBadge status={j.repair_status} />
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted">Updated {new Date(j.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>

          {/* Vehicles List */}
          <section>
            <h2 className="text-xl font-black mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm">🚘</span>
              Vehicle List
            </h2>
            <div className="grid gap-4">
              {vehicles.map(v => (
                <div key={v.id} className="p-6 bg-surface/20 border border-white/5 rounded-[24px] hover:bg-surface/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-black text-white">{v.make} {v.model}</div>
                      <div className="text-xs font-bold text-primary tracking-widest uppercase">{v.license_plate}</div>
                    </div>
                    <div className="text-xs font-black px-2 py-1 bg-white/5 rounded-md text-muted">{v.year}</div>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-bold text-muted">
                    <span>{v.color}</span>
                    <button className="text-primary hover:underline">View Stats</button>
                  </div>
                </div>
              ))}
              <Link to="/customer/book" className="p-6 border-2 border-dashed border-white/10 rounded-[24px] text-center text-muted hover:text-white hover:border-primary/50 transition-all font-black text-sm uppercase tracking-widest">
                Add Vehicle
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
