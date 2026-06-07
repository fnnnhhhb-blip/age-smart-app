import { useAuth } from '../context/AuthContext';
import { Check, Star, Zap, Crown } from 'lucide-react';

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
  const { user, updateUser } = useAuth();

  const handleSelect = (planId: string) => {
    updateUser({ subscription: planId as 'free' | 'premium' | 'enterprise' });
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Subscription Plans</h1>
      <p style={{ color: '#64748b', fontSize: 15, marginBottom: 32 }}>Choose the plan that works best for you</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'start' }}>
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isActive = user?.subscription === plan.id;
          return (
            <div
              key={plan.id}
              style={{
                background: '#1e293b',
                border: `2px solid ${isActive ? plan.color : plan.popular ? plan.color + '60' : '#334155'}`,
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
                onClick={() => handleSelect(plan.id)}
                disabled={isActive}
                style={{
                  width: '100%', padding: '12px',
                  background: isActive ? `${plan.color}20` : `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`,
                  border: isActive ? `1px solid ${plan.color}40` : 'none',
                  borderRadius: 10, color: isActive ? plan.color : '#fff',
                  fontSize: 14, fontWeight: 600, cursor: isActive ? 'default' : 'pointer',
                }}
              >
                {isActive ? 'Current Plan' : 'Select Plan'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
