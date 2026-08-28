import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import { providerService } from '../../services/providerService';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { StatCard } from '../../components/dashboard/StatCard';
import { VerificationBadge } from '../../components/common/VerificationBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/FeedbackStates';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const ProviderDashboard = () => {
  const { user, providerProfile, updateProvider } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const fetchProviderData = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getProviderBookings(providerProfile?.id || 101);
      setBookings(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderData();
  }, [providerProfile]);

  const handleToggleAvailability = async () => {
    if (!providerProfile) return;
    setToggling(true);
    try {
      const newAvail = await providerService.toggleAvailability(providerProfile.id);
      updateProvider({ available: newAvail });
    } finally {
      setToggling(false);
    }
  };

  const handleAcceptRequest = async (bookingId) => {
    await bookingService.updateBookingStatus(bookingId, 'CONFIRMED');
    fetchProviderData();
  };

  const handleRejectRequest = async (bookingId) => {
    await bookingService.updateBookingStatus(bookingId, 'CANCELLED');
    fetchProviderData();
  };

  const pendingRequests = bookings.filter(b => b.status === 'PENDING');
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');
  const inProgressBookings = bookings.filter(b => b.status === 'IN_PROGRESS' || b.status === 'CONFIRMED');

  const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.price || 0), 0);

  return (
    <div className="provider-dashboard">
      <DashboardHeader
        title={`Provider Console — ${providerProfile?.name || user?.name || 'Partner'}`}
        subtitle="Manage job dispatches, live availability, service area, and customer requests."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`btn btn-sm ${providerProfile?.available ? 'btn-success' : 'btn-secondary'}`}
              onClick={handleToggleAvailability}
              disabled={toggling}
            >
              <span className={`status-dot ${providerProfile?.available ? 'online' : 'offline'}`} />
              <span>{providerProfile?.available ? 'Active & Accepting Jobs' : 'Offline / Unavailable'}</span>
            </button>
          </div>
        }
      />

      <div className="dashboard-content">
        {loading ? (
          <LoadingSpinner message="Loading provider dashboard metrics..." />
        ) : (
          <>
            {/* Verification Status Banner */}
            <div
              className="card mb-6"
              style={{
                backgroundColor: providerProfile?.verificationStatus === 'VERIFIED' ? 'var(--success-50)' : 'var(--warning-50)',
                borderColor: providerProfile?.verificationStatus === 'VERIFIED' ? 'var(--success-100)' : 'var(--warning-100)',
                padding: '1.25rem 1.5rem',
              }}
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: '1.75rem' }}>
                    {providerProfile?.verificationStatus === 'VERIFIED' ? '🛡️' : '⏳'}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                        {providerProfile?.verificationStatus === 'VERIFIED' ? 'Verified Service Partner' : 'Verification Under Review'}
                      </h4>
                      <VerificationBadge status={providerProfile?.verificationStatus} />
                    </div>
                    <p className="text-xs text-muted" style={{ margin: 0, marginTop: '2px' }}>
                      {providerProfile?.verificationStatus === 'VERIFIED'
                        ? 'Your Aadhaar, trade certifications, and police background clearance are active. You receive top priority in customer search.'
                        : 'Your submitted documents are being vetted by our Trust & Safety team. You can configure services and pricing.'}
                    </p>
                  </div>
                </div>

                <Link to="/provider/profile" className="btn btn-sm btn-light">
                  View Credentials Profile →
                </Link>
              </div>
            </div>

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <StatCard
                title="Total Bookings"
                value={bookings.length}
                subtitle="All time requests"
                icon="📊"
                color="primary"
              />
              <StatCard
                title="Pending Requests"
                value={pendingRequests.length}
                subtitle="Requires your response"
                icon="📬"
                color={pendingRequests.length > 0 ? "warning" : "primary"}
              />
              <StatCard
                title="Active Jobs"
                value={inProgressBookings.length}
                subtitle="Confirmed or in progress"
                icon="⚡"
                color="primary"
              />
              <StatCard
                title="Average Rating"
                value={`★ ${providerProfile?.rating || 4.9}`}
                subtitle={`Based on ${providerProfile?.reviewCount || 100}+ reviews`}
                icon="⭐"
                color="success"
              />
              <StatCard
                title="Estimated Earnings"
                value={formatCurrency(totalEarnings)}
                subtitle="From completed jobs"
                icon="💰"
                color="success"
              />
            </div>

            {/* Pending Booking Requests (Requires Action) */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                    Incoming Job Requests ({pendingRequests.length})
                  </h3>
                  <p className="text-xs text-muted">Accept or decline service requests within 30 minutes to maintain high rank.</p>
                </div>
              </div>

              {pendingRequests.length === 0 ? (
                <div className="card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--white)' }}>
                  <span style={{ fontSize: '2rem' }}>📬</span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.5rem', marginBottom: '0.25rem' }}>
                    No pending booking requests right now
                  </h4>
                  <p className="text-xs text-muted">
                    New customer service appointments in your service area will appear here in real time.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {pendingRequests.map(req => (
                    <div key={req.id} className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--warning-500)' }}>
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex-1 min-w-[240px]">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm" style={{ color: 'var(--primary-800)' }}>#{req.id}</span>
                            <StatusBadge status={req.status} />
                            <span className="text-xs text-muted">• {formatDate(req.createdAt)}</span>
                          </div>

                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                            {req.serviceName}
                          </h4>

                          <p className="text-xs text-muted" style={{ marginTop: '2px' }}>
                            Customer: <strong>{req.customerName}</strong> ({req.customerPhone}) • 📍 {req.address?.city || 'Thane'}
                          </p>

                          <div className="flex gap-4 text-xs font-semibold text-neutral-800 mt-2">
                            <span>📅 Date: {formatDate(req.date)}</span>
                            <span>🕒 Slot: {req.time}</span>
                            <span>💰 Est: {formatCurrency(req.price)}</span>
                          </div>

                          {req.description && (
                            <p className="text-xs text-muted italic mt-2">
                              "{req.description}"
                            </p>
                          )}
                        </div>

                        {/* Accept / Reject Action Buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-success"
                            onClick={() => handleAcceptRequest(req.id)}
                          >
                            ✓ Accept Job
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            style={{ color: 'var(--danger-600)' }}
                            onClick={() => handleRejectRequest(req.id)}
                          >
                            ✕ Decline
                          </button>

                          <Link
                            to={`/provider/bookings/${req.id}`}
                            className="btn btn-sm btn-light"
                          >
                            Details →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions & Recent Jobs Grid */}
            <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              
              {/* Quick Actions */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
                  Provider Quick Management
                </h4>

                <div className="grid grid-cols-2" style={{ gap: '10px' }}>
                  <Link to="/provider/services" className="btn btn-light justify-start text-xs font-semibold">
                    <span>📋 My Services</span>
                  </Link>
                  <Link to="/provider/pricing" className="btn btn-light justify-start text-xs font-semibold">
                    <span>💰 Manage Pricing</span>
                  </Link>
                  <Link to="/provider/profile" className="btn btn-light justify-start text-xs font-semibold">
                    <span>🗺️ Service Area Map</span>
                  </Link>
                  <Link to="/provider/availability" className="btn btn-light justify-start text-xs font-semibold">
                    <span>⏰ Working Hours</span>
                  </Link>
                </div>
              </div>

              {/* Recent Activity Table */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                    Active & Recent Jobs
                  </h4>
                  <Link to="/provider/requests" className="text-xs font-semibold" style={{ color: 'var(--primary-700)' }}>
                    View All →
                  </Link>
                </div>

                <div className="flex flex-col gap-2">
                  {bookings.slice(0, 3).map(b => (
                    <div
                      key={b.id}
                      style={{
                        padding: '10px 12px',
                        backgroundColor: 'var(--neutral-50)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.8125rem',
                      }}
                    >
                      <div>
                        <strong className="block text-neutral-900">{b.serviceName}</strong>
                        <span className="text-xs text-muted">{b.customerName} • {formatDate(b.date)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <StatusBadge status={b.status} />
                        <Link to={`/provider/bookings/${b.id}`} className="text-xs font-bold" style={{ color: 'var(--primary-800)' }}>
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
};
