import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const CustomerProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || 'Aarav Sharma',
    email: user?.email || 'customer@trustfix.com',
    phone: user?.phone || '+91 98201 12345',
    city: user?.city || 'Mumbai',
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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
          {saved && (
            <div className="alert alert-success mb-4">
              <span>✓</span>
              <span>Profile updated successfully!</span>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6 pb-6" style={{ borderBottom: '1px solid var(--neutral-200)' }}>
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
              alt={user?.name}
              style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>{user?.name}</h4>
              <span className="text-xs text-muted font-semibold">Account Role: <strong>CUSTOMER</strong></span>
              <p className="text-xs text-muted" style={{ margin: 0 }}>Registered Customer on TrustFix</p>
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
              required
            />

            <Button type="submit" variant="primary" style={{ marginTop: '0.5rem' }}>
              Save Profile Changes
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
};
