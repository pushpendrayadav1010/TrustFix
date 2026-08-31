import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { LoadingSpinner, EmptyState } from '../../components/common/FeedbackStates';
import { MapPin, Plus, Trash2, Edit2, CheckCircle2, Home, Building, AlertCircle } from 'lucide-react';

export const CustomerAddressesPage = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [form, setForm] = useState({
    flat: '',
    street: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400053',
    label: 'Home',
    isDefault: false,
  });
  const [saving, setSaving] = useState(false);

  const fetchAddresses = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await userService.getAddresses(user.id);
      setAddresses(data);
    } catch (err) {
      console.error('Failed to load addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user?.id]);

  const handleOpenAddModal = () => {
    setEditingAddressId(null);
    setForm({
      flat: '',
      street: '',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400053',
      label: 'Home',
      isDefault: addresses.length === 0,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (addr) => {
    setEditingAddressId(addr.id);
    setForm({
      flat: addr.flat || addr.addressLine1 || '',
      street: addr.street || '',
      city: addr.city || 'Mumbai',
      state: addr.state || 'Maharashtra',
      pincode: addr.pincode || addr.postalCode || '400053',
      label: addr.label || 'Home',
      isDefault: addr.isDefault || false,
    });
    setModalOpen(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!form.flat.trim()) return;
    setSaving(true);
    try {
      if (editingAddressId) {
        await userService.updateAddress(editingAddressId, form);
      } else {
        await userService.addAddress(user.id, form);
      }
      setModalOpen(false);
      await fetchAddresses();
    } catch (err) {
      alert(err.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await userService.deleteAddress(id);
      await fetchAddresses();
    } catch (err) {
      alert(err.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await userService.setDefaultAddress(id);
      await fetchAddresses();
    } catch (err) {
      alert(err.message || 'Failed to set default address');
    }
  };

  return (
    <div>
      <DashboardHeader
        title="Saved Addresses"
        subtitle="Manage your home, office, and doorstep service delivery locations."
        actions={
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={handleOpenAddModal}
          >
            <Plus size={14} />
            <span>Add New Address</span>
          </button>
        }
      />

      <div className="dashboard-content">
        
        {loading ? (
          <LoadingSpinner message="Loading saved addresses..." />
        ) : addresses.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="No saved addresses found"
            description="Add your delivery address so verified technicians can reach your doorstep promptly."
            action={
              <Button variant="primary" onClick={handleOpenAddModal}>
                <Plus size={14} />
                <span>Add First Address</span>
              </Button>
            }
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="card card-hoverable"
                style={{
                  padding: '1.5rem',
                  backgroundColor: 'var(--white)',
                  border: addr.isDefault ? '2px solid var(--primary-600)' : '1px solid var(--neutral-200)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--primary-100)',
                          color: 'var(--primary-800)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <MapPin size={16} />
                      </div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                        {addr.label || 'Home'}
                      </h4>
                    </div>

                    {addr.isDefault && (
                      <span className="badge badge-verified" style={{ fontSize: '10px' }}>
                        Default Address
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted mb-1 font-semibold" style={{ color: 'var(--neutral-800)' }}>
                    {addr.flat}
                  </p>
                  {addr.street && (
                    <p className="text-xs text-muted mb-1">
                      {addr.street}
                    </p>
                  )}
                  <p className="text-xs text-muted mb-4">
                    {addr.city}, {addr.state || 'Maharashtra'} - {addr.pincode}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-top" style={{ borderTop: '1px solid var(--neutral-200)' }}>
                  {!addr.isDefault ? (
                    <button
                      type="button"
                      className="btn-link text-xs font-semibold"
                      style={{ background: 'none', border: 'none', color: 'var(--primary-700)', cursor: 'pointer' }}
                      onClick={() => handleSetDefault(addr.id)}
                    >
                      Set as Default
                    </button>
                  ) : (
                    <span className="text-2xs text-muted font-bold">Primary Delivery</span>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      style={{ padding: '4px 8px' }}
                      onClick={() => handleOpenEditModal(addr)}
                      title="Edit Address"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      style={{ padding: '4px 8px' }}
                      onClick={() => handleDeleteAddress(addr.id)}
                      title="Delete Address"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Address Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingAddressId ? 'Edit Saved Address' : 'Add New Saved Address'}
          footer={
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" loading={saving} onClick={handleSaveAddress}>
                {editingAddressId ? 'Update Address' : 'Save Address'}
              </Button>
            </>
          }
        >
          <form onSubmit={handleSaveAddress}>
            <div className="form-group mb-3">
              <label className="form-label">Address Label</label>
              <div className="flex gap-2">
                {['Home', 'Office', 'Other'].map((lbl) => (
                  <button
                    key={lbl}
                    type="button"
                    className={`btn btn-sm ${form.label === lbl ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setForm({ ...form, label: lbl })}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Flat / Unit / Building"
              placeholder="e.g. Flat 301, Tower B, Lotus Park"
              value={form.flat}
              onChange={(e) => setForm({ ...form, flat: e.target.value })}
              required
            />

            <Input
              label="Street / Landmark / Area"
              placeholder="e.g. Near HDFC Bank, Linking Road"
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
              />
              <Input
                label="Postal Code (PIN)"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                required
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-muted cursor-pointer font-medium mt-2">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
              />
              <span>Set as default service address</span>
            </label>
          </form>
        </Modal>

      </div>
    </div>
  );
};
