import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import Navbar from '../../components/Navbar.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import Loader from '../../components/Loader.jsx';

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [recent, setRecent] = useState({ recentBookings: [], recentJobCards: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/dashboard/stats'), api.get('/dashboard/recent')])
      .then(([s, r]) => { setStats(s.data); setRecent(r.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <><Navbar /><Loader /></>;

  const statCards = [
    { label: 'Active Sessions', value: stats?.activeJobs, color: 'text-primary', icon: '🔧', trend: '+5%' },
    { label: 'Gross Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, color: 'text-success', icon: '💰', trend: '+12%' },
    { label: 'Total Operators', value: stats?.totalCustomers, color: 'text-secondary', icon: '👥', trend: '+2' },
    { label: 'Avg Ticket', value: `$${(stats?.totalRevenue / (stats?.completedJobs || 1)).toFixed(0)}`, color: 'text-accent', icon: '🎫', trend: '-1%' },
  ];

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 animate-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white mb-2 italic">Command Center</h1>
            <p className="text-muted font-medium uppercase tracking-[0.2em] text-[10px]">Real-time Workshop Analytics & Control</p>
          </div>
          <div className="flex gap-4">
            <Link to="/admin/bookings" className="px-6 py-3 bg-white/5 border border-white/10 text-white font-black text-sm rounded-xl hover:bg-white/10 transition-all">
              Queue Logs
            </Link>
            <Link to="/admin/job-cards" className="px-6 py-3 bg-primary text-white font-black text-sm rounded-xl shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              Initialize Job
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map(s => (
            <div key={s.label} className="p-8 bg-surface/30 backdrop-blur-3xl border border-white/5 rounded-[40px] group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className={`text-4xl ${s.color} opacity-40 group-hover:scale-110 transition-transform`}>{s.icon}</div>
                <div className={`text-[10px] font-black ${s.trend.startsWith('+') ? 'text-success' : 'text-danger'} bg-white/5 px-2 py-1 rounded-md`}>
                  {s.trend}
                </div>
              </div>
              <div className="text-xs font-black uppercase tracking-widest text-muted mb-2">{s.label}</div>
              <div className={`text-3xl font-black ${s.color} mb-4`}>{s.value}</div>
              {/* Sparkline Visual */}
              <svg width="100%" height="30" className="opacity-30 group-hover:opacity-60 transition-opacity">
                <path 
                  d={`M0 ${10+Math.random()*15} L30 ${10+Math.random()*15} L60 ${10+Math.random()*15} L90 ${10+Math.random()*15} L120 ${10+Math.random()*15} L150 ${10+Math.random()*15} L180 ${10+Math.random()*15} L210 ${10+Math.random()*15} L240 ${10+Math.random()*15}`} 
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={s.color.replace('text-', 'stroke-')}
                />
              </svg>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Efficiency & Status */}
          <section className="lg:col-span-2 space-y-8">
            <div className="p-10 bg-surface/30 backdrop-blur-3xl border border-white/5 rounded-[40px]">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black italic">Operational Throughput</h3>
                <div className="text-[10px] font-black text-muted uppercase tracking-widest">Last 30 Days</div>
              </div>
              <div className="flex flex-wrap gap-20">
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-muted mb-3">Completed Sessions</div>
                  <div className="text-6xl font-black text-white">{stats?.completedJobs || 0}</div>
                </div>
                <div className="w-px h-16 bg-white/5 hidden md:block"></div>
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-muted mb-3">Active Backlog</div>
                  <div className="text-6xl font-black text-primary">{stats?.pendingBookings || 0}</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <section>
                <h2 className="text-lg font-black mb-6 px-2 italic">Live Activity</h2>
                <div className="space-y-3">
                  {recent.recentJobCards.map(j => (
                    <div key={j.id} className="p-5 bg-surface/20 border border-white/5 rounded-[24px] flex items-center justify-between group hover:bg-surface/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-sm">🔧</div>
                        <div>
                          <div className="text-sm font-black text-white group-hover:text-primary transition-colors">{j.customer_name}</div>
                          <div className="text-[10px] font-bold text-muted uppercase tracking-tight">{j.make} {j.model}</div>
                        </div>
                      </div>
                      <StatusBadge status={j.repair_status} />
                    </div>
                  ))}
                </div>
              </section>
              <section>
                <h2 className="text-lg font-black mb-6 px-2 italic">Incoming Bookings</h2>
                <div className="space-y-3">
                  {recent.recentBookings.map(b => (
                    <div key={b.id} className="p-5 bg-surface/20 border border-white/5 rounded-[24px] flex items-center justify-between group hover:bg-surface/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-sm">📅</div>
                        <div>
                          <div className="text-sm font-black text-white group-hover:text-success transition-colors">{b.customer_name}</div>
                          <div className="text-[10px] font-bold text-muted uppercase tracking-tight">{b.preferred_date}</div>
                        </div>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </section>

          {/* Right Sidebar Status Distribution */}
          <section className="space-y-8">
            <div className="p-8 bg-surface/40 backdrop-blur-3xl border border-white/5 rounded-[40px]">
              <h3 className="text-lg font-black mb-8 italic">Workshop Load</h3>
              <div className="space-y-6">
                {stats?.statusCounts?.map(s => {
                  const percentage = Math.round((s.count / stats.activeJobs) * 100) || 0;
                  return (
                    <div key={s.repair_status} className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted">{s.repair_status.replace(/_/g, ' ')}</div>
                        <div className="text-[10px] font-black text-white">{s.count} Units</div>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary shadow-[0_0_8px_var(--primary)] transition-all duration-1000" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-8 bg-primary/10 border border-primary/20 rounded-[40px] text-center">
              <div className="text-4xl mb-4">💎</div>
              <h4 className="text-md font-black text-white mb-2">VSC PRO System</h4>
              <p className="text-[11px] font-medium text-primary/70 leading-relaxed uppercase tracking-widest">Quantum Diagnostics & AI Workshop Optimization Active</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
