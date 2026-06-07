import { useState } from 'react';
import { Settings, Save, ToggleLeft, ToggleRight } from 'lucide-react';

interface AppConfig {
  appName: string;
  minAge: number;
  requireIdUpload: boolean;
  allowProxyBrowsing: boolean;
  maxDevicesFree: number;
  maxDevicesPremium: number;
  maxDevicesEnterprise: number;
  freePlanPrice: string;
  premiumPlanPrice: string;
  enterprisePlanPrice: string;
  maintenanceMode: boolean;
  allowSignups: boolean;
}

const defaults: AppConfig = {
  appName: 'AgeSmart',
  minAge: 18,
  requireIdUpload: true,
  allowProxyBrowsing: true,
  maxDevicesFree: 1,
  maxDevicesPremium: 5,
  maxDevicesEnterprise: 999,
  freePlanPrice: '0',
  premiumPlanPrice: '9.99',
  enterprisePlanPrice: '29.99',
  maintenanceMode: false,
  allowSignups: true,
};

export default function AppSettings() {
  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('agesmart_config');
    return saved ? JSON.parse(saved) : defaults;
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('agesmart_config', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const update = <K extends keyof AppConfig>(key: K, value: AppConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', background: '#0f172a', border: '1px solid #334155',
    borderRadius: 8, color: '#e2e8f0', fontSize: 13, outline: 'none',
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!value)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
      {value ? <ToggleRight size={28} color="#22c55e" /> : <ToggleLeft size={28} color="#475569" />}
    </button>
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>App Settings</h1>
          <p style={{ color: '#64748b', fontSize: 15 }}>Configure the user-facing application</p>
        </div>
        <button onClick={handleSave} style={{
          padding: '12px 24px', background: saved ? 'rgba(34,197,94,0.2)' : 'linear-gradient(135deg, #ef4444, #dc2626)',
          border: saved ? '1px solid #22c55e40' : 'none', borderRadius: 10,
          color: saved ? '#22c55e' : '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Save size={16} /> {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* General */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>General</h3>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>App Name</label>
            <input style={inputStyle} value={config.appName} onChange={(e) => update('appName', e.target.value)} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Minimum Age</label>
            <input style={inputStyle} type="number" value={config.minAge} onChange={(e) => update('minAge', parseInt(e.target.value))} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid #334155' }}>
            <span style={{ fontSize: 14, color: '#cbd5e1' }}>Require ID Upload</span>
            <Toggle value={config.requireIdUpload} onChange={(v) => update('requireIdUpload', v)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid #334155' }}>
            <span style={{ fontSize: 14, color: '#cbd5e1' }}>Allow Proxy Browsing</span>
            <Toggle value={config.allowProxyBrowsing} onChange={(v) => update('allowProxyBrowsing', v)} />
          </div>
        </div>

        {/* Pricing */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>Pricing</h3>
          {[
            { label: 'Free Plan Price', key: 'freePlanPrice' as const },
            { label: 'Premium Plan Price', key: 'premiumPlanPrice' as const },
            { label: 'Enterprise Plan Price', key: 'enterprisePlanPrice' as const },
          ].map(({ label, key }) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>{label} ($/month)</label>
              <input style={inputStyle} value={config[key]} onChange={(e) => update(key, e.target.value)} />
            </div>
          ))}
        </div>

        {/* Device limits */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>Device Limits</h3>
          {[
            { label: 'Free Plan', key: 'maxDevicesFree' as const },
            { label: 'Premium Plan', key: 'maxDevicesPremium' as const },
            { label: 'Enterprise Plan', key: 'maxDevicesEnterprise' as const },
          ].map(({ label, key }) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>{label} Max Devices</label>
              <input style={inputStyle} type="number" value={config[key]} onChange={(e) => update(key, parseInt(e.target.value))} />
            </div>
          ))}
        </div>

        {/* System */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>System</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #334155' }}>
            <div>
              <div style={{ fontSize: 14, color: '#cbd5e1' }}>Maintenance Mode</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Disable user access temporarily</div>
            </div>
            <Toggle value={config.maintenanceMode} onChange={(v) => update('maintenanceMode', v)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
            <div>
              <div style={{ fontSize: 14, color: '#cbd5e1' }}>Allow New Signups</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Enable/disable user registration</div>
            </div>
            <Toggle value={config.allowSignups} onChange={(v) => update('allowSignups', v)} />
          </div>
        </div>
      </div>
    </div>
  );
}
