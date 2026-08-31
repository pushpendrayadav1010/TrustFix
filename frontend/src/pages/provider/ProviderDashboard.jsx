import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { providerService } from '../../services/providerService';
import { bookingService } from '../../services/bookingService';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { StatCard } from '../../components/dashboard/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { VerificationBadge } from '../../components/common/VerificationBadge';
import { LoadingSpinner } from '../../components/common/FeedbackStates';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Star,
  Inbox,
  AlertCircle,
  Power,
  ArrowRight,
  MapPin,
  DollarSign,
  ShieldCheck,
  Briefcase
} from 'lucide-react';

export const ProviderDashboard = () => {
  const { user, providerProfile, updateProvider } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingStatus, setTogglingStatus] = useState(false);

  useEffect(() => {
    const fetchProviderData = async () => {
      if (!providerProfile?.id) {
        setLoading(false);
        return;
      }
      try {
        const bList = await bookingService.getProviderBookings(providerProfile.id);
        setBookings(bList);
      } catch (err) {
        console.error('Failed to load provider bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProviderData();
  }, [providerProfile?.id]);

  const handleToggleOnline = async () => {
    if (!providerProfile?.id) return;
    setTogglingStatus(true);
    try {
      const newStatus = await providerService.toggleAvailability(providerProfile.id, providerProfile.available);
      updateProvider({ available: newStatus });
    } catch (err) {
      alert(err.message || 'Failed to toggle availability');
    } finally {
      setTogglingStatus(false);
    }
  };

  const isVerified = providerProfile?.verificationStatus === 'VERIFIED';
  const pendingRequests = bookings.filter(b => b.status === 'PENDING');
  const activeJobs = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS');
  const completedJobs = bookings.filter(b => b.status === 'COMPLETED');

  if (loading) {
    return (
      <div>
        <DashboardHeader title="Provider Dashboard" subtitle="Loading..." />
        <div className="dashboard-content">
          <LoadingSpinner message="Fetching provider metrics..." />
        </div>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader
        title="Provider Dashboard"
        subtitle={`Welcome back, ${providerProfile?.name || user?.name || 'Professional'}`}
        actions={
          <button
            type="button"
            onClick={handleToggleOnline}
            disabled={togglingStatus}
            className={`btn btn-sm ${providerProfile?.available ? 'btn-success' : 'btn-secondary'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Power size={14} />
            <span>{providerProfile?.available ? 'Status: ONLINE' : 'Status: OFFLINE'}</span>
          </button>
        }
      />

      <div className="dashboard-content">
        
        {/* Verification Warning Banner if Not Verified */}
        {!isVerified && (
          <div
            className="card mb-6"
            style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: 'var(--warning-50)',
              borderColor: 'var(--warning-200)',
            }}
          >
            <div className="flex items-start gap-3">
              <AlertCircle size={20} color="var(--warning-700)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div className="flex-1">
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--warning-900)', margin: 0 }}>
                  Provider Profile Under Verification
                </h4>
                <p className="text-xs text-muted mb-2 mt-1">
                  Your credentials and documentation are currently being verified by the TrustFix operations team.
                  You will be able to receive live customer booking dispatches as soon as verification is approved.
                </p>
                <Link to="/provider/profile" className="btn btn-sm btn-secondary text-xs" style={{ padding: '4px 10px' }}>
                  Review Verification Details
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TOP METRICS ROW */}
        <div className="grid grid-cols-1 mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          <StatCard
            title="Today's Active Jobs"
            value={activeJobs.length}
            subtitle="Confirmed / In Progress"
            icon={<Briefcase size={20} />}
            color="primary"
          />
          <StatCard
            title="Pending Requests"
            value={pendingRequests.length}
            subtitle="Requires your response"
            icon={<Inbox size={20} />}
            color={pendingRequests.length > 0 ? "warning" : "primary"}
          />
          <StatCard
            title="Completed Jobs"
            value={completedJobs.length}
            subtitle="Lifetime verified orders"
            icon={<CheckCircle2 size={20} />}
            color="success"
          />
          <StatCard
            title="Average Rating"
            value={`★ ${providerProfile?.rating || '4.8'}`}
            subtitle={`${providerProfile?.reviewCount || 15} verified reviews`}
            icon={<Star size={20} />}
            color="warning"
          />
        </div>

        {/* PENDING BOOKING REQUESTS SECTION */}
        <div className="card mb-8" style={{ padding: '1.5rem', backgroundColor: 'var(--white)' }}>
          <div className="flex items-center justify-between mb-4 pb-3 border-bottom" style={{ borderBottom: '1px solid var(--neutral-200)' }}>
            <div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>New Booking Requests</h4>
              <span className="text-xs text-muted">Respond promptly to maintain your high provider rating</span>
            </div>
            <Link to="/provider/requests" className="btn btn-sm btn-secondary">
              <span>View All Requests ({pendingRequests.length})</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-xs text-muted">No pending customer requests right now.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {pendingRequests.map((b) => (
                <div
                  key={b.id}
                  style={{
                    padding: '1rem',
                    backgroundColor: 'var(--neutral-50)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--neutral-200)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <strong className="text-sm">{b.serviceName}</strong>
                      <span className="badge badge-pending">Action Needed</span>
                    </div>
                    <span className="text-xs text-muted block">
                      Customer: <strong>{b.customerName}</strong> • {formatDate(b.date)} at {b.time}
                    </span>
                    <span className="text-2xs text-muted">
                      Location: {b.address?.flat ? `${b.address.flat}, ${b.address.city}` : (b.address?.city || 'Mumbai')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right mr-2">
                      <span className="text-2xs text-muted uppercase font-bold block">Est. Payout</span>
                      <strong className="text-sm text-primary">{formatCurrency(b.price || 499)}</strong>
                    </div>
                    <Link to={`/provider/bookings/${b.id}`} className="btn btn-sm btn-primary">
                      <span>View & Respond</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ACTIVE SCHEDULE & JOBS */}
        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--white)' }}>
          <div className="flex items-center justify-between mb-4 pb-3 border-bottom" style={{ borderBottom: '1px solid var(--neutral-200)' }}>
            <div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Active & Confirmed Appointments</h4>
              <span className="text-xs text-muted">Jobs scheduled for today and upcoming dates</span>
            </div>
          </div>

          {activeJobs.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-xs text-muted">No confirmed jobs in your active schedule.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Service & Ref</th>
                    <th>Customer</th>
                    <th>Date & Time</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeJobs.map((j) => (
                    <tr key={j.id}>
                      <td>
                        <strong className="text-sm block">{j.serviceName}</strong>
                        <span className="text-2xs text-muted font-mono">{j.bookingReference}</span>
                      </td>
                      <td>
                        <span className="text-sm font-medium">{j.customerName}</span>
                      </td>
                      <td>
                        <span className="text-sm block">{formatDate(j.date)}</span>
                        <span className="text-2xs text-muted">{j.time}</span>
                      </td>
                      <td>
                        <span className="text-xs text-truncate block max-w-xs">{j.address?.flat ? `${j.address.flat}, ${j.address.city}` : (j.address?.city || 'Mumbai')}</span>
                      </td>
                      <td>
                        <StatusBadge status={j.status} />
                      </td>
                      <td className="text-right">
                        <Link to={`/provider/bookings/${j.id}`} className="btn btn-sm btn-secondary" style={{ padding: '4px 10px' }}>
                          Manage
                        </Link>
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
  );
};
