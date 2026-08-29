import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { LoadingSpinner } from '../../components/common/FeedbackStates';
import { MapPin, Plus, Edit2, Trash2 } from 'lucide-react';

export const CustomerAddressesPage = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Add / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    label: 'Home',
    flat: '',
    street: '',
    area: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '',
    landmark: '',
    isDefault: false,
    latitude: 19.1136,
    longitude: 72.8697,
  });

  const fetchAddresses = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await userService.getAddresses(user.id);
      setAddresses(data);
    } catch (err) {
      console.error('Failed to load addresses:', err);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setFormData({
      label: 'Home',
      flat: '',
      street: '',
      area: '',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '',
      landmark: '',
      isDefault: addresses.length === 0,
      latitude: 19.1136,
      longitude: 72.8697,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (addr) => {
    setEditingAddress(addr);
    setFormData({ ...addr });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await userService.deleteAddress(id);
        fetchAddresses();
      } catch (err) {
        alert('Delete address failed: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await userService.setDefaultAddress(id);
      fetchAddresses();
    } catch (err) {
      alert('Failed to set default address: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const userId = user?.id;
      if (!userId) {
        throw new Error('User session not authenticated');
      }
      if (editingAddress) {
        await userService.updateAddress(editingAddress.id, formData);
      } else {
        await userService.addAddress(userId, { ...formData });
      }
      setModalOpen(false);
      fetchAddresses();
    } catch (err) {
      alert('Failed to save address: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="customer-addresses-page" style={{ padding: '2rem 0 4rem 0' }}>
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <span className="section-subtitle">Account Preferences</span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--neutral-900)', margin: 0 }}>
              Saved Service Addresses
            </h1>
            <p className="text-xs text-muted">Manage service delivery locations and default home coordinates for verified technician dispatch.</p>
          </div>

          <Button variant="primary" onClick={handleOpenAdd} className="flex items-center gap-1">
            <Plus size={16} />
            <span>Add New Address</span>
          </Button>
        </div>

        {/* Address Cards Grid */}
        {loading ? (
          <LoadingSpinner message="Loading your addresses..." />
        ) : (
          <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {addresses.map((addr) => (
              <div key={addr.id} className="card flex flex-col justify-between" style={{ border: addr.isDefault ? '2px solid var(--primary-800)' : '1px solid var(--neutral-200)' }}>
                <div className="card-body">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--primary-50)',
                          color: 'var(--primary-700)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <MapPin size={16} />
                      </div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                        {addr.label}
                      </h4>
                    </div>

                    {addr.isDefault ? (
                      <span className="badge badge-verified">Default Address</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(addr.id)}
                        className="btn btn-sm btn-light text-xs"
                      >
                        Set Default
                      </button>
                    )}
                  </div>

                  <p className="text-sm font-semibold" style={{ color: 'var(--neutral-800)', marginTop: '0.5rem' }}>
                    {addr.flat}
                  </p>
                  <p className="text-xs text-muted">
                    {addr.street}, {addr.city}
                  </p>
                  <p className="text-xs text-muted">
                    {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                  </p>

                  {addr.landmark && (
                    <p className="text-xs" style={{ color: 'var(--primary-700)', marginTop: '4px' }}>
                      Landmark: {addr.landmark}
                    </p>
                  )}
                </div>

                <div className="card-footer flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(addr)}
                    className="btn btn-sm btn-secondary flex items-center gap-1"
                  >
                    <Edit2 size={12} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(addr.id)}
                    className="btn btn-sm btn-secondary flex items-center gap-1"
                    style={{ color: 'var(--danger-600)' }}
                  >
                    <Trash2 size={12} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add / Edit Address Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingAddress ? 'Edit Service Address' : 'Add New Service Address'}
          size="lg"
          footer={
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button variant="primary" loading={submitting} onClick={handleSubmit}>
                {editingAddress ? 'Save Address Changes' : 'Save New Address'}
              </Button>
            </>
          }
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Address Label"
                placeholder="e.g. Home, Office, Parents"
                value={formData.label}
                onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
                required
              />

              <Input
                label="House / Flat / Building"
                placeholder="e.g. Flat 402, Sunshine Apts"
                value={formData.flat}
                onChange={(e) => setFormData((prev) => ({ ...prev, flat: e.target.value }))}
                required
              />
            </div>

            <Input
              label="Street / Road"
              placeholder="e.g. MG Road, Near Station"
              value={formData.street}
              onChange={(e) => setFormData((prev) => ({ ...prev, street: e.target.value }))}
              required
            />

            <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Area / Locality"
                placeholder="e.g. Thane West"
                value={formData.area}
                onChange={(e) => setFormData((prev) => ({ ...prev, area: e.target.value }))}
                required
              />

              <Input
                label="Pincode"
                placeholder="e.g. 400601"
                value={formData.pincode}
                onChange={(e) => setFormData((prev) => ({ ...prev, pincode: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                required
              />

              <Input
                label="Landmark (Optional)"
                placeholder="e.g. Opposite ICICI Bank"
                value={formData.landmark}
                onChange={(e) => setFormData((prev) => ({ ...prev, landmark: e.target.value }))}
              />
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData((prev) => ({ ...prev, isDefault: e.target.checked }))}
              />
              <span>Set as my default service address</span>
            </label>
          </form>
        </Modal>
      </div>
    </div>
  );
};
