import { useState } from 'react';
import { Globe, Shield, Search, ArrowRight, RefreshCw, Lock, Wifi } from 'lucide-react';

export default function ProxyBrowser() {
  const [url, setUrl] = useState('');
  const [proxyAddress, setProxyAddress] = useState(localStorage.getItem('agesmart_proxy') || '');
  const [proxyEnabled, setProxyEnabled] = useState(!!localStorage.getItem('agesmart_proxy'));
  const [browsing, setBrowsing] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const handleSetProxy = () => {
    if (proxyAddress.trim()) {
      localStorage.setItem('agesmart_proxy', proxyAddress);
      setProxyEnabled(true);
      if (window.electronAPI) {
        window.electronAPI.setProxy(proxyAddress);
      }
    }
  };

  const handleDisableProxy = () => {
    localStorage.removeItem('agesmart_proxy');
    setProxyEnabled(false);
    setProxyAddress('');
    if (window.electronAPI) {
      window.electronAPI.setProxy('');
    }
  };

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    setCurrentUrl(finalUrl);
    setBrowsing(true);
    setHistory((prev) => [finalUrl, ...prev.filter((h) => h !== finalUrl).slice(0, 9)]);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', background: '#0f172a', border: '1px solid #334155',
    borderRadius: 10, color: '#e2e8f0', fontSize: 14, outline: 'none',
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Link Browser</h1>
      <p style={{ color: '#64748b', fontSize: 15, marginBottom: 32 }}>Browse the web securely with proxy support</p>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
        {/* Proxy Settings Panel */}
        <div>
          <div style={{
            background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24, marginBottom: 20,
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={18} color="#3b82f6" /> Proxy Settings
            </h3>

            {/* Status */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
              background: proxyEnabled ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${proxyEnabled ? '#22c55e40' : '#ef444440'}`,
              borderRadius: 10, marginBottom: 16,
            }}>
              <Wifi size={16} color={proxyEnabled ? '#22c55e' : '#ef4444'} />
              <span style={{ fontSize: 13, color: proxyEnabled ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                {proxyEnabled ? 'Proxy Active' : 'No Proxy'}
              </span>
            </div>

            <label style={{ fontSize: 12, color: '#64748b', fontWeight: 500, marginBottom: 6, display: 'block' }}>
              Proxy Address
            </label>
            <input
              style={inputStyle}
              placeholder="e.g. http://proxy:8080"
              value={proxyAddress}
              onChange={(e) => setProxyAddress(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button
                onClick={handleSetProxy}
                disabled={!proxyAddress.trim()}
                style={{
                  flex: 1, padding: '10px',
                  background: proxyAddress.trim() ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#334155',
                  border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600,
                  cursor: proxyAddress.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Enable
              </button>
              {proxyEnabled && (
                <button
                  onClick={handleDisableProxy}
                  style={{
                    flex: 1, padding: '10px', background: 'transparent', border: '1px solid #ef444440',
                    borderRadius: 8, color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Disable
                </button>
              )}
            </div>

            <div style={{ marginTop: 16, padding: 12, background: '#0f172a', borderRadius: 8, border: '1px solid #1e293b' }}>
              <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>Supported formats:</div>
              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.8 }}>
                http://host:port<br />
                socks5://host:port<br />
                http://user:pass@host:port
              </div>
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div style={{
              background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24,
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 12 }}>Recent</h3>
              {history.map((h, i) => (
                <div
                  key={i}
                  onClick={() => { setUrl(h); setCurrentUrl(h); setBrowsing(true); }}
                  style={{
                    padding: '8px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12,
                    color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    background: 'transparent', transition: 'background 0.15s',
                    marginBottom: 2,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#0f172a')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {h}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Browser Area */}
        <div style={{
          background: '#1e293b', border: '1px solid #334155', borderRadius: 16, overflow: 'hidden',
          display: 'flex', flexDirection: 'column', minHeight: 500,
        }}>
          {/* URL Bar */}
          <form onSubmit={handleNavigate} style={{
            display: 'flex', gap: 8, padding: 12, borderBottom: '1px solid #334155', background: '#1e293b',
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                style={{ ...inputStyle, paddingLeft: 36 }}
                placeholder="Enter URL to browse..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <button type="submit" style={{
              padding: '0 16px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600,
            }}>
              Go <ArrowRight size={14} />
            </button>
            {browsing && (
              <button
                type="button"
                onClick={() => { const f = document.getElementById('browse-frame') as HTMLIFrameElement; if (f) f.src = f.src; }}
                style={{
                  padding: '0 12px', background: 'transparent', border: '1px solid #334155',
                  borderRadius: 10, color: '#94a3b8', cursor: 'pointer',
                }}
              >
                <RefreshCw size={14} />
              </button>
            )}
          </form>

          {/* Content */}
          {browsing ? (
            <div style={{ flex: 1, position: 'relative' }}>
              <div style={{
                padding: '8px 16px', background: '#0f172a', borderBottom: '1px solid #334155',
                display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748b',
              }}>
                <Lock size={12} color={proxyEnabled ? '#22c55e' : '#eab308'} />
                {proxyEnabled ? `Proxied via ${proxyAddress}` : 'Direct connection'} — {currentUrl}
              </div>
              <iframe
                id="browse-frame"
                src={currentUrl}
                style={{ width: '100%', height: 'calc(100% - 36px)', border: 'none', background: '#fff' }}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                title="Proxy Browser"
              />
            </div>
          ) : (
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              color: '#475569',
            }}>
              <Globe size={64} color="#334155" style={{ marginBottom: 16 }} />
              <div style={{ fontSize: 18, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>Start Browsing</div>
              <div style={{ fontSize: 14, color: '#475569' }}>Enter a URL above to browse with proxy support</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
