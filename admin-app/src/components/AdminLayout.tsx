import { Outlet, NavLink } from 'react-router-dom';
import { CreditCard, Users, Sliders, LogOut } from 'lucide-react';

const navItems = [
  { to: '/', icon: CreditCard, label: 'Subscriptions', end: true },
  { to: '/users', icon: Users, label: 'Users' },
  { to: '/app-control', icon: Sliders, label: 'App Control' },
];

export default function AdminLayout({ onLogout }: { onLogout: () => void }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: 260, background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', padding: '24px 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px', marginBottom: 8 }}>
          <img src="/logo.png" alt="AgeSmart Admin" style={{ width: 48, height: 48, borderRadius: 8 }} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>Age Smart</div>
            <div style={{ fontSize: 11, color: '#ef4444', letterSpacing: 1, fontWeight: 600 }}>ADMIN PANEL</div>
          </div>
        </div>

        <div style={{
          margin: '16px 24px', padding: '8px 12px', background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8,
          fontSize: 11, color: '#ef4444', fontWeight: 600, textAlign: 'center',
        }}>
          ADMINISTRATOR ACCESS
        </div>

        <nav style={{ flex: 1 }}>
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px',
                color: isActive ? '#ef4444' : '#94a3b8',
                background: isActive ? 'rgba(239,68,68,0.1)' : 'transparent',
                borderRight: isActive ? '3px solid #ef4444' : '3px solid transparent',
                transition: 'all 0.2s', fontSize: 14, fontWeight: isActive ? 600 : 400, cursor: 'pointer',
              })}
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '0 24px' }}>
          <button
            onClick={onLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', width: '100%',
              background: 'transparent', border: '1px solid #334155', borderRadius: 8,
              color: '#ef4444', cursor: 'pointer', fontSize: 13,
            }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: 32, overflowY: 'auto', background: '#0f172a' }}>
        <Outlet />
      </main>
    </div>
  );
}
