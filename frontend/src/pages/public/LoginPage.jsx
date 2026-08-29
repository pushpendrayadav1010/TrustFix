import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { isValidEmail } from '../../utils/validators';
import { ShieldCheck, AlertCircle, X } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const { login } = useAuth();
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

  return (
    <div className="login-page" style={{ padding: '3.5rem 0 5rem 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '460px' }}>
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="brand-icon" style={{ width: '48px', height: '48px', margin: '0 auto 12px auto' }}>
            <ShieldCheck size={26} strokeWidth={2.2} />
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
              <AlertCircle size={18} />
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

          {/* Registration Link */}
          <div className="text-center mt-6 text-sm text-muted">
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: 700, color: 'var(--primary-800)' }}>
              Create Account
            </Link>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {forgotModalOpen && (
          <div className="modal-backdrop" onClick={() => setForgotModalOpen(false)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h4>Reset Password</h4>
                <button className="btn-close" onClick={() => setForgotModalOpen(false)}>
                  <X size={16} />
                </button>
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
