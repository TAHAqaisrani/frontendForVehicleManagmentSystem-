import { Link } from 'react-router-dom';
import heroImg from '../assets/hero.png';

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg text-white overflow-x-hidden selection:bg-primary/30">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full h-24 flex items-center justify-between px-[5%] z-50 transition-all duration-500 bg-bg/50 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            🚗
          </div>
          <span className="font-black text-2xl tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            VSC.PRO
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-bold text-muted hover:text-white transition-colors">Sign In</Link>
          <Link to="/register" className="px-6 py-3 bg-white text-black font-black text-sm rounded-xl hover:bg-primary hover:text-white transition-all shadow-xl shadow-white/5">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center px-[5%] pt-20">
        <div className="max-w-4xl z-10 animate-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-black uppercase tracking-[0.2em] mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Next-Gen Workshop OS
          </div>
          <h1 className="text-7xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8 bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
            Precision <br />
            <span className="text-primary italic">Intelligence.</span>
          </h1>
          <p className="text-xl text-muted max-w-xl mb-12 leading-relaxed font-medium">
            The world's most advanced platform for vehicle diagnostics, management, and real-time telemetry. Engineered for those who demand excellence.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/register" className="group relative px-10 py-5 bg-primary text-white font-black rounded-2xl overflow-hidden shadow-2xl shadow-primary/40 hover:scale-105 transition-all">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              Initialize Fleet
            </Link>
            <Link to="/login" className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all backdrop-blur-xl">
              Access Terminal
            </Link>
          </div>
        </div>

        {/* Floating Visual Asset */}
        <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-1/2 h-4/5 hidden lg:block animate-float">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-bg to-transparent z-20" />
            <div className="absolute inset-0 border-[20px] border-bg z-30" />
            <img src={heroImg} alt="Hero" className="w-full h-full object-cover rounded-[60px] grayscale brightness-75 border border-white/10" />
            
            {/* UI Mockup Overlays */}
            <div className="absolute top-20 -left-20 p-6 bg-surface/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl z-40 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">⚡</div>
                <div>
                  <div className="text-xs text-muted uppercase font-bold">Engine Load</div>
                  <div className="text-xl font-black">94.2%</div>
                </div>
              </div>
              <div className="w-40 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[94%] h-full bg-primary" />
              </div>
            </div>

            <div className="absolute bottom-20 right-0 p-6 bg-surface/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl z-40">
              <div className="text-xs text-muted uppercase font-bold mb-2">Live Telemetry</div>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(i => <div key={i} className="w-2 bg-primary rounded-full" style={{ height: `${20+Math.random()*40}px` }} />)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-32 px-[5%] border-y border-white/5 bg-surface/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: 'Uptime', val: '99.99%' },
            { label: 'Diagnostics', val: '2M+' },
            { label: 'Garages', val: '12K' },
            { label: 'Latency', val: '<10ms' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-black mb-2">{s.val}</div>
              <div className="text-xs text-primary font-black uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-32 px-[5%] relative">
        <div className="text-center mb-24">
          <h2 className="text-5xl font-black mb-6">Core Infrastructure</h2>
          <p className="text-muted max-w-2xl mx-auto">VSC PRO is more than a management tool. It's a high-performance operating system for the modern workshop.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '📡', title: 'Edge Telemetry', desc: 'Real-time data streaming from vehicle to technician with sub-millisecond latency.' },
            { icon: '🧠', title: 'Neural Engine', desc: 'Predictive maintenance algorithms that identify failures before they happen.' },
            { icon: '🔐', title: 'Quantum Auth', desc: 'Next-generation security protocols protecting every byte of vehicle data.' },
          ].map(f => (
            <div key={f.title} className="group p-10 bg-surface/40 backdrop-blur-xl border border-white/5 rounded-[40px] hover:border-primary/50 transition-all duration-500 hover:-translate-y-2">
              <div className="text-5xl mb-8 group-hover:scale-110 transition-transform">{f.icon}</div>
              <h3 className="text-2xl font-black mb-4">{f.title}</h3>
              <p className="text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-[5%] border-t border-white/5 flex flex-col items-center gap-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-sm">🚗</div>
          <span className="font-black text-lg tracking-tighter opacity-50">VSC.PRO SYSTEM</span>
        </div>
        <p className="text-xs text-muted font-bold tracking-[0.3em] uppercase">&copy; 2026 NEXUS CORE TECHNOLOGIES</p>
      </footer>
    </div>
  );
}
