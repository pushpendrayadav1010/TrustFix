import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { LoadingSpinner } from '../../components/common/FeedbackStates';
import { User, Mail, Phone, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const CustomerProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const updated = await userService.updateUserProfile(user.id, formData);
      updateUser(updated);
      setMessage('Profile settings saved successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <DashboardHeader title="Profile Settings" subtitle="Loading..." />
        <div className="dashboard-content">
          <LoadingSpinner message="Fetching profile..." />
        </div>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader
        title="Profile Settings"
        subtitle="Manage your personal information and contact details."
      />

      <div className="dashboard-content">
        <div className="card" style={{ maxWidth: '680px', padding: '2rem', backgroundColor: 'var(--white)' }}>
          
          {message && (
            <div className="alert alert-success mb-4">
              <CheckCircle2 size={18} />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="alert alert-danger mb-4">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-4 pb-6 mb-6 border-bottom" style={{ borderBottom: '1px solid var(--neutral-200)' }}>
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={user?.name || 'User'}
              style={{ width: '72px', height: '72px', borderRadius: 'var(--radius-lg)', objectFit: 'cover', border: '2px solid var(--neutral-200)' }}
            />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--neutral-900)' }}>
                {user?.name}
              </h3>
              <span className="badge badge-confirmed mt-1" style={{ fontSize: '11px' }}>
                Customer Account
              </span>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div className="mb-6">
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--neutral-900)' }}>
                Personal Information
              </h4>
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-6">
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--neutral-900)' }}>
                Contact Details
              </h4>
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex justify-end pt-4 border-top" style={{ borderTop: '1px solid var(--neutral-200)' }}>
              <Button type="submit" variant="primary" loading={saving} style={{ padding: '0.625rem 1.5rem', fontWeight: 700 }}>
                Save Profile Changes
              </Button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
