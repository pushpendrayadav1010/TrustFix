import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { isValidEmail } from '../../utils/validators';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const { login, switchDemoPersona } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await login({ email, password });
      if (res.user.role === 'PROVIDER') {
        navigate(from || '/provider/dashboard');
      } else if (res.user.role === 'ADMIN') {
        navigate(from || '/admin/dashboard');
      } else {
        navigate(from || '/customer/dashboard');
      }
    } catch (err) {
      setAuthError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (persona, path) => {
    switchDemoPersona(persona);
    navigate(path);
  };

  return (
    <div className="login-page" style={{ padding: '3.5rem 0 5rem 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '460px' }}>
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="brand-icon" style={{ width: '44px', height: '44px', fontSize: '1.4rem', margin: '0 auto 12px auto' }}>
            🛡️
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--neutral-900)' }}>
            Welcome back to TrustFix
          </h2>
          <p className="text-sm text-muted">
            Log in to manage bookings, track requests, or hire verified professionals.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="card" style={{ padding: '2rem' }}>
          {authError && (
            <div className="alert alert-danger mb-4">
              <span>⚠️</span>
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="e.g. customer@trustfix.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
            />

            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-1 text-xs text-muted cursor-pointer">
                <input type="checkbox" defaultChecked />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="btn-link text-xs"
                style={{ background: 'none', border: 'none', color: 'var(--primary-700)', cursor: 'pointer', fontWeight: 600 }}
                onClick={() => setForgotModalOpen(true)}
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              block
              loading={loading}
              style={{ padding: '0.75rem' }}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--neutral-200)', paddingTop: '1.25rem' }}>
            <span className="text-xs text-muted block font-semibold mb-2 text-center">
              ⚡ Instant Demo Logins (One-Click Testing)
            </span>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="btn btn-sm btn-light justify-between"
                onClick={() => handleQuickDemoLogin('CUSTOMER', '/customer/dashboard')}
              >
                <span>👤 Customer (Aarav Sharma)</span>
                <span className="badge badge-confirmed">Instant Access</span>
              </button>

              <button
                type="button"
                className="btn btn-sm btn-light justify-between"
                onClick={() => handleQuickDemoLogin('PROVIDER_VERIFIED', '/provider/dashboard')}
              >
                <span>🛠️ Verified Provider (Rajesh Kumar)</span>
                <span className="badge badge-verified">✓ Verified</span>
              </button>

              <button
                type="button"
                className="btn btn-sm btn-light justify-between"
                onClick={() => handleQuickDemoLogin('PROVIDER_PENDING', '/provider/dashboard')}
              >
                <span>⏳ Pending Provider (Anand Verma)</span>
                <span className="badge badge-pending">Pending Review</span>
              </button>
            </div>
          </div>

          {/* Registration Link */}
          <div className="text-center mt-6 text-sm text-muted">
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: 700, color: 'var(--primary-800)' }}>
              Create Account
            </Link>
          </div>
        </div>

        {/* Forgot Password Placeholder Modal */}
        {forgotModalOpen && (
          <div className="modal-backdrop" onClick={() => setForgotModalOpen(false)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h4>Reset Password</h4>
                <button className="btn-close" onClick={() => setForgotModalOpen(false)}>✕</button>
              </div>
              <div className="modal-body">
                <p className="text-sm text-muted mb-4">
                  Enter your registered email address and we'll send you instructions to reset your password.
                </p>
                <Input label="Registered Email" type="email" placeholder="you@example.com" />
              </div>
              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setForgotModalOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={() => { alert('Password reset link sent to email (simulated)'); setForgotModalOpen(false); }}>
                  Send Reset Link
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
