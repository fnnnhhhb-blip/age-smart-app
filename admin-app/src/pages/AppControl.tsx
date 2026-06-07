import { useState, useEffect } from 'react';
import { Save, ToggleLeft, ToggleRight, Type, MousePointer } from 'lucide-react';
import { getShared, setShared } from '../utils/sharedData';

interface AppControlConfig {
  appName: string;
  welcomeMessage: string;
  signupButtonText: string;
  loginButtonText: string;
  verificationButtonText: string;
  subscriptionButtonText: string;
  browseButtonText: string;
  dashboardTitle: string;
  showVerification: boolean;
  showSubscription: boolean;
  showBrowse: boolean;
  showSettings: boolean;
  allowSignups: boolean;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  footerText: string;
}

const defaults: AppControlConfig = {
  appName: 'AgeSmart',
  welcomeMessage: 'Welcome back',
  signupButtonText: 'Create Account',
  loginButtonText: 'Sign In',
  verificationButtonText: 'Start Verification',
  subscriptionButtonText: 'Request Plan',
  browseButtonText: 'Browse',
  dashboardTitle: "Here's an overview of your account",
  showVerification: true,
  showSubscription: true,
  showBrowse: true,
  showSettings: true,
  allowSignups: true,
  maintenanceMode: false,
  maintenanceMessage: 'The app is currently under maintenance. Please check back later.',
  footerText: '',
};

export default function AppControl() {
  const [config, setConfig] = useState<AppControlConfig>(defaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      const raw = await getShared('agesmart_app_control');
      if (raw) setConfig(JSON.parse(raw));
    };
    load();
  }, []);

  const handleSave = async () => {
    await setShared('agesmart_app_control', config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const update = <K extends keyof AppControlConfig>(key: K, value: AppControlConfig[K]) => {
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
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>App Control</h1>
          <p style={{ color: '#64748b', fontSize: 15 }}>Control buttons, texts, and features in the user app</p>
        </div>
        <button onClick={handleSave} style={{
          padding: '12px 24px', background: saved ? 'rgba(34,197,94,0.2)' : 'linear-gradient(135deg, #ef4444, #dc2626)',
          border: saved ? '1px solid #22c55e40' : 'none', borderRadius: 10,
          color: saved ? '#22c55e' : '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Save size={16} /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Button Texts */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <MousePointer size={18} color="#ef4444" /> Button Texts
          </h3>
          {[
            { label: 'Sign Up Button', key: 'signupButtonText' as const },
            { label: 'Login Button', key: 'loginButtonText' as const },
            { label: 'Verification Button', key: 'verificationButtonText' as const },
            { label: 'Subscription Button', key: 'subscriptionButtonText' as const },
            { label: 'Browse Button', key: 'browseButtonText' as const },
          ].map(({ label, key }) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>{label}</label>
              <input style={inputStyle} value={config[key]} onChange={(e) => update(key, e.target.value)} />
            </div>
          ))}
        </div>

        {/* App Texts */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Type size={18} color="#3b82f6" /> App Texts
          </h3>
          {[
            { label: 'App Name', key: 'appName' as const },
            { label: 'Welcome Message', key: 'welcomeMessage' as const },
            { label: 'Dashboard Subtitle', key: 'dashboardTitle' as const },
            { label: 'Footer Text', key: 'footerText' as const },
          ].map(({ label, key }) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>{label}</label>
              <input style={inputStyle} value={config[key]} onChange={(e) => update(key, e.target.value)} />
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Maintenance Message</label>
            <textarea
              style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }}
              value={config.maintenanceMessage}
              onChange={(e) => update('maintenanceMessage', e.target.value)}
            />
          </div>
        </div>

        {/* Feature Toggles */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24, gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>Feature Toggles</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {[
              { label: 'Show Verification Page', key: 'showVerification' as const },
              { label: 'Show Subscription Page', key: 'showSubscription' as const },
              { label: 'Show Browse Page', key: 'showBrowse' as const },
              { label: 'Show Settings Page', key: 'showSettings' as const },
              { label: 'Allow New Signups', key: 'allowSignups' as const },
              { label: 'Maintenance Mode', key: 'maintenanceMode' as const },
            ].map(({ label, key }) => (
              <div key={key} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', background: '#0f172a', borderRadius: 10, border: '1px solid #334155',
              }}>
                <span style={{ fontSize: 13, color: '#cbd5e1' }}>{label}</span>
                <Toggle value={config[key]} onChange={(v) => update(key, v)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
