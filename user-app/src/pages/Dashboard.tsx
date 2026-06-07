import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle, Clock, CreditCard, Globe, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const statusMap = {
    none: { icon: XCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Not Verified' },
    pending: { icon: Clock, color: '#eab308', bg: 'rgba(234,179,8,0.1)', label: 'Pending Review' },
    approved: { icon: CheckCircle, color: '#22c55e', bg: 'rgba(34,197,94,0.1)', label: 'Verified' },
    rejected: { icon: XCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Rejected' },
  };

  const status = statusMap[user?.verificationStatus || 'none'];
  const StatusIcon = status.icon;

  const cardStyle: React.CSSProperties = {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: 16,
    padding: 24,
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p style={{ color: '#64748b', fontSize: 15 }}>Here's an overview of your account</p>
      </div>

      {/* Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
        {/* Verification Status */}
        <div style={{ ...cardStyle, borderColor: status.color + '40' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ padding: 10, background: status.bg, borderRadius: 12 }}>
              <StatusIcon size={24} color={status.color} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>VERIFICATION</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: status.color }}>{status.label}</div>
            </div>
          </div>
          <button
            onClick={() => navigate('/verification')}
            style={{
              padding: '8px 16px', background: status.bg, border: `1px solid ${status.color}40`,
              borderRadius: 8, color: status.color, fontSize: 13, fontWeight: 500, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, width: '100%', justifyContent: 'center',
            }}
          >
            {user?.verificationStatus === 'none' ? 'Start Verification' : 'View Details'} <ArrowRight size={14} />
          </button>
        </div>

        {/* Subscription */}
        <div style={cardStyle} onClick={() => navigate('/subscription')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ padding: 10, background: 'rgba(168,85,247,0.1)', borderRadius: 12 }}>
              <CreditCard size={24} color="#a855f7" />
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>SUBSCRIPTION</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#a855f7', textTransform: 'capitalize' }}>{user?.subscription}</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            {user?.subscription === 'free' ? 'Upgrade for full access' : 'Manage your plan'}
          </div>
        </div>

        {/* Browse */}
        <div style={cardStyle} onClick={() => navigate('/browse')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ padding: 10, background: 'rgba(59,130,246,0.1)', borderRadius: 12 }}>
              <Globe size={24} color="#3b82f6" />
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>PROXY BROWSER</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#3b82f6' }}>Browse</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            Secure browsing with proxy support
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div style={{
        background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24,
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="" style={{ width: 22, height: 22 }} /> Account Details
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { label: 'Full Name', value: user?.name },
            { label: 'Email', value: user?.email },
            { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-' },
            { label: 'Account ID', value: user?.id?.slice(0, 8) + '...' },
          ].map(({ label, value }) => (
            <div key={label} style={{ padding: 16, background: '#0f172a', borderRadius: 10, border: '1px solid #1e293b' }}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
