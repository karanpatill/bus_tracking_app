import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../api';
import {
  Eye, EyeOff, Mail, Lock, Shield,
  MapPin, Users, Bell, BarChart3, Bus,
  AlertCircle,
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm]             = useState({ email: '', password: '' });
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched]       = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };
  const handleBlur = (e) =>
    setTouched({ ...touched, [e.target.name]: true });

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPwValid    = (v) => v.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!isValidEmail(form.email) || !isPwValid(form.password)) return;

    setLoading(true);
    setError('');
    try {
      await adminLogin(form);
      navigate('/');
      window.location.reload();
    } catch {
      setError('Invalid email or password. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: MapPin,    text: 'Real-time GPS fleet tracking for all buses' },
    { icon: Users,     text: 'Student boarding & alighting via RFID' },
    { icon: Bell,      text: 'Instant incident and delay alerts' },
    { icon: BarChart3, text: 'Fleet analytics and performance reports' },
  ];

  return (
    <div className="login-page">

      {/* ── Left hero ── */}
      <div className="login-hero">
        <div className="login-hero-content">

          {/* Logo */}
          <div className="login-hero-logo">
            <Bus />
          </div>

          <h1 className="login-hero-title">
            D.Y. Patil Education Society
          </h1>
          <p className="login-hero-subtitle">
            Intelligent Bus Management System
          </p>

          {/* Features */}
          {features.map(({ icon: Icon, text }) => (
            <div className="login-feature" key={text}>
              <div className="login-feature-icon">
                <Icon />
              </div>
              <span className="login-feature-text">{text}</span>
            </div>
          ))}

          {/* Institution note */}
          <div
            style={{
              marginTop: 32,
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8,
              textAlign: 'left',
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
              Institution
            </p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
              D.Y. Patil Education Society, Kolhapur — One of Maharashtra's premier higher education institutions serving 10,000+ students.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right form ── */}
      <div className="login-right">
        <div className="login-card animate-fade-in">

          {/* Header */}
          <div className="login-card-header">
            <div className="login-card-badge">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green-600)', display: 'inline-block' }} />
              System Online
            </div>
            <h2 className="login-title">Administrator Sign In</h2>
            <p className="login-subtitle">Enter your credentials to access the dashboard</p>
          </div>

          {/* Error */}
          {error && (
            <div className="notification error" style={{ marginBottom: 16 }}>
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">

            {/* Email */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <div className="form-input-icon-wrapper">
                <Mail size={14} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="admin@dypatil.edu"
                  className={`form-input ${touched.email ? (isValidEmail(form.email) ? 'success' : 'error') : ''}`}
                  required
                  autoComplete="email"
                />
              </div>
              {touched.email && !isValidEmail(form.email) && (
                <p style={{ fontSize: 12, color: 'var(--red-600)', marginTop: 4 }}>
                  Please enter a valid email address.
                </p>
              )}
            </div>

            {/* Password */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your password"
                  className={`form-input ${touched.password ? (isPwValid(form.password) ? 'success' : 'error') : ''}`}
                  style={{ paddingRight: 44 }}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 11, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', display: 'flex', padding: 2,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {touched.password && !isPwValid(form.password) && (
                <p style={{ fontSize: 12, color: 'var(--red-600)', marginTop: 4 }}>
                  Password must be at least 6 characters.
                </p>
              )}
            </div>

            {/* Options row */}
            <div className="flex justify-between items-center" style={{ fontSize: 13 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: 'var(--text-muted)' }}>
                <input type="checkbox" style={{ accentColor: 'var(--brand-primary)', width: 14, height: 14 }} />
                Remember me
              </label>
              <span style={{ color: 'var(--brand-primary)', cursor: 'pointer', fontWeight: 500 }}>
                Forgot password?
              </span>
            </div>

            {/* Submit */}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-8 justify-center">
                  <span style={{
                    width: 15, height: 15,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                  Signing in...
                </span>
              ) : 'Sign in to Dashboard'}
            </button>

            {/* Link to signup */}
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
              New administrator?{' '}
              <a href="/signup" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
                Create account
              </a>
            </p>
          </form>

          <div className="login-footer-text">
            &copy; {new Date().getFullYear()} D.Y. Patil Education Society &nbsp;&middot;&nbsp; Kolhapur, Maharashtra
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
