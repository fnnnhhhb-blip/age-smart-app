import { useState, useEffect } from 'react';
import { CreditCard, Star, Zap, Crown, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getShared, setShared } from '../utils/sharedData';

interface User {
  id: string;
  name: string;
  email: string;
  subscription: string;
}

interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function Subscriptions() {
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    const load = async () => {
      const usersRaw = await getShared('agesmart_users');
      const reqsRaw = await getShared('agesmart_payment_requests');
      setUsers(usersRaw ? JSON.parse(usersRaw) : []);
      setRequests(reqsRaw ? JSON.parse(reqsRaw) : []);
    };
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, []);

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

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const filteredRequests = filter === 'all' ? requests : requests.filter((r) => r.status === filter);

  const handleApprove = async (requestId: string) => {
    const updated = requests.map((r) => {
      if (r.id === requestId) {
        const allUsers = [...users];
        const userIdx = allUsers.findIndex((u) => u.id === r.userId);
        if (userIdx >= 0) {
          allUsers[userIdx].subscription = r.plan;
          setShared('agesmart_users', allUsers);
          setUsers(allUsers);
        }
        return { ...r, status: 'approved' as const };
      }
      return r;
    });
    await setShared('agesmart_payment_requests', updated);
    setRequests(updated);
  };

  const handleReject = async (requestId: string) => {
    const updated = requests.map((r) =>
      r.id === requestId ? { ...r, status: 'rejected' as const } : r
    );
    await setShared('agesmart_payment_requests', updated);
    setRequests(updated);
  };

  const planColors: Record<string, string> = {
    free: '#64748b', premium: '#a855f7', enterprise: '#eab308',
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Subscription Management</h1>
      <p style={{ color: '#64748b', fontSize: 15, marginBottom: 32 }}>Manage payment requests and subscriptions</p>

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

      {/* Payment Requests */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
            Payment Requests
            {pendingCount > 0 && (
              <span style={{
                padding: '2px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 700,
                background: 'rgba(234,179,8,0.2)', color: '#eab308',
              }}>
                {pendingCount} pending
              </span>
            )}
          </h3>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  textTransform: 'capitalize', cursor: 'pointer',
                  background: filter === f ? 'rgba(239,68,68,0.15)' : 'transparent',
                  border: `1px solid ${filter === f ? '#ef4444' : '#334155'}`,
                  color: filter === f ? '#ef4444' : '#94a3b8',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <p style={{ color: '#475569', fontSize: 14, textAlign: 'center', padding: '24px 0' }}>No payment requests</p>
        ) : (
          filteredRequests.map((req) => (
            <div key={req.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px', marginBottom: 8, background: '#0f172a', borderRadius: 12, border: '1px solid #334155',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: req.status === 'pending' ? 'rgba(234,179,8,0.1)' : req.status === 'approved' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {req.status === 'pending' ? <Clock size={20} color="#eab308" /> :
                   req.status === 'approved' ? <CheckCircle size={20} color="#22c55e" /> :
                   <XCircle size={20} color="#ef4444" />}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{req.userName}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{req.userEmail}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  padding: '4px 12px', borderRadius: 9999, fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                  background: `${planColors[req.plan] || '#64748b'}20`,
                  color: planColors[req.plan] || '#64748b',
                }}>
                  {req.plan}
                </div>
                <div style={{ fontSize: 12, color: '#475569' }}>
                  {new Date(req.createdAt).toLocaleDateString()}
                </div>
                {req.status === 'pending' ? (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => handleApprove(req.id)}
                      style={{
                        padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                        background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)',
                        color: '#22c55e', cursor: 'pointer',
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      style={{
                        padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                        background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                        color: '#ef4444', cursor: 'pointer',
                      }}
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span style={{
                    padding: '4px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                    background: req.status === 'approved' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                    color: req.status === 'approved' ? '#22c55e' : '#ef4444',
                  }}>
                    {req.status}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
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
