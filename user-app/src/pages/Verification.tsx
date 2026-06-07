import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Calendar, Upload, CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';

export default function Verification() {
  const { user, updateUser } = useAuth();
  const [dob, setDob] = useState(user?.dateOfBirth || '');
  const [idFile, setIdFile] = useState<string>('');
  const [step, setStep] = useState(user?.verificationStatus === 'none' ? 1 : 0);

  const handleSubmit = () => {
    if (!dob) return;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

    if (age < 18) {
      updateUser({ verificationStatus: 'rejected', dateOfBirth: dob });
      return;
    }

    updateUser({
      verificationStatus: 'pending',
      dateOfBirth: dob,
    });
    setStep(0);
  };

  const statusMap = {
    none: { icon: AlertTriangle, color: '#eab308', bg: 'rgba(234,179,8,0.1)', title: 'Verification Required', desc: 'Complete age verification to access all features.' },
    pending: { icon: Clock, color: '#eab308', bg: 'rgba(234,179,8,0.1)', title: 'Verification Pending', desc: 'Your documents are being reviewed. This usually takes 24-48 hours.' },
    approved: { icon: CheckCircle, color: '#22c55e', bg: 'rgba(34,197,94,0.1)', title: 'Verification Approved', desc: 'Your age has been verified. You have full access to all features.' },
    rejected: { icon: XCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', title: 'Verification Rejected', desc: 'Your verification was not approved. You must be 18+ to use this service.' },
  };

  const verificationStatus = user?.verificationStatus || 'none';
  const info = statusMap[verificationStatus];
  const InfoIcon = info.icon;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px', background: '#0f172a', border: '1px solid #334155',
    borderRadius: 10, color: '#e2e8f0', fontSize: 14, outline: 'none',
  };

  if (step === 0 && verificationStatus !== 'none') {
    return (
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Age Verification</h1>
        <p style={{ color: '#64748b', fontSize: 15, marginBottom: 32 }}>Verify your identity to access all features</p>

        <div style={{
          background: '#1e293b', border: `1px solid ${info.color}40`, borderRadius: 16, padding: 32,
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 500, margin: '0 auto',
        }}>
          <div style={{ padding: 16, background: info.bg, borderRadius: 20, marginBottom: 20 }}>
            <InfoIcon size={48} color={info.color} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>{info.title}</h2>
          <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>{info.desc}</p>

          {user?.dateOfBirth && (
            <div style={{ padding: '12px 20px', background: '#0f172a', borderRadius: 10, border: '1px solid #334155' }}>
              <span style={{ color: '#64748b', fontSize: 13 }}>Date of Birth: </span>
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{new Date(user.dateOfBirth).toLocaleDateString()}</span>
            </div>
          )}

          {verificationStatus === 'rejected' && (
            <button
              onClick={() => { updateUser({ verificationStatus: 'none' }); setStep(1); }}
              style={{
                marginTop: 20, padding: '12px 24px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Age Verification</h1>
      <p style={{ color: '#64748b', fontSize: 15, marginBottom: 32 }}>Complete the steps below to verify your age</p>

      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {[1, 2].map((s) => (
            <div key={s} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: step >= s ? '#3b82f6' : '#334155',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        {step === 1 && (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <Calendar size={24} color="#3b82f6" />
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>Date of Birth</h2>
            </div>
            <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>Enter your date of birth. You must be 18 or older.</p>
            <input
              type="date"
              style={{ ...inputStyle, colorScheme: 'dark' }}
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
            <button
              onClick={() => dob && setStep(2)}
              disabled={!dob}
              style={{
                width: '100%', marginTop: 20, padding: '14px', background: dob ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#334155',
                border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 600, cursor: dob ? 'pointer' : 'not-allowed',
              }}
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <Upload size={24} color="#3b82f6" />
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>ID Document</h2>
            </div>
            <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>Upload a government-issued ID (passport, driver's license, or national ID).</p>

            <label style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: 32, border: '2px dashed #334155', borderRadius: 12, cursor: 'pointer',
              background: idFile ? 'rgba(34,197,94,0.05)' : '#0f172a',
              borderColor: idFile ? '#22c55e' : '#334155',
              transition: 'all 0.2s',
            }}>
              {idFile ? (
                <>
                  <CheckCircle size={32} color="#22c55e" />
                  <span style={{ color: '#22c55e', marginTop: 8, fontSize: 14, fontWeight: 600 }}>File selected</span>
                </>
              ) : (
                <>
                  <Upload size={32} color="#64748b" />
                  <span style={{ color: '#94a3b8', marginTop: 8, fontSize: 14 }}>Click to upload or drag & drop</span>
                  <span style={{ color: '#475569', fontSize: 12, marginTop: 4 }}>PNG, JPG, PDF (max 10MB)</span>
                </>
              )}
              <input type="file" style={{ display: 'none' }} accept="image/*,.pdf" onChange={(e) => setIdFile(e.target.files?.[0]?.name || '')} />
            </label>

            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: 1, padding: '14px', background: 'transparent', border: '1px solid #334155',
                  borderRadius: 10, color: '#94a3b8', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  flex: 2, padding: '14px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer',
                }}
              >
                Submit Verification
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
