import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = await signup(name, email, password);
    if (ok) {
      navigate('/');
    } else {
      setError('Email already in use');
    }
  };

  const inputWrap: React.CSSProperties = { position: 'relative', marginBottom: 16 };
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 14px 14px 44px', background: '#0f172a',
    border: '1px solid #334155', borderRadius: 10, color: '#e2e8f0', fontSize: 14, outline: 'none',
  };
  const iconStyle: React.CSSProperties = { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' };

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
          <img src="/logo.png" alt="AgeSmart" style={{ width: 64, height: 64, marginBottom: 16 }} />
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Create Account</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Join AgeSmart verification platform</p>
        </div>

        {error && (
          <div style={{ padding: '10px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#ef4444', fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={inputWrap}>
            <User size={18} style={iconStyle} />
            <input style={inputStyle} type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div style={inputWrap}>
            <Mail size={18} style={iconStyle} />
            <input style={inputStyle} type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div style={inputWrap}>
            <Lock size={18} style={iconStyle} />
            <input style={inputStyle} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" style={{
            width: '100%', padding: '14px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8,
          }}>
            Create Account <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: '#64748b', fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#3b82f6', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
