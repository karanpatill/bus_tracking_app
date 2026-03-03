import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminSignup } from '../api';
import { Shield, AlertCircle, CheckCircle } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || form.password !== form.confirmPassword || form.password.length < 6) {
      setError('Please check your inputs and ensure passwords match.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await adminSignup({ email: form.email, password: form.password });
      setSuccess('Admin account provisioned successfully.');
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      setError('Failed to provision account. Check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card animate-fade-in-up" style={{ maxWidth: 440 }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{
            width: 48, height: 48, background: 'var(--text-primary)', 
            borderRadius: 12, display: 'flex', alignItems: 'center', 
            justifyContent: 'center', color: '#fff'
          }}>
            <Shield size={24} />
          </div>
        </div>

        <h1 className="login-title">Administrator Enrollment</h1>
        <p className="login-subtitle">Provision a new high-privilege fleet manager account</p>

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

        {success && (
          <div style={{ 
            background: 'var(--success-bg)', color: 'var(--success)', 
            padding: '12px 16px', borderRadius: 8, fontSize: 13, 
            marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8,
            border: '1px solid rgba(12,206,107,0.2)' 
          }}>
            <CheckCircle size={16} /> {success}
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

          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">New Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 chars"
                className="form-input"
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Matches above"
                className="form-input"
                required
              />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading} style={{ marginTop: 24 }}>
            {loading ? 'Provisioning Account...' : 'Provision Administrator Account'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: 'var(--text-tertiary)' }}>
          System already provisioned? <a href="/login" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Sign In</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
