import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../api';
import { Bus, AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return;

    setLoading(true);
    setError('');
    try {
      await adminLogin(form);
      navigate('/');
      window.location.reload();
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card animate-fade-in-up">
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{
            width: 48, height: 48, background: 'var(--text-primary)', 
            borderRadius: 12, display: 'flex', alignItems: 'center', 
            justifyContent: 'center', color: '#fff'
          }}>
            <Bus size={24} />
          </div>
        </div>

        <h1 className="login-title">Administrator Login</h1>
        <p className="login-subtitle">Sign in to manage the DY Patil transport fleet</p>

        {error && (
          <div style={{ 
            background: 'var(--error-bg)', color: 'var(--error)', 
            padding: '12px 16px', borderRadius: 8, fontSize: 13, 
            marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8,
            border: '1px solid rgba(238,0,0,0.2)' 
          }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@dypatil.edu"
              className="form-input"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              Password
              <span style={{ color: 'var(--text-tertiary)', fontWeight: 400, cursor: 'pointer' }}>Forgot?</span>
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: 'var(--text-tertiary)' }}>
          Don't have an account? <a href="/signup" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Request Access</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
