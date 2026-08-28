import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/FeedbackStates';

export const CustomerProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
  });
  const [fetching, setFetching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    if (user?.id) {
      setFetching(true);
      userService.getUserProfile(user.id)
        .then((fetchedUser) => {
          if (isMounted && fetchedUser) {
            setFormData({
              name: fetchedUser.name || '',
              email: fetchedUser.email || '',
              phone: fetchedUser.phone || '',
              city: fetchedUser.city || '',
            });
            updateUser(fetchedUser);
          }
        })
        .catch((err) => {
          console.error('Failed to load user profile from server:', err);
          if (isMounted) {
            setError('Failed to load profile data from the server.');
          }
        })
        .finally(() => {
          if (isMounted) setFetching(false);
        });
    }
    return () => { isMounted = false; };
  }, [user?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    setSubmitting(true);
    setError('');
    setSaved(false);

    try {
      const updatedUser = await userService.updateUserProfile(user.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: user.role || 'CUSTOMER',
      });

      updateUser(updatedUser);
      setFormData(prev => ({
        ...prev,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
      }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile changes.');
    } finally {
      setSubmitting(false);
    }
  };

  if (fetching && !formData.name) {
    return (
      <div className="customer-profile-page" style={{ padding: '4rem 0' }}>
        <LoadingSpinner message="Loading user profile..." />
      </div>
    );
  }

  return (
    <div className="customer-profile-page" style={{ padding: '2rem 0 4rem 0' }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        
        {/* Header */}
        <div className="mb-6">
          <span className="section-subtitle">Account Settings</span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--neutral-900)', margin: 0 }}>
            Customer Profile
          </h1>
          <p className="text-xs text-muted">Update your contact information and communication preferences.</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          {error && (
            <div className="alert alert-danger mb-4">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {saved && (
            <div className="alert alert-success mb-4">
              <span>✓</span>
              <span>Profile updated successfully!</span>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6 pb-6" style={{ borderBottom: '1px solid var(--neutral-200)' }}>
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
              alt={user?.name || 'User'}
              style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>{user?.name || formData.name || 'User'}</h4>
              <span className="text-xs text-muted font-semibold">Account Role: <strong>{user?.role || 'CUSTOMER'}</strong></span>
              <p className="text-xs text-muted" style={{ margin: 0 }}>Registered User on TrustFix</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />

            <Input
              label="Email Address (Login ID)"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />

            <Input
              label="Phone Number (For Booking Updates)"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              required
            />

            <Input
              label="City"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            />

            <Button type="submit" variant="primary" loading={submitting} style={{ marginTop: '0.5rem' }}>
              Save Profile Changes
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
};

