import { useState } from 'react';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  verificationStatus: string;
  dateOfBirth?: string;
  createdAt: string;
}

function getUsers(): User[] {
  return JSON.parse(localStorage.getItem('agesmart_users') || '[]');
}

function saveUsers(users: User[]) {
  localStorage.setItem('agesmart_users', JSON.stringify(users));
}

export default function Verifications() {
  const [users, setUsers] = useState<User[]>(getUsers());
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? users : users.filter((u) => u.verificationStatus === filter);

  const handleApprove = (id: string) => {
    const updated = users.map((u) => (u.id === id ? { ...u, verificationStatus: 'approved', verified: true } : u));
    saveUsers(updated);
    setUsers(updated);
  };

  const handleReject = (id: string) => {
    const updated = users.map((u) => (u.id === id ? { ...u, verificationStatus: 'rejected', verified: false } : u));
    saveUsers(updated);
    setUsers(updated);
  };

  const counts = {
    all: users.length,
    pending: users.filter((u) => u.verificationStatus === 'pending').length,
    approved: users.filter((u) => u.verificationStatus === 'approved').length,
    rejected: users.filter((u) => u.verificationStatus === 'rejected').length,
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Verification Management</h1>
      <p style={{ color: '#64748b', fontSize: 15, marginBottom: 32 }}>Review and manage age verification requests</p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        {[
          { key: 'all', label: 'All', color: '#3b82f6' },
          { key: 'pending', label: 'Pending', color: '#eab308' },
          { key: 'approved', label: 'Approved', color: '#22c55e' },
          { key: 'rejected', label: 'Rejected', color: '#ef4444' },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: filter === key ? `${color}20` : 'transparent',
              border: `1px solid ${filter === key ? color : '#334155'}`,
              color: filter === key ? color : '#94a3b8',
            }}
          >
            {label} ({counts[key as keyof typeof counts]})
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 40, background: '#1e293b', borderRadius: 16, border: '1px solid #334155', textAlign: 'center', color: '#475569' }}>
            No verification requests found
          </div>
        ) : (
          filtered.map((u) => (
            <div key={u.id} style={{
              background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: '#0f172a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 700, color: '#3b82f6',
                }}>
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{u.email}</div>
                  {u.dateOfBirth && (
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>DOB: {new Date(u.dateOfBirth).toLocaleDateString()}</div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {u.verificationStatus === 'pending' ? (
                  <>
                    <button onClick={() => handleApprove(u.id)} style={{
                      padding: '8px 16px', background: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e40',
                      borderRadius: 8, color: '#22c55e', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button onClick={() => handleReject(u.id)} style={{
                      padding: '8px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid #ef444440',
                      borderRadius: 8, color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      <XCircle size={14} /> Reject
                    </button>
                  </>
                ) : (
                  <div style={{
                    padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                    background: u.verificationStatus === 'approved' ? 'rgba(34,197,94,0.1)' : u.verificationStatus === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(100,116,139,0.1)',
                    color: u.verificationStatus === 'approved' ? '#22c55e' : u.verificationStatus === 'rejected' ? '#ef4444' : '#94a3b8',
                    textTransform: 'capitalize',
                  }}>
                    {u.verificationStatus || 'none'}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
