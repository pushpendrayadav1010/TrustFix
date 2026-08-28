import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { categoryService } from '../../services/categoryService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { isValidEmail, isValidPhone } from '../../utils/validators';

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'PROVIDER' ? 'PROVIDER' : 'CUSTOMER';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: initialRole,
    service: 'Electrical',
    serviceArea: 'Thane',
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    categoryService.getCategories().then(setCategories);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await register(formData);
      if (res.user.role === 'PROVIDER') {
        navigate('/provider/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      setAuthError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page" style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container" style={{ maxWidth: '520px' }}>
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="brand-icon" style={{ width: '44px', height: '44px', fontSize: '1.4rem', margin: '0 auto 12px auto' }}>
            🛡️
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--neutral-900)' }}>
            Join TrustFix Today
          </h2>
          <p className="text-sm text-muted">
            Create an account to book verified services or offer your skilled trade.
          </p>
        </div>

        {/* Register Card */}
        <div className="card" style={{ padding: '2rem' }}>
          {authError && (
            <div className="alert alert-danger mb-4">
              <span>⚠️</span>
              <span>{authError}</span>
            </div>
          )}

          {/* Account Type Selector */}
          <div className="form-group mb-5">
            <label className="form-label">I want to register as:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                className={`btn ${formData.role === 'CUSTOMER' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFormData(prev => ({ ...prev, role: 'CUSTOMER' }))}
              >
                👤 Customer / Homeowner
              </button>

              <button
                type="button"
                className={`btn ${formData.role === 'PROVIDER' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFormData(prev => ({ ...prev, role: 'PROVIDER' }))}
              >
                🛠️ Service Provider
              </button>
            </div>
          </div>

          <form onSubmit={handleRegister}>
            <Input
              label="Full Name / Business Name"
              name="name"
              placeholder="e.g. Aarav Sharma or Precision Electricals"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="+91 98201 00000"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              required
            />

            {/* If Service Provider: Extra fields */}
            {formData.role === 'PROVIDER' && (
              <div
                style={{
                  backgroundColor: 'var(--primary-50)',
                  border: '1px solid var(--primary-100)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <div className="form-group mb-3">
                  <label className="form-label">Primary Trade Specialization</label>
                  <select
                    name="service"
                    className="form-control"
                    value={formData.service}
                    onChange={handleChange}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group mb-0">
                  <label className="form-label">Primary Service Area</label>
                  <input
                    type="text"
                    name="serviceArea"
                    className="form-control"
                    placeholder="e.g. Thane, Mulund, Ghatkopar"
                    value={formData.serviceArea}
                    onChange={handleChange}
                  />
                </div>
                <span className="text-xs text-muted block mt-2">
                  ℹ️ Your account will start in <strong>Pending Verification</strong> status until credentials review.
                </span>
              </div>
            )}

            <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              block
              loading={loading}
              style={{ marginTop: '0.75rem', padding: '0.75rem' }}
            >
              {formData.role === 'PROVIDER' ? 'Register As Service Provider' : 'Create Customer Account'}
            </Button>
          </form>

          <div className="text-center mt-6 text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 700, color: 'var(--primary-800)' }}>
              Sign In
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
