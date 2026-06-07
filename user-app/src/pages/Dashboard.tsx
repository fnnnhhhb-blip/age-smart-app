import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Wallet, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { user, changePassword } = useAuth();
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (newPw.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }
    if (newPw !== confirmPw) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    const success = await changePassword(currentPw, newPw);
    if (success) {
      setMessage({ type: 'success', text: 'Password changed successfully' });
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    } else {
      setMessage({ type: 'error', text: 'Current password is incorrect' });
    }
  };

  const balance = user?.subscription === 'enterprise' ? 29.99 : user?.subscription === 'premium' ? 9.99 : 0;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px 12px 42px', background: '#0f172a',
    border: '1px solid #334155', borderRadius: 10, color: '#e2e8f0', fontSize: 14, outline: 'none',
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p style={{ color: '#64748b', fontSize: 15 }}>Manage your account</p>
      </div>

      {/* Balance Card */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', border: '1px solid #334155',
        borderRadius: 16, padding: 32, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>Account Balance</div>
          <div style={{ fontSize: 42, fontWeight: 800, color: '#3b82f6' }}>${balance.toFixed(2)}</div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
            {user?.subscription === 'free' ? 'Free Plan' : `${user?.subscription} Plan`}
          </div>
        </div>
        <div style={{ padding: 16, background: 'rgba(59,130,246,0.1)', borderRadius: 16 }}>
          <Wallet size={48} color="#3b82f6" />
        </div>
      </div>

      {/* Password Change */}
      <div style={{
        background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 28,
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Lock size={20} color="#3b82f6" /> Change Password
        </h2>

        {message && (
          <div style={{
            padding: '10px 16px', borderRadius: 8, marginBottom: 16, fontSize: 13,
            display: 'flex', alignItems: 'center', gap: 8,
            background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
            color: message.type === 'success' ? '#22c55e' : '#ef4444',
          }}>
            {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleChangePassword}>
          <div style={{ display: 'grid', gap: 16, maxWidth: 400 }}>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                style={inputStyle}
                type={showCurrent ? 'text' : 'password'}
                placeholder="Current password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                required
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                style={inputStyle}
                type={showNew ? 'text' : 'password'}
                placeholder="New password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                required
              />
              <button type="button" onClick={() => setShowNew(!showNew)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                style={inputStyle}
                type="password"
                placeholder="Confirm new password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                required
              />
            </div>
            <button type="submit" style={{
              padding: '12px 24px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', width: 'fit-content',
            }}>
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
