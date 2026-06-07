import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Globe, Save, CheckCircle, Power, PowerOff } from 'lucide-react';

interface ProxyConfig {
  enabled: boolean;
  ip: string;
  port: string;
  username: string;
  password: string;
}

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [profileSaved, setProfileSaved] = useState(false);
  const [proxySaved, setProxySaved] = useState(false);
  const [proxy, setProxy] = useState<ProxyConfig>({
    enabled: false, ip: '', port: '', username: '', password: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('agesmart_proxy');
    if (saved) setProxy(JSON.parse(saved));
  }, []);

  const handleSaveProfile = () => {
    updateUser({ name });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleSaveProxy = () => {
    localStorage.setItem('agesmart_proxy', JSON.stringify(proxy));
    setProxySaved(true);
    setTimeout(() => setProxySaved(false), 2000);
  };

  const toggleProxy = () => {
    const updated = { ...proxy, enabled: !proxy.enabled };
    setProxy(updated);
    localStorage.setItem('agesmart_proxy', JSON.stringify(updated));
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', background: '#0f172a', border: '1px solid #334155',
    borderRadius: 10, color: '#e2e8f0', fontSize: 14, outline: 'none',
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Settings</h1>
      <p style={{ color: '#64748b', fontSize: 15, marginBottom: 32 }}>Manage your account and proxy settings</p>

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
            onClick={handleSaveProfile}
            style={{
              padding: '10px 20px', background: profileSaved ? 'rgba(34,197,94,0.2)' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
              border: profileSaved ? '1px solid #22c55e40' : 'none', borderRadius: 10,
              color: profileSaved ? '#22c55e' : '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            {profileSaved ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
          </button>
        </div>

        {/* Proxy Switcher */}
        <div style={{
          background: '#1e293b', border: `1px solid ${proxy.enabled ? '#22c55e40' : '#334155'}`, borderRadius: 16, padding: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
              <Globe size={18} color="#a855f7" /> Proxy Settings
            </h3>
            <button
              onClick={toggleProxy}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8,
                fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                background: proxy.enabled ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                border: `1px solid ${proxy.enabled ? '#22c55e40' : '#ef444440'}`,
                color: proxy.enabled ? '#22c55e' : '#ef4444',
              }}
            >
              {proxy.enabled ? <><Power size={14} /> ON</> : <><PowerOff size={14} /> OFF</>}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>IP Address</label>
              <input
                style={inputStyle}
                placeholder="192.168.1.1"
                value={proxy.ip}
                onChange={(e) => setProxy({ ...proxy, ip: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Port</label>
              <input
                style={inputStyle}
                placeholder="8080"
                value={proxy.port}
                onChange={(e) => setProxy({ ...proxy, port: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Username</label>
              <input
                style={inputStyle}
                placeholder="proxy_user"
                value={proxy.username}
                onChange={(e) => setProxy({ ...proxy, username: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Password</label>
              <input
                style={inputStyle}
                type="password"
                placeholder="••••••••"
                value={proxy.password}
                onChange={(e) => setProxy({ ...proxy, password: e.target.value })}
              />
            </div>
          </div>

          {proxy.enabled && proxy.ip && proxy.port && (
            <div style={{
              padding: '10px 14px', background: 'rgba(34,197,94,0.08)', border: '1px solid #22c55e30',
              borderRadius: 8, marginBottom: 16, fontSize: 12, color: '#94a3b8',
            }}>
              Active proxy: <span style={{ color: '#22c55e', fontWeight: 600 }}>
                {proxy.ip}:{proxy.port}
              </span>
              {proxy.username && <> (auth: <span style={{ color: '#e2e8f0' }}>{proxy.username}</span>)</>}
            </div>
          )}

          <button
            onClick={handleSaveProxy}
            style={{
              padding: '10px 20px', background: proxySaved ? 'rgba(34,197,94,0.2)' : 'linear-gradient(135deg, #a855f7, #7c3aed)',
              border: proxySaved ? '1px solid #22c55e40' : 'none', borderRadius: 10,
              color: proxySaved ? '#22c55e' : '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            {proxySaved ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} /> Save Proxy</>}
          </button>
        </div>
      </div>
    </div>
  );
}
