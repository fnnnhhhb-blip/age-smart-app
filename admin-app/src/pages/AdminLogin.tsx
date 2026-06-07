import { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

export default function AdminLogin({ onLogin }: { onLogin: (pw: string) => boolean }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogin(password)) {
      setError('Invalid admin password');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, #1e293b, #0f172a)', padding: 24,
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        border: '1px solid #334155', borderRadius: 16, padding: 40, width: '100%', maxWidth: 440,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/logo.png" alt="AgeSmart Admin" style={{ width: 80, height: 80, borderRadius: 12, marginBottom: 16 }} />
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Admin Access</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Enter the admin password to continue</p>
        </div>

        {error && (
          <div style={{ padding: '10px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#ef4444', fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              style={{
                width: '100%', padding: '14px 14px 14px 44px', background: '#0f172a',
                border: '1px solid #334155', borderRadius: 10, color: '#e2e8f0', fontSize: 14, outline: 'none',
              }}
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={{
            width: '100%', padding: '14px', background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            Access Admin Panel <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#475569', fontSize: 12 }}>
          Default password: admin123
        </p>
      </div>
    </div>
  );
}
