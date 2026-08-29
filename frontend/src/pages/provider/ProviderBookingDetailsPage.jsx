import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { BookingTimeline } from '../../components/booking/BookingTimeline';
import { MapView } from '../../components/map/MapView';
import { LoadingSpinner, ErrorMessage } from '../../components/common/FeedbackStates';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Calendar, Clock, Check, X, PlayCircle, Phone, Mail, MapPin, CreditCard, ChevronRight } from 'lucide-react';

export const ProviderBookingDetailsPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchBooking = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getBookingById(bookingId);
      setBooking(data);
    } catch (err) {
      setError(err.message || 'Job not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const handleUpdateStatus = async (newStatus) => {
    setActionLoading(true);
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus);
      fetchBooking();
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading job dispatch details..." />;
  if (error || !booking) {
    return (
      <div className="container section-py">
        <ErrorMessage message={error || 'Job not found'} onRetry={() => navigate('/provider/requests')} />
      </div>
    );
  }

  return (
    <div className="provider-booking-details-page">
      <DashboardHeader
        title={`Job Dispatch #${booking.id}`}
        subtitle="Manage service execution, progress milestones, and customer address coordination."
      />

      <div className="dashboard-content">
        {/* Top Status & Quick Action Header */}
        <div className="card mb-6" style={{ padding: '1.5rem' }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                  {booking.serviceName}
                </h2>
                <StatusBadge status={booking.status} />
              </div>
              <p className="text-xs text-muted flex items-center gap-1 flex-wrap">
                <span>Customer: <strong>{booking.customerName}</strong> ({booking.customerPhone})</span>
                <span>•</span>
                <Calendar size={12} color="var(--primary-700)" />
                <span><strong>{formatDate(booking.date)} at {booking.time}</strong></span>
              </p>
            </div>

            {/* Lifecycle Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {booking.status === 'PENDING' && (
                <>
                  <button
                    type="button"
                    className="btn btn-sm btn-success flex items-center gap-1"
                    onClick={() => handleUpdateStatus('CONFIRMED')}
                    disabled={actionLoading}
                  >
                    <Check size={14} />
                    <span>Accept Job</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary flex items-center gap-1"
                    style={{ color: 'var(--danger-600)' }}
                    onClick={() => handleUpdateStatus('CANCELLED')}
                    disabled={actionLoading}
                  >
                    <X size={14} />
                    <span>Decline Job</span>
                  </button>
                </>
              )}

              {booking.status === 'CONFIRMED' && (
                <button
                  type="button"
                  className="btn btn-sm btn-primary flex items-center gap-1"
                  onClick={() => handleUpdateStatus('IN_PROGRESS')}
                  disabled={actionLoading}
                >
                  <PlayCircle size={14} />
                  <span>Arrived & Start Work</span>
                </button>
              )}

              {booking.status === 'IN_PROGRESS' && (
                <button
                  type="button"
                  className="btn btn-sm btn-success flex items-center gap-1"
                  onClick={() => handleUpdateStatus('COMPLETED')}
                  disabled={actionLoading}
                >
                  <Check size={14} />
                  <span>Mark Work Completed</span>
                </button>
              )}

              <Link to="/provider/requests" className="btn btn-sm btn-secondary">
                Back to Requests
              </Link>
            </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          {/* Left Column: Customer & Location */}
          <div className="flex flex-col gap-6">
            
            {/* Customer Details */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--neutral-200)', paddingBottom: '0.5rem' }}>
                Customer & Contact
              </h4>

              <div className="flex flex-col gap-3 text-sm">
                <div>
                  <span className="text-muted block text-xs">Customer Name</span>
                  <strong style={{ color: 'var(--neutral-900)' }}>{booking.customerName}</strong>
                </div>

                <div>
                  <span className="text-muted block text-xs">Direct Phone</span>
                  <a href={`tel:${booking.customerPhone}`} className="font-bold flex items-center gap-1" style={{ color: 'var(--primary-700)' }}>
                    <Phone size={13} />
                    <span>{booking.customerPhone}</span>
                  </a>
                </div>

                <div>
                  <span className="text-muted block text-xs">Email</span>
                  <span className="flex items-center gap-1">
                    <Mail size={13} color="var(--neutral-500)" />
                    <span>{booking.customerEmail}</span>
                  </span>
                </div>

                {booking.description && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <span className="text-muted block text-xs font-semibold">Problem Reported by Customer:</span>
                    <p className="text-xs text-muted" style={{ backgroundColor: 'var(--neutral-50)', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', marginTop: '4px' }}>
                      "{booking.description}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Location & Map */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Service Destination
              </h4>
              <p className="text-xs text-muted mb-3 flex items-center gap-1">
                <MapPin size={13} color="var(--primary-700)" />
                <span>{booking.address?.flat ? `${booking.address.flat}, ${booking.address.street}, ${booking.address.city} - ${booking.address.pincode}` : 'Mumbai'}</span>
              </p>

              <div style={{ height: '220px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <MapView
                  locations={[{ id: 1, name: 'Customer Destination', latitude: booking.latitude || 19.1294, longitude: booking.longitude || 72.8752, service: booking.categoryName, verified: true }]}
                  center={{ latitude: booking.latitude || 19.1294, longitude: booking.longitude || 72.8752, city: booking.address?.city || 'Mumbai' }}
                  customerLocation={{ latitude: booking.latitude || 19.1294, longitude: booking.longitude || 72.8752 }}
                  height="220px"
                  showServiceRadius={false}
                  interactive={false}
                />
              </div>
            </div>

          </div>

          {/* Right Column: Timeline & Payout */}
          <div className="flex flex-col gap-6">
            
            {/* Timeline */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                Milestone Timeline
              </h4>

              <BookingTimeline timeline={booking.timeline} currentStatus={booking.status} />
            </div>

            {/* Payout Summary */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--neutral-200)', paddingBottom: '0.5rem' }}>
                Partner Earnings & Invoice
              </h4>

              <div className="flex flex-col gap-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted">Standard Labor Fee:</span>
                  <span>{formatCurrency(booking.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">GST Collected:</span>
                  <span>{formatCurrency(booking.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Platform Partner Fee:</span>
                  <span style={{ color: 'var(--success-700)', fontWeight: 700 }}>0% (Promotional Free)</span>
                </div>

                <div
                  style={{
                    borderTop: '2px dashed var(--neutral-300)',
                    paddingTop: '0.75rem',
                    marginTop: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <span className="font-bold">Total Payout on Completion:</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success-700)' }}>
                    {formatCurrency(booking.price)}
                  </span>
                </div>
              </div>

              <div
                style={{
                  padding: '10px',
                  backgroundColor: 'var(--neutral-50)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '11px',
                  color: 'var(--neutral-600)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CreditCard size={14} color="var(--primary-700)" />
                <span>Collect payment directly via UPI or Cash from customer after work completion.</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
