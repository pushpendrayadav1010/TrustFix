import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { adminService } from '../../services/adminService';
import { sanitizeServiceName, sanitizeServiceDescription } from '../../utils/categoryIcons';
import { formatCurrency } from '../../utils/formatters';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: 499,
    durationInMinutes: 60,
    categoryId: '',
    imageUrl: '',
    active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [svcData, catData] = await Promise.all([
        adminService.getServices(),
        adminService.getCategories(),
      ]);
      setServices(svcData);
      setCategories(catData);
      if (catData.length > 0 && !formData.categoryId) {
        setFormData((prev) => ({ ...prev, categoryId: catData[0].id }));
      }
    } catch (err) {
      console.error('Failed to load services:', err);
      setError('Unable to fetch service catalog from backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditId(null);
    setFormData({
      name: '',
      description: '',
      basePrice: 499,
      durationInMinutes: 60,
      categoryId: categories.length > 0 ? categories[0].id : '',
      imageUrl: '',
      active: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (svc) => {
    setEditId(svc.id);
    setFormData({
      name: sanitizeServiceName(svc.name) || '',
      description: sanitizeServiceDescription(svc.description) || '',
      basePrice: svc.basePrice || 499,
      durationInMinutes: svc.durationInMinutes || 60,
      categoryId: svc.categoryId || (categories.length > 0 ? categories[0].id : ''),
      imageUrl: svc.imageUrl || '',
      active: svc.active !== false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryId) {
      alert('Please select a valid category.');
      return;
    }
    try {
      setActionSuccess(null);
      const payload = {
        name: formData.name,
        description: formData.description,
        basePrice: parseFloat(formData.basePrice),
        durationInMinutes: parseInt(formData.durationInMinutes, 10),
        imageUrl: formData.imageUrl,
        active: formData.active,
      };

      if (editId) {
        await adminService.updateService(editId, payload);
        setActionSuccess(`Service '${formData.name}' updated successfully.`);
      } else {
        await adminService.createService(formData.categoryId, payload);
        setActionSuccess(`New Service '${formData.name}' created.`);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert('Operation failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete service '${name}' (ID #${id})?`)) return;
    try {
      setActionSuccess(null);
      await adminService.deleteService(id);
      setActionSuccess(`Service '${name}' deleted successfully.`);
      fetchData();
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="admin-services-page">
      <DashboardHeader
        title="Service Catalog Management"
        subtitle="Manage service items, base pricing, duration, and category mappings."
      />

      <div className="dashboard-content">
        <div className="container" style={{ maxWidth: '1200px' }}>
          {actionSuccess && (
            <div className="alert alert-success mb-4 flex items-center gap-2" role="alert">
              <CheckCircle2 size={18} />
              <span>{actionSuccess}</span>
            </div>
          )}

          {error && (
            <div className="alert alert-danger mb-4 flex items-center gap-2" role="alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Action Bar */}
          <div className="card p-3 mb-4 flex items-center justify-between">
            <h4 style={{ margin: 0, fontWeight: 700 }}>Service Catalog Items</h4>
            <button className="btn btn-primary flex items-center gap-1" onClick={handleOpenCreate}>
              <Plus size={16} />
              <span>Add New Service</span>
            </button>
          </div>

          {/* Services Table */}
          <div className="card p-0 overflow-hidden">
            {loading ? (
              <div className="p-5 text-center">
                <div className="spinner-border text-primary mb-2" role="status" />
                <p className="text-muted">Loading service catalog from backend...</p>
              </div>
            ) : services.length === 0 ? (
              <div className="p-5 text-center text-muted">No services found in database.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: 'var(--neutral-100)', borderBottom: '1px solid var(--neutral-200)' }}>
                    <tr>
                      <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Service Name</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Base Price</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Est. Duration</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((s) => (
                      <tr key={s.id} style={{ borderBottom: '1px solid var(--neutral-200)' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>#{s.id}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div className="font-bold text-neutral-900">{sanitizeServiceName(s.name)}</div>
                          <div className="text-xs text-muted text-truncate" style={{ maxWidth: '280px' }}>
                            {sanitizeServiceDescription(s.description)}
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 600 }}>
                          {s.categoryName || `Category #${s.categoryId}`}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary-700)' }}>
                          {formatCurrency(s.basePrice)}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                          <span className="flex items-center gap-1 text-muted">
                            <Clock size={12} />
                            <span>{s.durationInMinutes} mins</span>
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span
                            style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              backgroundColor: s.active !== false ? '#dcfce7' : '#fee2e2',
                              color: s.active !== false ? '#166534' : '#991b1b',
                            }}
                          >
                            {s.active !== false ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                          <div className="flex items-center justify-end gap-2">
                            <button className="btn btn-sm btn-secondary flex items-center gap-1" onClick={() => handleOpenEdit(s)}>
                              <Edit2 size={12} />
                              <span>Edit</span>
                            </button>
                            <button className="btn btn-sm btn-secondary flex items-center gap-1" style={{ color: 'var(--danger-600)' }} onClick={() => handleDelete(s.id, s.name)}>
                              <Trash2 size={12} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Modal Overlay */}
          {showModal && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
              }}
            >
              <div className="card p-4" style={{ width: '100%', maxWidth: '540px', backgroundColor: '#fff' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>
                  {editId ? `Edit Service #${editId}` : 'Create New Catalog Service'}
                </h4>
                <form onSubmit={handleSubmit}>
                  {!editId && (
                    <div className="form-group mb-3">
                      <label className="form-label font-bold text-sm">Parent Category</label>
                      <select
                        className="form-control"
                        required
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} (ID #{c.id})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="form-group mb-3">
                    <label className="form-label font-bold text-sm">Service Name</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                    <div>
                      <label className="form-label font-bold text-sm">Base Price (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        min="0"
                        value={formData.basePrice}
                        onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label font-bold text-sm">Est. Duration (Mins)</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        min="15"
                        value={formData.durationInMinutes}
                        onChange={(e) => setFormData({ ...formData, durationInMinutes: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label font-bold text-sm">Image URL (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label font-bold text-sm">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="form-group mb-4 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="activeServiceCheck"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    />
                    <label htmlFor="activeServiceCheck" className="form-label font-bold text-sm mb-0">
                      Active Service
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editId ? 'Save Changes' : 'Create Service'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
