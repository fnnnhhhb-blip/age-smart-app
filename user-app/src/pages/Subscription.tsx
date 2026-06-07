import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Check, Star, Zap, Crown, Clock } from 'lucide-react';
import { getShared, setShared } from '../utils/sharedData';

interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/month',
    icon: Star,
    color: '#64748b',
    features: ['Basic age verification', 'Limited proxy browsing', '1 device', 'Community support'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$9.99',
    period: '/month',
    icon: Zap,
    color: '#a855f7',
    popular: true,
    features: ['Priority verification', 'Unlimited proxy browsing', '5 devices', 'Priority support', 'Custom proxy servers', 'No ads'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$29.99',
    period: '/month',
    icon: Crown,
    color: '#eab308',
    features: ['Instant verification', 'Unlimited everything', 'Unlimited devices', '24/7 dedicated support', 'Custom proxy servers', 'API access', 'Team management', 'SLA guarantee'],
  },
];

export default function Subscription() {
  const { user } = useAuth();
  const [pendingRequest, setPendingRequest] = useState<PaymentRequest | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const load = async () => {
      const raw = await getShared('agesmart_payment_requests');
      const requests: PaymentRequest[] = raw ? JSON.parse(raw) : [];
      const myPending = requests.find(
        (r) => r.userId === user?.id && r.status === 'pending'
      );
      setPendingRequest(myPending || null);
    };
    load();
  }, [user?.id]);

  const handleRequestPlan = async (planId: string) => {
    if (!user || planId === user.subscription) return;

    const raw = await getShared('agesmart_payment_requests');
    const requests: PaymentRequest[] = raw ? JSON.parse(raw) : [];

    // Remove any existing pending request from this user
    const filtered = requests.filter((r) => !(r.userId === user.id && r.status === 'pending'));

    const newRequest: PaymentRequest = {
      id: crypto.randomUUID(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      plan: planId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    filtered.push(newRequest);
    await setShared('agesmart_payment_requests', filtered);
    setPendingRequest(newRequest);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Subscription Plans</h1>
      <p style={{ color: '#64748b', fontSize: 15, marginBottom: 16 }}>Choose the plan that works best for you</p>

      {/* Pending request banner */}
      {pendingRequest && (
        <div style={{
          padding: '14px 20px', background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)',
          borderRadius: 12, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <Clock size={20} color="#eab308" />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#eab308' }}>Payment Request Pending</div>
            <div style={{ fontSize: 13, color: '#94a3b8' }}>
              Your request for the <strong style={{ color: '#e2e8f0', textTransform: 'capitalize' }}>{pendingRequest.plan}</strong> plan
              is awaiting admin approval.
            </div>
          </div>
        </div>
      )}

      {submitted && !pendingRequest && (
        <div style={{
          padding: '14px 20px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: 12, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <Check size={20} color="#22c55e" />
          <div style={{ fontSize: 14, fontWeight: 600, color: '#22c55e' }}>Payment request submitted!</div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'start' }}>
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isActive = user?.subscription === plan.id;
          const isPendingThis = pendingRequest?.plan === plan.id;
          return (
            <div
              key={plan.id}
              style={{
                background: '#1e293b',
                border: `2px solid ${isActive ? plan.color : isPendingThis ? '#eab308' + '60' : plan.popular ? plan.color + '60' : '#334155'}`,
                borderRadius: 16,
                padding: 28,
                position: 'relative',
                transition: 'all 0.2s',
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  padding: '4px 16px', background: `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`,
                  borderRadius: 9999, fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: 0.5,
                }}>
                  MOST POPULAR
                </div>
              )}

              <div style={{ textAlign: 'center', marginBottom: 24, marginTop: plan.popular ? 8 : 0 }}>
                <div style={{
                  display: 'inline-flex', padding: 12, background: `${plan.color}15`,
                  borderRadius: 16, marginBottom: 16,
                }}>
                  <Icon size={28} color={plan.color} />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{plan.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, color: plan.color }}>{plan.price}</span>
                  <span style={{ color: '#64748b', fontSize: 14 }}>{plan.period}</span>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
                    <Check size={16} color={plan.color} />
                    <span style={{ color: '#cbd5e1', fontSize: 14 }}>{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleRequestPlan(plan.id)}
                disabled={isActive || isPendingThis}
                style={{
                  width: '100%', padding: '12px',
                  background: isActive
                    ? `${plan.color}20`
                    : isPendingThis
                      ? 'rgba(234,179,8,0.15)'
                      : `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`,
                  border: isActive
                    ? `1px solid ${plan.color}40`
                    : isPendingThis
                      ? '1px solid rgba(234,179,8,0.4)'
                      : 'none',
                  borderRadius: 10,
                  color: isActive ? plan.color : isPendingThis ? '#eab308' : '#fff',
                  fontSize: 14, fontWeight: 600,
                  cursor: isActive || isPendingThis ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                {isActive ? 'Current Plan' : isPendingThis ? (
                  <><Clock size={14} /> Pending Approval</>
                ) : 'Request Plan'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
