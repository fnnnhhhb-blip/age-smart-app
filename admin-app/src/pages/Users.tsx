import { useState, useEffect } from 'react';
import { Users as UsersIcon, Search, Trash2, Ban, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getShared, setShared } from '../utils/sharedData';

interface User {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  verificationStatus: string;
  subscription: string;
  createdAt: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      const raw = await getShared('agesmart_users');
      setUsers(raw ? JSON.parse(raw) : []);
    };
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const saveAndUpdate = async (updated: User[]) => {
    await setShared('agesmart_users', updated);
    setUsers(updated);
  };

  const handleDelete = (id: string) => {
    saveAndUpdate(users.filter((u) => u.id !== id));
  };

  const handleToggleBan = (id: string) => {
    saveAndUpdate(users.map((u) =>
      u.id === id ? { ...u, verified: !u.verified, verificationStatus: u.verificationStatus === 'approved' ? 'rejected' : 'approved' } : u
    ));
  };

  const handleChangeSubscription = (id: string, sub: string) => {
    saveAndUpdate(users.map((u) => (u.id === id ? { ...u, subscription: sub } : u)));
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle size={16} color="#22c55e" />;
      case 'pending': return <Clock size={16} color="#eab308" />;
      case 'rejected': return <XCircle size={16} color="#ef4444" />;
      default: return <XCircle size={16} color="#64748b" />;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>User Management</h1>
          <p style={{ color: '#64748b', fontSize: 15 }}>{users.length} registered users</p>
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: 20 }}>
        <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
        <input
          style={{
            width: '100%', maxWidth: 400, padding: '12px 12px 12px 40px', background: '#1e293b',
            border: '1px solid #334155', borderRadius: 10, color: '#e2e8f0', fontSize: 14, outline: 'none',
          }}
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155' }}>
              {['Name', 'Email', 'Status', 'Subscription', 'Joined', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#475569' }}>
                  No users found
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{u.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#94a3b8' }}>{u.email}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {statusIcon(u.verificationStatus)}
                      <span style={{ fontSize: 13, textTransform: 'capitalize', color: '#cbd5e1' }}>{u.verificationStatus || 'none'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <select
                      value={u.subscription || 'free'}
                      onChange={(e) => handleChangeSubscription(u.id, e.target.value)}
                      style={{
                        padding: '4px 8px', background: '#0f172a', border: '1px solid #334155',
                        borderRadius: 6, color: '#e2e8f0', fontSize: 12, outline: 'none', cursor: 'pointer',
                      }}
                    >
                      <option value="free">Free</option>
                      <option value="premium">Premium</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => handleToggleBan(u.id)}
                        title={u.verificationStatus === 'approved' ? 'Revoke verification' : 'Approve verification'}
                        style={{
                          padding: '6px', background: 'transparent', border: '1px solid #334155',
                          borderRadius: 6, color: u.verificationStatus === 'approved' ? '#ef4444' : '#22c55e', cursor: 'pointer',
                        }}
                      >
                        {u.verificationStatus === 'approved' ? <Ban size={14} /> : <CheckCircle size={14} />}
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        title="Delete user"
                        style={{
                          padding: '6px', background: 'transparent', border: '1px solid #334155',
                          borderRadius: 6, color: '#ef4444', cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
