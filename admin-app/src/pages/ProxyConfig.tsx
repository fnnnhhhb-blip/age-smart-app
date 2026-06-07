import { useState } from 'react';
import { Globe, Plus, Trash2, Shield, Wifi, Server } from 'lucide-react';

interface ProxyServer {
  id: string;
  name: string;
  address: string;
  type: string;
  status: 'active' | 'inactive';
}

const defaultServers: ProxyServer[] = [
  { id: '1', name: 'US East', address: 'us-east.proxy.agesmart.com:8080', type: 'HTTP', status: 'active' },
  { id: '2', name: 'EU West', address: 'eu-west.proxy.agesmart.com:8080', type: 'HTTP', status: 'active' },
  { id: '3', name: 'Asia Pacific', address: 'ap.proxy.agesmart.com:1080', type: 'SOCKS5', status: 'active' },
];

export default function ProxyConfig() {
  const [servers, setServers] = useState<ProxyServer[]>(() => {
    const saved = localStorage.getItem('agesmart_proxy_servers');
    return saved ? JSON.parse(saved) : defaultServers;
  });
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newType, setNewType] = useState('HTTP');

  const save = (s: ProxyServer[]) => {
    setServers(s);
    localStorage.setItem('agesmart_proxy_servers', JSON.stringify(s));
  };

  const handleAdd = () => {
    if (!newName.trim() || !newAddress.trim()) return;
    const server: ProxyServer = {
      id: crypto.randomUUID(),
      name: newName,
      address: newAddress,
      type: newType,
      status: 'active',
    };
    save([...servers, server]);
    setNewName('');
    setNewAddress('');
  };

  const handleToggle = (id: string) => {
    save(servers.map((s) => (s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' as const : 'active' as const } : s)));
  };

  const handleDelete = (id: string) => {
    save(servers.filter((s) => s.id !== id));
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', background: '#0f172a', border: '1px solid #334155',
    borderRadius: 8, color: '#e2e8f0', fontSize: 13, outline: 'none',
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Proxy Configuration</h1>
      <p style={{ color: '#64748b', fontSize: 15, marginBottom: 32 }}>Manage proxy servers available to users</p>

      {/* Add new server */}
      <div style={{
        background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24, marginBottom: 24,
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} color="#3b82f6" /> Add Proxy Server
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto 100px', gap: 12, alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Server Name</label>
            <input style={inputStyle} placeholder="e.g. US West" value={newName} onChange={(e) => setNewName(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Address</label>
            <input style={inputStyle} placeholder="host:port" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Type</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={newType} onChange={(e) => setNewType(e.target.value)}>
              <option value="HTTP">HTTP</option>
              <option value="HTTPS">HTTPS</option>
              <option value="SOCKS5">SOCKS5</option>
            </select>
          </div>
          <button onClick={handleAdd} style={{
            padding: '10px 16px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', height: 38,
          }}>
            Add
          </button>
        </div>
      </div>

      {/* Server list */}
      <div style={{ display: 'grid', gap: 12 }}>
        {servers.map((s) => (
          <div key={s.id} style={{
            background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            opacity: s.status === 'inactive' ? 0.5 : 1,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                padding: 10, background: s.status === 'active' ? 'rgba(34,197,94,0.1)' : 'rgba(100,116,139,0.1)',
                borderRadius: 10,
              }}>
                <Server size={20} color={s.status === 'active' ? '#22c55e' : '#64748b'} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>{s.name}</div>
                <div style={{ fontSize: 13, color: '#64748b', display: 'flex', gap: 12, marginTop: 2 }}>
                  <span>{s.address}</span>
                  <span style={{ padding: '1px 6px', background: '#0f172a', borderRadius: 4, fontSize: 11 }}>{s.type}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => handleToggle(s.id)}
                style={{
                  padding: '6px 14px', background: 'transparent',
                  border: `1px solid ${s.status === 'active' ? '#22c55e40' : '#334155'}`,
                  borderRadius: 6, color: s.status === 'active' ? '#22c55e' : '#64748b',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}
              >
                {s.status === 'active' ? 'Active' : 'Inactive'}
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                style={{
                  padding: '6px', background: 'transparent', border: '1px solid #334155',
                  borderRadius: 6, color: '#ef4444', cursor: 'pointer',
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
