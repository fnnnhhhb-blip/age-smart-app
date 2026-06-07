import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, User, Bell, Shield, Save } from 'lucide-react';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateUser({ name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px', background: '#0f172a', border: '1px solid #334155',
    borderRadius: 10, color: '#e2e8f0', fontSize: 14, outline: 'none',
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Settings</h1>
      <p style={{ color: '#64748b', fontSize: 15, marginBottom: 32 }}>Manage your account preferences</p>

      <div style={{ maxWidth: 600 }}>
        {/* Profile */}
        <div style={{
          background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24, marginBottom: 20,
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={18} color="#3b82f6" /> Profile
          </h3>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>Full Name</label>
            <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>Email</label>
            <input style={{ ...inputStyle, opacity: 0.6 }} value={user?.email || ''} readOnly />
          </div>
          <button
            onClick={handleSave}
            style={{
              padding: '12px 24px', background: saved ? 'rgba(34,197,94,0.2)' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
              border: saved ? '1px solid #22c55e40' : 'none', borderRadius: 10,
              color: saved ? '#22c55e' : '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <Save size={16} /> {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        {/* Notifications */}
        <div style={{
          background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24, marginBottom: 20,
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={18} color="#eab308" /> Notifications
          </h3>
          {['Verification updates', 'Subscription reminders', 'Security alerts'].map((item) => (
            <div key={item} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 0', borderBottom: '1px solid #334155',
            }}>
              <span style={{ fontSize: 14, color: '#cbd5e1' }}>{item}</span>
              <label style={{
                width: 44, height: 24, background: '#22c55e', borderRadius: 12, position: 'relative', cursor: 'pointer',
              }}>
                <div style={{
                  width: 20, height: 20, background: '#fff', borderRadius: 10,
                  position: 'absolute', top: 2, right: 2, transition: 'all 0.2s',
                }} />
              </label>
            </div>
          ))}
        </div>

        {/* Security */}
        <div style={{
          background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24,
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={18} color="#ef4444" /> Security
          </h3>
          <button style={{
            padding: '12px 24px', background: 'transparent', border: '1px solid #334155',
            borderRadius: 10, color: '#e2e8f0', fontSize: 14, fontWeight: 500, cursor: 'pointer',
            marginRight: 12,
          }}>
            Change Password
          </button>
          <button style={{
            padding: '12px 24px', background: 'transparent', border: '1px solid #334155',
            borderRadius: 10, color: '#e2e8f0', fontSize: 14, fontWeight: 500, cursor: 'pointer',
          }}>
            Enable 2FA
          </button>
        </div>
      </div>
    </div>
  );
}
