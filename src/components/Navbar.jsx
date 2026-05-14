import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const NAV = {
    admin: [
      { path: '/admin/dashboard', label: 'Overview', icon: '📊' },
      { path: '/admin/bookings', label: 'Bookings', icon: '📋' },
      { path: '/admin/job-cards', label: 'Workshop', icon: '🔧' },
      { path: '/admin/users', label: 'Personnel', icon: '👥' },
    ],
    advisor: [
      { path: '/advisor/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/advisor/job-cards', label: 'Job Cards', icon: '🗂' },
    ],
    technician: [
      { path: '/technician/queue', label: 'My Queue', icon: '🛠' },
    ],
    customer: [
      { path: '/customer/dashboard', label: 'Garage', icon: '🚗' },
      { path: '/customer/book', label: 'Book Service', icon: '📅' },
      { path: '/customer/history', label: 'Records', icon: '📜' },
    ]
  };

  const handleLogout = () => { logout(); navigate('/'); };

  if (!user) return null;

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-6xl pointer-events-none">
      <div className="bg-surface/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-3 px-6 flex items-center justify-between shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] pointer-events-auto">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3 no-underline group pointer-events-auto">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-xl shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform">
              🚗
            </div>
            <span className="font-black text-xl tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              VSC.PRO
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {(NAV[user.role] || []).map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300
                    flex items-center gap-2 group pointer-events-auto
                    ${active ? 'text-white' : 'text-muted hover:text-white'}
                  `}
                >
                  {active && (
                    <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />
                  )}
                  <span className="relative z-10">{item.icon}</span>
                  <span className="relative z-10">{item.label}</span>
                  {active && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-primary rounded-full shadow-[0_0_8px_var(--primary)]" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end leading-none">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">{user.role}</span>
            <span className="text-sm font-bold text-white">{user.name}</span>
          </div>
          <div className="w-px h-6 bg-white/10 mx-2"></div>
          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-xl border border-white/5 bg-white/5 flex items-center justify-center text-lg hover:bg-danger/20 hover:border-danger/30 hover:text-danger transition-all pointer-events-auto"
            title="Logout"
          >
            🚪
          </button>
        </div>
      </div>
    </nav>
  );
}
