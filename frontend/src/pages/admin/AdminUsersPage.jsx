import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { adminService } from '../../services/adminService';
import { CheckCircle2, AlertCircle, RotateCw, UserCheck, Shield, User, Wrench } from 'lucide-react';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      let data = [];
      if (roleFilter === 'ALL') {
        data = await adminService.getAllUsers();
      } else {
        data = await adminService.getUsersByRole(roleFilter);
      }
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Unable to fetch users from backend API.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (user) => {
    try {
      setActionSuccess(null);
      const updated = await adminService.updateUser(user.id, {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        active: !user.active,
      });
      setActionSuccess(`User ${updated.email} active state set to ${updated.active}.`);
      fetchUsers();
    } catch (err) {
      alert('Failed to update user status: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteUser = async (userId, email) => {
    if (!window.confirm(`Are you sure you want to delete user ${email} (ID: ${userId})?`)) return;
    try {
      setActionSuccess(null);
      await adminService.deleteUser(userId);
      setActionSuccess(`User ${email} deleted successfully.`);
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="admin-users-page">
      <DashboardHeader
        title="User Administration"
        subtitle="View, audit, toggle account status, and manage platform customers and providers."
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

          {/* Filter Bar */}
          <div className="card p-3 mb-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm">Role Filter:</span>
              <button
                className={`btn btn-sm ${roleFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setRoleFilter('ALL')}
              >
                All Roles
              </button>
              <button
                className={`btn btn-sm ${roleFilter === 'CUSTOMER' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setRoleFilter('CUSTOMER')}
              >
                Customers
              </button>
              <button
                className={`btn btn-sm ${roleFilter === 'PROVIDER' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setRoleFilter('PROVIDER')}
              >
                Providers
              </button>
              <button
                className={`btn btn-sm ${roleFilter === 'ADMIN' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setRoleFilter('ADMIN')}
              >
                Admins
              </button>
            </div>

            <button className="btn btn-sm btn-secondary flex items-center gap-1" onClick={fetchUsers}>
              <RotateCw size={13} />
              <span>Refresh List</span>
            </button>
          </div>

          {/* Users Table */}
          <div className="card p-0 overflow-hidden">
            {loading ? (
              <div className="p-5 text-center">
                <div className="spinner-border text-primary mb-2" role="status" />
                <p className="text-muted">Loading users from backend...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="p-5 text-center text-muted">No users found for selected role filter.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: 'var(--neutral-100)', borderBottom: '1px solid var(--neutral-200)' }}>
                    <tr>
                      <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Name</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Email</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Phone</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--neutral-200)' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>#{u.id}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{u.name}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{u.email}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{u.phone || 'N/A'}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span
                            style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              backgroundColor: u.role === 'ADMIN' ? '#f3e8ff' : u.role === 'PROVIDER' ? '#dbeafe' : '#f3f4f6',
                              color: u.role === 'ADMIN' ? '#6b21a8' : u.role === 'PROVIDER' ? '#1e40af' : '#374151',
                            }}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span
                            style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              backgroundColor: u.active ? '#dcfce7' : '#fee2e2',
                              color: u.active ? '#166534' : '#991b1b',
                            }}
                          >
                            {u.active ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => handleToggleActive(u)}
                            >
                              {u.active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              style={{ color: 'var(--danger-600)' }}
                              onClick={() => handleDeleteUser(u.id, u.email)}
                            >
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
        </div>
      </div>
    </div>
  );
};
