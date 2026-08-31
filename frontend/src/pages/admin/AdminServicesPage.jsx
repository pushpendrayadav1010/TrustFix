import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { LoadingSpinner, EmptyState } from '../../components/common/FeedbackStates';
import { formatCurrency } from '../../utils/formatters';
import { ClipboardList, Plus, Edit2, Power, Search } from 'lucide-react';

export const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    description: '',
    basePrice: 499,
    durationMinutes: 60,
  });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [servs, cats] = await Promise.all([
        adminService.getServices(),
        adminService.getCategories()
      ]);
      setServices(servs);
      setCategories(cats);
      if (cats.length > 0 && !formData.categoryId) {
        setFormData(prev => ({ ...prev, categoryId: cats[0].id }));
      }
    } catch (err) {
      console.error('Failed to load services data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingService(null);
    setFormData({
      categoryId: categories[0]?.id || 1,
      name: '',
      description: '',
      basePrice: 499,
      durationMinutes: 60,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (s) => {
    setEditingService(s);
    setFormData({
      categoryId: s.categoryId || categories[0]?.id || 1,
      name: s.name,
      description: s.description || '',
      basePrice: s.basePrice || s.price || 499,
      durationMinutes: s.durationMinutes || 60,
    });
    setModalOpen(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        basePrice: parseFloat(formData.basePrice) || 499,
        durationMinutes: parseInt(formData.durationMinutes, 10) || 60,
        active: true,
      };

      if (editingService) {
        await adminService.updateService(editingService.id, payload);
      } else {
        await adminService.createService(formData.categoryId, payload);
      }
      setModalOpen(false);
      await fetchData();
    } catch (err) {
      alert(err.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDeactivate = async (id) => {
    try {
      await adminService.deactivateService(id);
      await fetchData();
    } catch (err) {
      alert(err.message || 'Failed to toggle service status');
    }
  };

  const filteredServices = services.filter((s) => {
    const q = searchQuery.toLowerCase();
    return !q || s.name.toLowerCase().includes(q) || (s.categoryName || '').toLowerCase().includes(q);
  });

  return (
    <div>
      <DashboardHeader
        title="Service Catalog Management"
        subtitle="Configure standard marketplace offerings, duration estimates, and base pricing."
        actions={
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={handleOpenAddModal}
          >
            <Plus size={14} />
            <span>Add Service</span>
          </button>
        }
      />

      <div className="dashboard-content">
        
        {/* Controls */}
        <div className="card mb-6" style={{ padding: '1rem', backgroundColor: 'var(--white)' }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <span className="text-xs text-muted font-bold uppercase tracking-wider">
              {filteredServices.length} Active Catalog Services
            </span>

            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '32px', fontSize: '13px' }}
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Services Table */}
        {loading ? (
          <LoadingSpinner message="Loading service offerings..." />
        ) : filteredServices.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No services found"
            description="Create your first standard service offering."
            action={
              <Button variant="primary" onClick={handleOpenAddModal}>
                <Plus size={14} />
                <span>Add Service</span>
              </Button>
            }
          />
        ) : (
          <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--white)' }}>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Service Name</th>
                    <th>Category</th>
                    <th>Base Visit Price</th>
                    <th>Estimated Duration</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <strong className="text-sm block" style={{ color: 'var(--neutral-900)' }}>
                          {s.name}
                        </strong>
                        <span className="text-2xs text-muted font-mono">ID: {s.id}</span>
                      </td>
                      <td>
                        <span className="badge badge-confirmed" style={{ fontSize: '11px' }}>
                          {s.categoryName || 'General'}
                        </span>
                      </td>
                      <td>
                        <strong className="text-sm text-primary">
                          {formatCurrency(s.basePrice || s.price || 499)}
                        </strong>
                      </td>
                      <td>
                        <span className="text-xs">{s.durationMinutes || 60} mins</span>
                      </td>
                      <td>
                        <span className={`badge ${s.active !== false ? 'badge-verified' : 'badge-cancelled'}`} style={{ fontSize: '10px' }}>
                          {s.active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            style={{ padding: '4px 8px' }}
                            onClick={() => handleOpenEditModal(s)}
                            title="Edit Service"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            style={{ padding: '4px 8px' }}
                            onClick={() => handleToggleDeactivate(s.id)}
                            title="Toggle Status"
                          >
                            <Power size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingService ? 'Edit Service Offering' : 'Add New Service Offering'}
          footer={
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" loading={saving} onClick={handleSaveService}>
                {editingService ? 'Save Service' : 'Create Service'}
              </Button>
            </>
          }
        >
          <form onSubmit={handleSaveService}>
            {!editingService && (
              <div className="form-group mb-3">
                <label className="form-label font-bold">Category</label>
                <select
                  className="form-control"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            <Input
              label="Service Name"
              placeholder="e.g. Switch & Socket Replacement"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Base Diagnostic Fee (₹)"
                type="number"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                required
              />

              <Input
                label="Estimated Duration (Minutes)"
                type="number"
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                required
              />
            </div>

            <div className="form-group mb-0">
              <label className="form-label">Service Description</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Scope of work and inspection details..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </form>
        </Modal>

      </div>
    </div>
  );
};
