import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';

const FloatingOrb = ({ className, size, color, delay, duration }) => (
  <div
    className={`position-absolute rounded-pill ${className}`}
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle at 30% 30%, ${color}, transparent)`,
      opacity: 0.1,
      animation: `floatOrb ${duration}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      pointerEvents: 'none',
    }}
  />
);

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await register(name, email, password);
    setLoading(false);
    if (!res.success) {
      setError(res.message || 'Registration failed. Please try again.');
    }
  };



  return (
    <div className="min-vh-100 d-flex position-relative overflow-hidden" style={{ backgroundColor: '#0f172a' }}>
      {/* Animated background orbs */}
      <FloatingOrb className="top-0 end-0" size="320px" color="rgba(99,102,241,0.4)" delay={0} duration={9} />
      <FloatingOrb className="bottom-0 start-0" size="260px" color="rgba(139,92,246,0.35)" delay={-4} duration={11} />
      <FloatingOrb className="position-absolute" style={{ top: '60%', left: '30%' }} size="180px" color="rgba(168,85,247,0.25)" delay={-2} duration={8} />

      {/* Grid pattern */}
      <div
        className="position-absolute"
        style={{
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />

      {/* Left brand side */}
      <div className="d-none d-lg-flex flex-column justify-content-center px-5 position-relative" style={{ flex: '1 1 50%' }}>
        <div className="ms-auto" style={{ maxWidth: 440 }}>
          <div
            className="d-inline-flex align-items-center gap-2 rounded-pill px-3 py-1 mb-4"
            style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)', color: '#a78bfa', fontSize: '0.85rem' }}
          >
            <Sparkles size={14} />
            <span>Join 2,000+ Students</span>
          </div>

          <h1 className="fw-bold mb-3" style={{ color: '#fff', fontSize: 'clamp(2rem, 3.5vw, 3rem)', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            Start your{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a78bfa, #818cf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              journey
            </span>{' '}
            today
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 400 }}>
            Create your free account and unlock a complete suite of study tools designed to help you succeed.
          </p>

          <div className="d-flex flex-column gap-3 mt-4">
            {[
              { text: 'Free core features — no credit card needed' },
              { text: 'Sync across all your devices' },
              { text: 'Cancel anytime, no questions asked' },
            ].map((item, i) => (
              <div key={i} className="d-flex align-items-center gap-3" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem' }}>
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: 20, height: 20, background: 'rgba(34,197,94,0.15)', color: '#22c55e', flexShrink: 0, fontSize: '0.7rem' }}
                >
                  ✓
                </div>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side — Register form */}
      <div className="d-flex align-items-center justify-content-center p-4 position-relative" style={{ flex: '1 1 50%' }}>
        <div
          className="animate-scaleIn"
          style={{
            width: '100%',
            maxWidth: 420,
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            padding: '2.5rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
              style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', boxShadow: '0 4px 20px rgba(139,92,246,0.3)' }}
            >
              <BookOpen size={28} color="white" />
            </div>
            <h3 className="fw-bold mb-1" style={{ color: '#fff' }}>Create Account</h3>
            <p className="mb-0" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>
              Start your free trial — no credit card needed
            </p>
          </div>

          {error && (
            <div
              className="d-flex align-items-center gap-2 p-3 mb-3 rounded-3"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.15)', color: '#fca5a5', fontSize: '0.85rem' }}
            >
              <Mail size={16} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-medium mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Full Name</label>
              <div className="position-relative">
                <User
                  size={16}
                  className="position-absolute top-50 start-0 translate-middle-y ms-3"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                />
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  placeholder="John Doe"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    padding: '12px 12px 12px 44px',
                    color: '#fff',
                    fontSize: '0.95rem',
                  }}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-medium mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Email</label>
              <div className="position-relative">
                <Mail
                  size={16}
                  className="position-absolute top-50 start-0 translate-middle-y ms-3"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                />
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@university.edu"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    padding: '12px 12px 12px 44px',
                    color: '#fff',
                    fontSize: '0.95rem',
                  }}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-medium mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Password</label>
              <div className="position-relative">
                <Lock
                  size={16}
                  className="position-absolute top-50 start-0 translate-middle-y ms-3"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    padding: '12px 44px 12px 44px',
                    color: '#fff',
                    fontSize: '0.95rem',
                  }}
                />
                <button
                  type="button"
                  className="btn p-0 position-absolute top-50 end-0 translate-middle-y me-3"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn w-100 d-flex align-items-center justify-content-center gap-2 fw-bold py-2"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                border: 'none',
                borderRadius: 12,
                color: '#fff',
                padding: '12px',
                fontSize: '1rem',
                boxShadow: '0 4px 20px rgba(139,92,246,0.3)',
              }}
            >
              {loading ? (
                <>
                  <div className="spinner-border spinner-border-sm" role="status" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none"
              onClick={() => navigate('/login')}
              style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}
            >
              Already have an account?{' '}
              <span style={{ color: '#a78bfa', fontWeight: 600 }}>Sign in</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
