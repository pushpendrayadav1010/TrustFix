import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { LoadingSpinner, EmptyState } from '../../components/common/FeedbackStates';
import { formatDate } from '../../utils/formatters';
import { Users, Search, UserCheck, Shield, Wrench } from 'lucide-react';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const name = (u.name || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || name.includes(q) || email.includes(q);
    return matchesRole && matchesSearch;
  });

  return (
    <div>
      <DashboardHeader
        title="User Accounts Directory"
        subtitle="Manage all customer, service provider, and administrative accounts."
      />

      <div className="dashboard-content">
        
        {/* Controls */}
        <div className="card mb-6" style={{ padding: '1rem', backgroundColor: 'var(--white)' }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {['ALL', 'CUSTOMER', 'PROVIDER', 'ADMIN'].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`btn btn-sm ${roleFilter === r ? 'btn-primary' : 'btn-light'}`}
                  onClick={() => setRoleFilter(r)}
                >
                  <span>{r === 'ALL' ? 'All Roles' : r}</span>
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '32px', fontSize: '13px' }}
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <LoadingSpinner message="Loading user directory..." />
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users found"
            description="No user accounts match the current filter or search criteria."
          />
        ) : (
          <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--white)' }}>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>User ID & Name</th>
                    <th>Email Address</th>
                    <th>Phone</th>
                    <th>Platform Role</th>
                    <th>Account Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <strong className="text-sm block" style={{ color: 'var(--neutral-900)' }}>{u.name}</strong>
                        <span className="text-2xs text-muted font-mono">UID: {u.id}</span>
                      </td>
                      <td>
                        <span className="text-xs">{u.email}</span>
                      </td>
                      <td>
                        <span className="text-xs">{u.phone || 'N/A'}</span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            u.role === 'ADMIN' ? 'badge-in_progress' : u.role === 'PROVIDER' ? 'badge-verified' : 'badge-confirmed'
                          }`}
                          style={{ fontSize: '10px' }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span className="flex items-center gap-1">
                          <span className={`status-dot ${u.active !== false ? 'online' : 'offline'}`} />
                          <span className="text-xs font-semibold">{u.active !== false ? 'Active' : 'Disabled'}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
