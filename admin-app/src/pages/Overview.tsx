import { useState, useEffect } from 'react';
import { Users, CheckCircle, CreditCard, Globe, TrendingUp, Activity } from 'lucide-react';
import { getShared } from '../utils/sharedData';

interface User {
  id: string;
  name: string;
  email: string;
  verificationStatus: string;
  subscription: string;
  createdAt: string;
}

export default function Overview() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const load = async () => {
      const raw = await getShared('agesmart_users');
      setUsers(raw ? JSON.parse(raw) : []);
    };
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, []);

  const verified = users.filter((u) => u.verificationStatus === 'approved').length;
  const pending = users.filter((u) => u.verificationStatus === 'pending').length;
  const premiumUsers = users.filter((u) => u.subscription === 'premium' || u.subscription === 'enterprise').length;

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Verified', value: verified, icon: CheckCircle, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    { label: 'Pending Review', value: pending, icon: Activity, color: '#eab308', bg: 'rgba(234,179,8,0.1)' },
    { label: 'Paid Subscribers', value: premiumUsers, icon: CreditCard, color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Dashboard Overview</h1>
      <p style={{ color: '#64748b', fontSize: 15, marginBottom: 32 }}>Monitor and manage your AgeSmart platform</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} style={{
            background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{label}</span>
              <div style={{ padding: 8, background: bg, borderRadius: 10 }}>
                <Icon size={18} color={color} />
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={18} color="#3b82f6" /> Recent Signups
          </h3>
          {users.length === 0 ? (
            <p style={{ color: '#475569', fontSize: 14 }}>No users yet</p>
          ) : (
            users.slice(-5).reverse().map((u) => (
              <div key={u.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 0', borderBottom: '1px solid #334155',
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{u.email}</div>
                </div>
                <div style={{ fontSize: 11, color: '#475569' }}>
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe size={18} color="#22c55e" /> Platform Health
          </h3>
          {[
            { label: 'API Status', value: 'Operational', color: '#22c55e' },
            { label: 'Proxy Servers', value: 'All Online', color: '#22c55e' },
            { label: 'Verification Queue', value: `${pending} pending`, color: pending > 0 ? '#eab308' : '#22c55e' },
            { label: 'Storage', value: '23% used', color: '#3b82f6' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 0', borderBottom: '1px solid #334155',
            }}>
              <span style={{ fontSize: 14, color: '#94a3b8' }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
