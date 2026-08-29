import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { adminService } from '../../services/adminService';
import { Users, ShieldCheck, Layers, Calendar, ArrowRight, AlertCircle, Sparkles, UserCheck, FolderTree, Wrench } from 'lucide-react';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    customers: 0,
    providers: 0,
    pendingProviders: 0,
    categories: 0,
    services: 0,
    totalBookings: 0,
    pendingBookings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [users, providerProfiles, categories, services, bookings] = await Promise.all([
        adminService.getAllUsers().catch(() => []),
        adminService.getAllProviderProfiles().catch(() => []),
        adminService.getCategories().catch(() => []),
        adminService.getServices().catch(() => []),
        adminService.getAllBookings().catch(() => []),
      ]);

      const customersCount = users.filter((u) => u.role === 'CUSTOMER').length;
      const providersCount = users.filter((u) => u.role === 'PROVIDER').length;
      const pendingProv = providerProfiles.filter((p) => p.verificationStatus === 'PENDING').length;
      const pendingBook = bookings.filter((b) => b.status === 'PENDING').length;

      setStats({
        totalUsers: users.length,
        customers: customersCount,
        providers: providersCount,
        pendingProviders: pendingProv,
        categories: categories.length,
        services: services.length,
        totalBookings: bookings.length,
        pendingBookings: pendingBook,
      });
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
      setError('Unable to fetch live database metrics. Please check network/backend status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <DashboardHeader
        title="Admin Governance Center"
        subtitle="Live platform oversight, provider background verification queue, category taxonomy, and booking logs."
      />

      <div className="dashboard-content">
        <div className="container" style={{ maxWidth: '1200px' }}>
          {error && (
            <div className="alert alert-danger mb-4 flex items-center gap-2" role="alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="card text-center p-5">
              <div className="spinner-border text-primary mx-auto mb-3" role="status" />
              <p className="text-muted">Loading live database metrics from Spring Boot REST API...</p>
            </div>
          ) : (
            <>
              {/* Stat Cards Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1.25rem',
                  marginBottom: '2rem',
                }}
              >
                <div className="card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted font-bold text-xs uppercase">Total Users</span>
                    <div style={{ color: 'var(--primary-700)' }}>
                      <Users size={22} />
                    </div>
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{stats.totalUsers}</h2>
                  <div className="text-xs text-muted mt-2">
                    {stats.customers} Customers • {stats.providers} Providers
                  </div>
                </div>

                <div className="card p-4" style={{ borderColor: stats.pendingProviders > 0 ? '#f59e0b' : 'var(--neutral-200)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted font-bold text-xs uppercase">Pending Providers</span>
                    <div style={{ color: stats.pendingProviders > 0 ? '#d97706' : 'var(--primary-700)' }}>
                      <ShieldCheck size={22} />
                    </div>
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: stats.pendingProviders > 0 ? '#d97706' : 'inherit' }}>
                    {stats.pendingProviders}
                  </h2>
                  <div className="text-xs text-muted mt-2">Awaiting Admin Verification</div>
                </div>

                <div className="card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted font-bold text-xs uppercase">Catalog Taxonomy</span>
                    <div style={{ color: 'var(--primary-700)' }}>
                      <FolderTree size={22} />
                    </div>
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{stats.services}</h2>
                  <div className="text-xs text-muted mt-2">{stats.categories} Categories Active</div>
                </div>

                <div className="card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted font-bold text-xs uppercase">Platform Bookings</span>
                    <div style={{ color: 'var(--primary-700)' }}>
                      <Calendar size={22} />
                    </div>
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{stats.totalBookings}</h2>
                  <div className="text-xs text-muted mt-2">{stats.pendingBookings} Pending Acceptance</div>
                </div>
              </div>

              {/* Quick Actions & Navigation */}
              <div className="card p-4 mb-4">
                <h4 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Admin Control Center</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                  <Link to="/admin/providers" className="card card-hoverable p-3 flex items-center gap-3" style={{ textDecoration: 'none' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--primary-50)',
                        color: 'var(--primary-700)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <div className="font-bold text-base text-neutral-900">Provider Verification</div>
                      <div className="text-xs text-muted">Review credentials & toggle verified status</div>
                    </div>
                  </Link>

                  <Link to="/admin/users" className="card card-hoverable p-3 flex items-center gap-3" style={{ textDecoration: 'none' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--primary-50)',
                        color: 'var(--primary-700)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Users size={22} />
                    </div>
                    <div>
                      <div className="font-bold text-base text-neutral-900">User Administration</div>
                      <div className="text-xs text-muted">Manage customer and provider accounts</div>
                    </div>
                  </Link>

                  <Link to="/admin/categories" className="card card-hoverable p-3 flex items-center gap-3" style={{ textDecoration: 'none' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--primary-50)',
                        color: 'var(--primary-700)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <FolderTree size={22} />
                    </div>
                    <div>
                      <div className="font-bold text-base text-neutral-900">Category Catalog</div>
                      <div className="text-xs text-muted">Manage service categories and icons</div>
                    </div>
                  </Link>

                  <Link to="/admin/services" className="card card-hoverable p-3 flex items-center gap-3" style={{ textDecoration: 'none' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--primary-50)',
                        color: 'var(--primary-700)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Wrench size={22} />
                    </div>
                    <div>
                      <div className="font-bold text-base text-neutral-900">Services Catalog</div>
                      <div className="text-xs text-muted">Create services, set base pricing & duration</div>
                    </div>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
