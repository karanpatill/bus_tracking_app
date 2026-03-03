import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminSignup } from '../api';
import { Eye, EyeOff, Mail, Lock, Shield, CheckCircle, AlertCircle, Bus, Users, BarChart3, MapPin } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm]           = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [showPw, setShowPw]       = useState(false);
  const [touched, setTouched]     = useState({});

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };
  const handleBlur   = (e) => setTouched({ ...touched, [e.target.name]: true });

  const isValidEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPwValid    = v => v.length >= 6;
  const pwMatch      = ()=> form.password === form.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true, confirmPassword: true });
    if (!isValidEmail(form.email) || !isPwValid(form.password) || !pwMatch()) return;
    setLoading(true); setError('');
    try {
      await adminSignup({ email: form.email, password: form.password });
      setSuccess('Account created successfully. Redirecting to login…');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Shield,   text: 'Role-based access control' },
    { icon: MapPin,   text: 'Full fleet management privileges' },
    { icon: BarChart3,text: 'Access to all analytics & reports' },
    { icon: Users,    text: 'Student and driver management' },
  ];

  return (
    <div className="login-page">

      {/* Left panel */}
      <div className="login-hero">
        <div className="login-hero-content">
          <div className="login-hero-logo"><Bus /></div>
          <h1 className="login-hero-title">D.Y. Patil Education Society</h1>
          <p className="login-hero-subtitle">Administrator Registration Portal</p>

          {features.map(({ icon: Icon, text }) => (
            <div className="login-feature" key={text}>
              <div className="login-feature-icon"><Icon /></div>
              <span className="login-feature-text">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="login-right">
        <div className="login-card animate-fade-in">
          <div className="login-card-header">
            <div className="login-card-badge">
              <Shield size={10} /> Admin Registration
            </div>
            <h2 className="login-title">Create Account</h2>
            <p className="login-subtitle">Register as a system administrator</p>
          </div>

          {error && (
            <div className="notification error" style={{ marginBottom: 16 }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}
          {success && (
            <div className="notification success" style={{ marginBottom: 16 }}>
              <CheckCircle size={14} /> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <div className="form-input-icon-wrapper">
                <Mail size={14} />
                <input
                  type="email" name="email" value={form.email}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder="admin@dypatil.edu"
                  className={`form-input ${touched.email ? (isValidEmail(form.email) ? 'success' : 'error') : ''}`}
                  required
                />
              </div>
              {touched.email && !isValidEmail(form.email) && (
                <p style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>Please enter a valid email.</p>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <div className="form-input-icon-wrapper">
                  <Lock size={14} />
                  <input
                    type={showPw ? 'text' : 'password'} name="password" value={form.password}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="At least 6 characters"
                    className={`form-input ${touched.password ? (isPwValid(form.password) ? 'success' : 'error') : ''}`}
                    style={{ paddingRight: 42 }}
                    required
                  />
                </div>
                <button
                  type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', display: 'flex' }}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {touched.password && !isPwValid(form.password) && (
                <p style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>Minimum 6 characters required.</p>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Confirm Password</label>
              <div className="form-input-icon-wrapper">
                <Lock size={14} />
                <input
                  type="password" name="confirmPassword" value={form.confirmPassword}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder="Re-enter your password"
                  className={`form-input ${touched.confirmPassword ? (pwMatch() ? 'success' : 'error') : ''}`}
                  required
                />
              </div>
              {touched.confirmPassword && !pwMatch() && (
                <p style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>Passwords do not match.</p>
              )}
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Administrator Account'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--t3)' }}>
              Already have an account?{' '}
              <a href="/login" style={{ color: 'var(--brand)', fontWeight: 600 }}>Sign in</a>
            </p>
          </form>

          <div className="login-footer-text">
            &copy; {new Date().getFullYear()} D.Y. Patil Education Society &nbsp;&middot;&nbsp; Kolhapur
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
