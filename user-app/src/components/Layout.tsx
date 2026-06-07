import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, CheckCircle, CreditCard, Globe, Settings, LogOut } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard', end: true },
  { to: '/verification', icon: CheckCircle, label: 'Verification' },
  { to: '/subscription', icon: CreditCard, label: 'Subscription' },
  { to: '/browse', icon: Globe, label: 'Browse' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 260,
        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        borderRight: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '0 24px',
          marginBottom: 40,
        }}>
          <img src="/logo.png" alt="AgeSmart" style={{ width: 36, height: 36 }} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>AgeSmart</div>
            <div style={{ fontSize: 11, color: '#64748b', letterSpacing: 1 }}>VERIFICATION</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1 }}>
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 24px',
                color: isActive ? '#3b82f6' : '#94a3b8',
                background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                borderRight: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                transition: 'all 0.2s',
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
              })}
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div style={{ padding: '0 24px' }}>
          <div style={{
            padding: '16px',
            background: '#1e293b',
            borderRadius: 12,
            border: '1px solid #334155',
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{user?.name}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{user?.email}</div>
            <div style={{
              display: 'inline-block',
              marginTop: 8,
              padding: '2px 8px',
              borderRadius: 9999,
              fontSize: 11,
              fontWeight: 600,
              background: user?.subscription === 'premium' ? 'rgba(168, 85, 247, 0.2)' : user?.subscription === 'enterprise' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(100, 116, 139, 0.2)',
              color: user?.subscription === 'premium' ? '#a855f7' : user?.subscription === 'enterprise' ? '#eab308' : '#94a3b8',
              textTransform: 'uppercase',
            }}>
              {user?.subscription}
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 12,
              padding: '10px 16px',
              width: '100%',
              background: 'transparent',
              border: '1px solid #334155',
              borderRadius: 8,
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: 13,
              transition: 'all 0.2s',
            }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: 32, overflowY: 'auto', background: '#0f172a' }}>
        <Outlet />
      </main>
    </div>
  );
}
