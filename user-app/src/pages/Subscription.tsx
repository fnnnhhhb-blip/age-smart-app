import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Check, Shield, Zap, Clock, CreditCard, ArrowRight } from 'lucide-react';
import { getShared, setShared } from '../utils/sharedData';

interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const plans = [
  {
    id: 'standard',
    name: 'Standard',
    price: 299,
    icon: Shield,
    color: '#3b82f6',
    features: ['ID age verification', '25 verifications', 'Email support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 399,
    icon: Zap,
    color: '#a855f7',
    popular: true,
    features: ['ID age verification', '50 verifications', 'Video verify support', 'Priority support'],
  },
];

export default function Subscription() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [pendingRequest, setPendingRequest] = useState<PaymentRequest | null>(null);

  useEffect(() => {
    const load = async () => {
      const raw = await getShared('agesmart_payment_requests');
      const requests: PaymentRequest[] = raw ? JSON.parse(raw) : [];
      const myPending = requests.find(
        (r) => r.userId === user?.id && r.status === 'pending'
      );
      if (myPending) {
        setPendingRequest(myPending);
      }
    };
    load();
  }, [user?.id]);

  const handleSelectPlan = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    setStep(2);
  };

  const handlePay = async () => {
    if (!user || !selectedPlan) return;

    const raw = await getShared('agesmart_payment_requests');
    const requests: PaymentRequest[] = raw ? JSON.parse(raw) : [];
    const filtered = requests.filter((r) => !(r.userId === user.id && r.status === 'pending'));

    const newRequest: PaymentRequest = {
      id: crypto.randomUUID(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      plan: selectedPlan.id,
      amount: selectedPlan.price,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    filtered.push(newRequest);
    await setShared('agesmart_payment_requests', filtered);
    setPendingRequest(newRequest);
    setStep(3);
  };

  // Step indicators
  const steps = [
    { num: 1, label: 'Select Plan' },
    { num: 2, label: 'Pay' },
    { num: 3, label: 'Done' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>Payment</h1>
      <p style={{ color: '#64748b', fontSize: 15, marginBottom: 32 }}>Purchase verification credits</p>

      {/* Pending request banner */}
      {pendingRequest && step !== 3 && (
        <div style={{
          padding: '14px 20px', background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)',
          borderRadius: 12, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <Clock size={20} color="#eab308" />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#eab308' }}>Payment Request Pending</div>
            <div style={{ fontSize: 13, color: '#94a3b8' }}>
              Your request for the <strong style={{ color: '#e2e8f0', textTransform: 'capitalize' }}>{pendingRequest.plan}</strong> plan
              (${pendingRequest.amount}) is awaiting admin approval.
            </div>
          </div>
        </div>
      )}

      {/* Step Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 40 }}>
        {steps.map(({ num, label }, i) => (
          <div key={num} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700,
                background: step >= num ? (step > num ? '#22c55e' : '#3b82f6') : '#334155',
                color: step >= num ? '#fff' : '#64748b',
              }}>
                {step > num ? <Check size={18} /> : num}
              </div>
              <span style={{ fontSize: 12, color: step >= num ? '#e2e8f0' : '#64748b', fontWeight: step === num ? 600 : 400 }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: 80, height: 2, margin: '0 12px', marginBottom: 20,
                background: step > num ? '#22c55e' : '#334155',
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select Plan */}
      {step === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, maxWidth: 700, margin: '0 auto' }}>
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                style={{
                  background: '#1e293b', border: `2px solid ${plan.popular ? plan.color + '60' : '#334155'}`,
                  borderRadius: 16, padding: 28, position: 'relative', cursor: 'pointer', transition: 'all 0.2s',
                }}
                onClick={() => handleSelectPlan(plan)}
              >
                {plan.popular && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    padding: '4px 16px', borderRadius: 9999, fontSize: 11, fontWeight: 700,
                    background: plan.color, color: '#fff',
                  }}>
                    Popular
                  </div>
                )}
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <Icon size={32} color={plan.color} style={{ marginBottom: 12 }} />
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>{plan.name}</div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
                      <Check size={14} color={plan.color} />
                      <span style={{ fontSize: 13, color: '#cbd5e1' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, color: plan.color, textAlign: 'center', marginBottom: 16 }}>
                  ${plan.price}
                </div>
                <button style={{
                  width: '100%', padding: '12px', background: `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`,
                  border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  Select Plan <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Step 2: Pay */}
      {step === 2 && selectedPlan && (
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{
            background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 28,
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <CreditCard size={20} color="#3b82f6" /> Payment Details
            </h3>

            <div style={{
              padding: 16, background: '#0f172a', borderRadius: 10, border: '1px solid #334155', marginBottom: 20,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#94a3b8', fontSize: 13 }}>Plan</span>
                <span style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{selectedPlan.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#94a3b8', fontSize: 13 }}>Verifications</span>
                <span style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{selectedPlan.id === 'standard' ? '25' : '50'}</span>
              </div>
              <div style={{ borderTop: '1px solid #334155', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#f1f5f9', fontSize: 15, fontWeight: 700 }}>Total</span>
                <span style={{ color: '#3b82f6', fontSize: 20, fontWeight: 800 }}>${selectedPlan.price}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setStep(1)} style={{
                flex: 1, padding: '12px', background: 'transparent', border: '1px solid #334155',
                borderRadius: 10, color: '#94a3b8', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>
                Back
              </button>
              <button onClick={handlePay} style={{
                flex: 2, padding: '12px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                Submit Payment Request <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Done */}
      {step === 3 && (
        <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 40,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', background: 'rgba(34,197,94,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
            }}>
              <Check size={32} color="#22c55e" />
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>Payment Request Submitted!</h3>
            <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              Your payment request for the <strong style={{ color: '#e2e8f0', textTransform: 'capitalize' }}>{selectedPlan?.name}</strong> plan
              (${selectedPlan?.price}) has been submitted. The admin will review and approve your request.
            </p>
            <div style={{
              padding: '12px 16px', background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)',
              borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <Clock size={16} color="#eab308" />
              <span style={{ fontSize: 13, color: '#eab308', fontWeight: 600 }}>Awaiting Admin Approval</span>
            </div>
            <button onClick={() => setStep(1)} style={{
              marginTop: 20, padding: '10px 24px', background: 'transparent', border: '1px solid #334155',
              borderRadius: 10, color: '#94a3b8', fontSize: 13, cursor: 'pointer',
            }}>
              Back to Plans
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
