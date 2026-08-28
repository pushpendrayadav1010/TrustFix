import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { adminService } from '../../services/adminService';

export const AdminCategoriesPage = () => {
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
    iconUrl: '🛠️',
    active: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Unable to fetch categories from backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditId(null);
    setFormData({ name: '', description: '', iconUrl: '🛠️', active: true });
    setShowModal(true);
  };

  const handleOpenEdit = (cat) => {
    setEditId(cat.id);
    setFormData({
      name: cat.name || '',
      description: cat.description || '',
      iconUrl: cat.iconUrl || '🛠️',
      active: cat.active !== false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setActionSuccess(null);
      if (editId) {
        await adminService.updateCategory(editId, formData);
        setActionSuccess(`Category '${formData.name}' updated successfully.`);
      } else {
        await adminService.createCategory(formData);
        setActionSuccess(`New Category '${formData.name}' created successfully.`);
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      alert('Operation failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category '${name}' (ID #${id})?`)) return;
    try {
      setActionSuccess(null);
      await adminService.deleteCategory(id);
      setActionSuccess(`Category '${name}' deleted successfully.`);
      fetchCategories();
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="admin-categories-page">
      <DashboardHeader
        title="Category Catalog Management"
        subtitle="Manage global service categories, icons, and status."
      />

      <div className="dashboard-content">
        <div className="container" style={{ maxWidth: '1200px' }}>
          {actionSuccess && (
            <div className="alert alert-success mb-4" role="alert">
              ✓ {actionSuccess}
            </div>
          )}

          {error && (
            <div className="alert alert-danger mb-4" role="alert">
              ⚠️ {error}
            </div>
          )}

          {/* Action Bar */}
          <div className="card p-3 mb-4 flex items-center justify-between">
            <h4 style={{ margin: 0, fontWeight: 700 }}>Service Categories Catalog</h4>
            <button className="btn btn-primary" onClick={handleOpenCreate}>
              + Add New Category
            </button>
          </div>

          {/* Categories Table */}
          <div className="card p-0 overflow-hidden">
            {loading ? (
              <div className="p-5 text-center">
                <div className="spinner-border text-primary mb-2" role="status" />
                <p className="text-muted">Loading categories from backend...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="p-5 text-center text-muted">No categories available in MySQL.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: 'var(--neutral-100)', borderBottom: '1px solid var(--neutral-200)' }}>
                    <tr>
                      <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Icon</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Name</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Description</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr key={c.id} style={{ borderBottom: '1px solid var(--neutral-200)' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>#{c.id}</td>
                        <td style={{ padding: '0.75rem 1rem', fontSize: '1.5rem' }}>{c.iconUrl || '🛠️'}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{c.name}</td>
                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--neutral-600)' }}>
                          {c.description || 'No description'}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span
                            style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              backgroundColor: c.active !== false ? '#dcfce7' : '#fee2e2',
                              color: c.active !== false ? '#166534' : '#991b1b',
                            }}
                          >
                            {c.active !== false ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                          <div className="flex items-center justify-end gap-2">
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => handleOpenEdit(c)}>
                              Edit
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c.id, c.name)}>
                              Delete
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

          {/* Form Modal / Overlay */}
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
              <div className="card p-4" style={{ width: '100%', maxWidth: '500px', backgroundColor: '#fff' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>
                  {editId ? `Edit Category #${editId}` : 'Create New Category'}
                </h4>
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label className="form-label font-bold text-sm">Category Name</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label font-bold text-sm">Icon Emoji or Image URL</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.iconUrl}
                      onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
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
                      id="activeCheck"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    />
                    <label htmlFor="activeCheck" className="form-label font-bold text-sm mb-0">
                      Active Category
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editId ? 'Save Changes' : 'Create Category'}
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
