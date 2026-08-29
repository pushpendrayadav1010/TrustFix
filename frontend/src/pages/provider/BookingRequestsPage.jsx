import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import { providerService } from '../../services/providerService';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { BookingCard } from '../../components/booking/BookingCard';
import { LoadingSpinner, EmptyState } from '../../components/common/FeedbackStates';
import { Inbox, AlertCircle, Check, X } from 'lucide-react';

export const BookingRequestsPage = () => {
  const { user, providerProfile, updateProvider } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let activeProfile = providerProfile;
      if (!activeProfile && user?.id) {
        activeProfile = await providerService.getProviderByUserId(user.id);
        updateProvider(activeProfile);
      }

      if (activeProfile?.id) {
        const data = await bookingService.getProviderBookings(activeProfile.id, statusFilter);
        setBookings(data);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error('Failed to fetch provider bookings:', err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user, providerProfile?.id, statusFilter]);

  const handleAccept = async (id) => {
    if (processingId) return;
    try {
      setProcessingId(id);
      await bookingService.updateBookingStatus(id, 'CONFIRMED');
      await fetchBookings();
    } catch (err) {
      console.error('Error confirming booking:', err);
      alert('Failed to accept booking: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    if (processingId) return;
    try {
      setProcessingId(id);
      await bookingService.updateBookingStatus(id, 'CANCELLED');
      await fetchBookings();
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to decline booking: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessingId(null);
    }
  };

  const tabs = [
    { key: 'ALL', label: 'All Jobs' },
    { key: 'PENDING', label: 'Pending Requests' },
    { key: 'CONFIRMED', label: 'Confirmed / Scheduled' },
    { key: 'IN_PROGRESS', label: 'In Progress' },
    { key: 'COMPLETED', label: 'Completed' },
  ];

  return (
    <div className="booking-requests-page">
      <DashboardHeader
        title="Booking Requests & Jobs"
        subtitle="Manage customer appointment dispatches, scheduling, and job completion lifecycles."
      />

      <div className="dashboard-content">
        {/* Filter Tabs */}
        <div className="card mb-6" style={{ padding: '0.5rem' }}>
          <div className="flex items-center gap-2 flex-wrap">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`btn btn-sm ${statusFilter === t.key ? 'btn-primary' : 'btn-light'}`}
                onClick={() => setStatusFilter(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching job appointments..." />
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No job bookings in this category"
            description="Incoming service appointments will appear here."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((b) => (
              <div key={b.id} className="relative">
                <BookingCard booking={b} role="PROVIDER" />

                {b.status === 'PENDING' && (
                  <div
                    style={{
                      marginTop: '-12px',
                      marginBottom: '16px',
                      padding: '10px 16px',
                      backgroundColor: 'var(--warning-50)',
                      border: '1px solid var(--warning-100)',
                      borderRadius: '0 0 var(--radius-md) var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <span className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--warning-700)' }}>
                      <AlertCircle size={14} />
                      Action Needed: Customer is awaiting your confirmation for {b.date} at {b.time}.
                    </span>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-success flex items-center gap-1"
                        disabled={processingId === b.id}
                        onClick={() => handleAccept(b.id)}
                      >
                        <Check size={14} />
                        <span>{processingId === b.id ? 'Processing...' : 'Accept & Confirm'}</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary flex items-center gap-1"
                        style={{ color: 'var(--danger-600)' }}
                        disabled={processingId === b.id}
                        onClick={() => handleReject(b.id)}
                      >
                        <X size={14} />
                        <span>Decline</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
