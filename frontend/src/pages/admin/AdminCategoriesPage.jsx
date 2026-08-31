import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { LoadingSpinner, EmptyState } from '../../components/common/FeedbackStates';
import { getCategoryIcon, sanitizeCategoryDescription, sanitizeCategoryName } from '../../utils/categoryIcons';
import { Layers, Plus, Edit2, Trash2, Power } from 'lucide-react';

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await adminService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIconUrl('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setIconUrl(cat.iconUrl || '');
    setModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const payload = {
        name,
        description,
        iconUrl: iconUrl || 'Wrench',
        active: true,
      };

      if (editingCategory) {
        await adminService.updateCategory(editingCategory.id, payload);
      } else {
        await adminService.createCategory(payload);
      }
      setModalOpen(false);
      await fetchCategories();
    } catch (err) {
      alert(err.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDeactivate = async (id) => {
    try {
      await adminService.deactivateCategory(id);
      await fetchCategories();
    } catch (err) {
      alert(err.message || 'Failed to toggle category status');
    }
  };

  return (
    <div>
      <DashboardHeader
        title="Category Management"
        subtitle="Configure primary trade specialties and service taxonomies."
        actions={
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={handleOpenAddModal}
          >
            <Plus size={14} />
            <span>Add Category</span>
          </button>
        }
      />

      <div className="dashboard-content">
        
        {loading ? (
          <LoadingSpinner message="Loading categories..." />
        ) : categories.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No categories configured"
            description="Create your first home service category."
            action={
              <Button variant="primary" onClick={handleOpenAddModal}>
                <Plus size={14} />
                <span>Add Category</span>
              </Button>
            }
          />
        ) : (
          <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--white)' }}>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Icon</th>
                    <th>Category Name</th>
                    <th>Sanitized Description</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => {
                    const Icon = getCategoryIcon(c.name);
                    return (
                      <tr key={c.id}>
                        <td style={{ width: '48px' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'var(--primary-100)',
                              color: 'var(--primary-800)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Icon size={18} strokeWidth={2.2} />
                          </div>
                        </td>
                        <td>
                          <strong className="text-sm block" style={{ color: 'var(--neutral-900)' }}>
                            {sanitizeCategoryName(c.name)}
                          </strong>
                          <span className="text-2xs text-muted font-mono">ID: {c.id}</span>
                        </td>
                        <td>
                          <span className="text-xs text-muted">
                            {sanitizeCategoryDescription(c.name, c.description)}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${c.active !== false ? 'badge-verified' : 'badge-cancelled'}`} style={{ fontSize: '10px' }}>
                            {c.active !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              className="btn btn-sm btn-secondary"
                              style={{ padding: '4px 8px' }}
                              onClick={() => handleOpenEditModal(c)}
                              title="Edit Category"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              style={{ padding: '4px 8px' }}
                              onClick={() => handleToggleDeactivate(c.id)}
                              title="Toggle Deactivate"
                            >
                              <Power size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add / Edit Category Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingCategory ? 'Edit Service Category' : 'Create New Category'}
          footer={
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" loading={saving} onClick={handleSaveCategory}>
                {editingCategory ? 'Save Changes' : 'Create Category'}
              </Button>
            </>
          }
        >
          <form onSubmit={handleSaveCategory}>
            <Input
              label="Category Name"
              placeholder="e.g. Electrical, Plumbing, Cleaning..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="form-group mb-0">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Brief summary of tasks covered under this category..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </form>
        </Modal>

      </div>
    </div>
  );
};
