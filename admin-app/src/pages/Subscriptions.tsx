import { useState } from 'react';
import { CreditCard, Star, Zap, Crown } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  subscription: string;
}

function getUsers(): User[] {
  return JSON.parse(localStorage.getItem('agesmart_users') || '[]');
}

export default function Subscriptions() {
  const users = getUsers();

  const plans = [
    { id: 'free', name: 'Free', icon: Star, color: '#64748b', price: '$0/mo' },
    { id: 'premium', name: 'Premium', icon: Zap, color: '#a855f7', price: '$9.99/mo' },
    { id: 'enterprise', name: 'Enterprise', icon: Crown, color: '#eab308', price: '$29.99/mo' },
  ];

  const countByPlan = (id: string) => users.filter((u) => (u.subscription || 'free') === id).length;

  const revenue = users.reduce((sum, u) => {
    if (u.subscription === 'premium') return sum + 9.99;
    if (u.subscription === 'enterprise') return sum + 29.99;
    return sum;
  }, 0);

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Subscription Overview</h1>
      <p style={{ color: '#64748b', fontSize: 15, marginBottom: 32 }}>Monitor subscription plans and revenue</p>

      {/* Revenue card */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid #334155',
        borderRadius: 16, padding: 28, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>Monthly Recurring Revenue</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#22c55e' }}>${revenue.toFixed(2)}</div>
        </div>
        <CreditCard size={48} color="#334155" />
      </div>

      {/* Plan breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
        {plans.map(({ id, name, icon: Icon, color, price }) => {
          const count = countByPlan(id);
          return (
            <div key={id} style={{
              background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ padding: 10, background: `${color}15`, borderRadius: 12 }}>
                  <Icon size={24} color={color} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>{name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{price}</div>
                </div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color }}>{count}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>subscribers</div>
            </div>
          );
        })}
      </div>

      {/* Subscribers list */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>All Subscribers</h3>
        {users.length === 0 ? (
          <p style={{ color: '#475569', fontSize: 14 }}>No subscribers yet</p>
        ) : (
          users.map((u) => (
            <div key={u.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 0', borderBottom: '1px solid #334155',
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{u.name}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{u.email}</div>
              </div>
              <div style={{
                padding: '4px 12px', borderRadius: 9999, fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                background: u.subscription === 'premium' ? 'rgba(168,85,247,0.2)' : u.subscription === 'enterprise' ? 'rgba(234,179,8,0.2)' : 'rgba(100,116,139,0.2)',
                color: u.subscription === 'premium' ? '#a855f7' : u.subscription === 'enterprise' ? '#eab308' : '#94a3b8',
              }}>
                {u.subscription || 'free'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
