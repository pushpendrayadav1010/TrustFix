import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner, EmptyState } from '../../components/common/FeedbackStates';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Inbox,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  ArrowRight,
  User,
  AlertCircle
} from 'lucide-react';

export const BookingRequestsPage = () => {
  const { providerProfile } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchRequests = async () => {
    if (!providerProfile?.id) return;
    setLoading(true);
    try {
      const data = await bookingService.getProviderBookings(providerProfile.id);
      setRequests(data);
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [providerProfile?.id]);

  const handleUpdateStatus = async (id, status) => {
    setActionLoadingId(id);
    try {
      await bookingService.updateBookingStatus(id, status);
      await fetchRequests();
    } catch (err) {
      alert(err.message || `Failed to update status to ${status}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const otherRequests = requests.filter(r => r.status !== 'PENDING');

  return (
    <div>
      <DashboardHeader
        title="Booking Requests"
        subtitle="Review new incoming service dispatches and appointment requests."
      />

      <div className="dashboard-content">
        
        {/* Pending Requests Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--neutral-900)' }}>
              Action Required ({pendingRequests.length})
            </h4>
            <span className="text-xs text-muted font-medium">Accept to add to your daily visit schedule</span>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading incoming booking requests..." />
          ) : pendingRequests.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No pending requests right now"
              description="Keep your status toggled to ONLINE to receive incoming service dispatches from nearby homeowners."
            />
          ) : (
            <div className="flex flex-col gap-4">
              {pendingRequests.map((r) => (
                <div
                  key={r.id}
                  className="card"
                  style={{
                    padding: '1.5rem',
                    backgroundColor: 'var(--white)',
                    border: '2px solid var(--primary-200)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div className="flex items-start justify-between flex-wrap gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="badge badge-pending">New Dispatch</span>
                        <span className="text-2xs font-mono text-muted">REF: {r.bookingReference}</span>
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--neutral-900)' }}>
                        {r.serviceName}
                      </h3>
                      <p className="text-xs text-muted">
                        Customer: <strong style={{ color: 'var(--neutral-800)' }}>{r.customerName}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-2xs text-muted uppercase font-bold block">Estimated Payout</span>
                      <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                        {formatCurrency(r.price || 499)}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '10px',
                      backgroundColor: 'var(--neutral-50)',
                      padding: '0.875rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--neutral-200)',
                      marginBottom: '1rem',
                      fontSize: '0.8125rem',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar size={15} color="var(--primary-700)" />
                      <span><strong>Date:</strong> {formatDate(r.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={15} color="var(--primary-700)" />
                      <span><strong>Slot:</strong> {r.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={15} color="var(--primary-700)" />
                      <span className="text-truncate"><strong>Area:</strong> {r.address?.flat ? `${r.address.flat}, ${r.address.city}` : (r.address?.city || 'Mumbai')}</span>
                    </div>
                  </div>

                  {r.notes && (
                    <div className="mb-3 text-xs text-muted">
                      <strong>Customer Notes:</strong> "{r.notes}"
                    </div>
                  )}

                  <div className="flex items-center justify-between flex-wrap gap-2 pt-3 border-top" style={{ borderTop: '1px solid var(--neutral-200)' }}>
                    <Link to={`/provider/bookings/${r.id}`} className="text-xs font-semibold" style={{ color: 'var(--primary-700)' }}>
                      View Complete Job Card & Map
                    </Link>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={actionLoadingId === r.id}
                        onClick={() => handleUpdateStatus(r.id, 'CANCELLED')}
                      >
                        <XCircle size={13} />
                        <span>Decline</span>
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        loading={actionLoadingId === r.id}
                        onClick={() => handleUpdateStatus(r.id, 'CONFIRMED')}
                      >
                        <CheckCircle2 size={13} />
                        <span>Accept Request</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Previous Handled Requests */}
        {otherRequests.length > 0 && (
          <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--white)' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Handled Requests History
            </h4>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Service & Ref</th>
                    <th>Customer</th>
                    <th>Scheduled Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {otherRequests.slice(0, 10).map((r) => (
                    <tr key={r.id}>
                      <td>
                        <strong className="text-sm block">{r.serviceName}</strong>
                        <span className="text-2xs text-muted font-mono">{r.bookingReference}</span>
                      </td>
                      <td>{r.customerName}</td>
                      <td>{formatDate(r.date)} ({r.time})</td>
                      <td><strong>{formatCurrency(r.price || 499)}</strong></td>
                      <td><StatusBadge status={r.status} /></td>
                      <td className="text-right">
                        <Link to={`/provider/bookings/${r.id}`} className="btn btn-sm btn-secondary" style={{ padding: '4px 10px' }}>
                          Details
                        </Link>
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
