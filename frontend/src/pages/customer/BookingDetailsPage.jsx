import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { reviewService } from '../../services/reviewService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { BookingTimeline } from '../../components/booking/BookingTimeline';
import { MapView } from '../../components/map/MapView';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { LoadingSpinner, ErrorMessage } from '../../components/common/FeedbackStates';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CheckCircle2, Star, Calendar, Clock, MapPin, ShieldCheck, ChevronRight } from 'lucide-react';

export const BookingDetailsPage = () => {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const isNewSuccess = searchParams.get('success') === 'true';

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const navigate = useNavigate();

  const fetchBooking = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getBookingById(bookingId);
      setBooking(data);
    } catch (err) {
      setError(err.message || 'Booking not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const handleCancelBooking = async () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      await bookingService.cancelBooking(bookingId);
      fetchBooking();
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await reviewService.createReview({
        bookingId: booking.id,
        providerId: booking.providerId,
        rating,
        comment,
        customerName: booking.customerName,
        serviceName: booking.serviceName
      });
      setReviewModalOpen(false);
      fetchBooking();
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading booking details..." />;
  if (error || !booking) {
    return (
      <div className="container section-py">
        <ErrorMessage message={error || 'Booking not found'} onRetry={() => navigate('/customer/bookings')} />
      </div>
    );
  }

  return (
    <div className="booking-details-page" style={{ padding: '2rem 0 4rem 0' }}>
      <div className="container">
        
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--neutral-500)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Link to="/customer/dashboard">Dashboard</Link>
          <ChevronRight size={14} />
          <Link to="/customer/bookings">My Bookings</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--neutral-800)', fontWeight: 600 }}>#{booking.id}</span>
        </nav>

        {/* Success Confirmation Banner */}
        {isNewSuccess && (
          <div className="alert alert-success mb-6">
            <CheckCircle2 size={22} style={{ flexShrink: 0 }} />
            <div>
              <h5 style={{ fontWeight: 800, margin: 0 }}>Booking Confirmed Successfully!</h5>
              <p className="text-xs" style={{ margin: 0, marginTop: '2px' }}>
                Your service appointment has been dispatched to <strong>{booking.providerName}</strong>. You will receive an SMS reminder prior to arrival.
              </p>
            </div>
          </div>
        )}

        {/* Top Header Card */}
        <div className="card mb-6" style={{ padding: '1.5rem' }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--neutral-900)', margin: 0 }}>
                  Booking #{booking.id}
                </h1>
                <StatusBadge status={booking.status} />
              </div>
              <p className="text-xs text-muted">
                Created on {formatDate(booking.createdAt)} • Payment: <strong>{booking.paymentStatus === 'PAID' ? 'Paid Online' : 'Pay Post Service (Cash/UPI)'}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {booking.status === 'PENDING' && (
                <button onClick={handleCancelBooking} className="btn btn-sm btn-secondary" style={{ color: 'var(--danger-600)' }}>
                  Cancel Appointment
                </button>
              )}

              {booking.status === 'COMPLETED' && !booking.hasReview && (
                <button onClick={() => setReviewModalOpen(true)} className="btn btn-sm btn-success flex items-center gap-1">
                  <Star size={13} fill="currentColor" />
                  <span>Leave Review</span>
                </button>
              )}

              <Link to="/customer/browse" className="btn btn-sm btn-primary">
                Book Another Service
              </Link>
            </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          {/* Left Column: Details & Address & Location Preview */}
          <div className="flex flex-col gap-6">
            
            {/* Service & Provider Details */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--neutral-200)', paddingBottom: '0.5rem' }}>
                Service & Assigned Provider
              </h4>

              <div className="flex items-start gap-4 mb-4">
                <img
                  src={booking.providerAvatar}
                  alt={booking.providerName}
                  style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-lg)', objectFit: 'cover' }}
                />
                <div className="flex-1">
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                    {booking.serviceName}
                  </h4>
                  <p className="text-xs text-muted font-semibold" style={{ color: 'var(--primary-700)', marginTop: '2px' }}>
                    Assigned: {booking.providerName}
                  </p>
                  <p className="text-xs text-muted">
                    Phone: {booking.providerPhone}
                  </p>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--neutral-50)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  fontSize: '0.85rem',
                }}
              >
                <div className="flex items-center gap-2">
                  <Calendar size={14} color="var(--primary-700)" />
                  <div>
                    <span className="text-muted block text-2xs">Scheduled Date</span>
                    <strong>{formatDate(booking.date)}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={14} color="var(--primary-700)" />
                  <div>
                    <span className="text-muted block text-2xs">Scheduled Time</span>
                    <strong>{booking.time}</strong>
                  </div>
                </div>
              </div>

              {booking.description && (
                <div style={{ marginTop: '1rem' }}>
                  <span className="text-xs text-muted block font-semibold mb-1">Customer Notes:</span>
                  <p className="text-xs text-muted" style={{ backgroundColor: 'var(--white)', border: '1px solid var(--neutral-200)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                    "{booking.description}"
                  </p>
                </div>
              )}
            </div>

            {/* Service Location with Mock Map Preview */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Service Location & Address
              </h4>
              <p className="text-xs text-muted mb-3 flex items-center gap-1">
                <MapPin size={13} color="var(--primary-700)" />
                <span>{booking.address?.flat ? `${booking.address.flat}, ${booking.address.street}, ${booking.address.city} - ${booking.address.pincode}` : 'Mumbai'}</span>
              </p>

              <div style={{ height: '220px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <MapView
                  locations={[{ id: 1, name: 'Service Location', latitude: booking.latitude || 19.1294, longitude: booking.longitude || 72.8752, service: booking.categoryName, verified: true }]}
                  center={{ latitude: booking.latitude || 19.1294, longitude: booking.longitude || 72.8752, city: booking.address?.city || 'Mumbai' }}
                  customerLocation={{ latitude: booking.latitude || 19.1294, longitude: booking.longitude || 72.8752 }}
                  height="220px"
                  showServiceRadius={false}
                  interactive={false}
                />
              </div>
            </div>

          </div>

          {/* Right Column: Timeline & Financial Invoice */}
          <div className="flex flex-col gap-6">
            
            {/* Live Progress Timeline */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                Appointment Timeline
              </h4>

              <BookingTimeline timeline={booking.timeline} currentStatus={booking.status} />
            </div>

            {/* Price & Billing Summary */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--neutral-200)', paddingBottom: '0.5rem' }}>
                Payment & Price Breakdown
              </h4>

              <div className="flex flex-col gap-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted">Standard Labor Charge:</span>
                  <span>{formatCurrency(booking.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">GST (18%):</span>
                  <span>{formatCurrency(booking.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Safety Inspection Fee:</span>
                  <span style={{ color: 'var(--success-700)', fontWeight: 700 }}>FREE</span>
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
                  <span className="font-bold">Total Amount:</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                    {formatCurrency(booking.totalPrice || booking.price)}
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
                <ShieldCheck size={14} color="var(--success-600)" />
                <span>Covered by TrustFix 30-Day Post-Service Guarantee. No advance payment required.</span>
              </div>
            </div>

          </div>

        </div>

        {/* Review Modal */}
        <Modal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          title={`Rate & Review (${booking.serviceName})`}
          footer={
            <>
              <Button variant="secondary" onClick={() => setReviewModalOpen(false)}>Cancel</Button>
              <Button variant="primary" loading={submittingReview} onClick={handleSubmitReview}>
                Submit Verified Review
              </Button>
            </>
          }
        >
          <div className="form-group mb-4">
            <label className="form-label">Select Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: star <= rating ? '#F59E0B' : 'var(--neutral-300)',
                  }}
                >
                  <Star size={24} fill={star <= rating ? '#F59E0B' : 'none'} color="#F59E0B" />
                </button>
              ))}
              <span className="font-bold text-sm ml-2">({rating} / 5 Stars)</span>
            </div>
          </div>

          <div className="form-group mb-0">
            <label className="form-label">Review Comments</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Tell others how the technician handled the service, punctuality, and cleanliness..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>
        </Modal>

      </div>
    </div>
  );
};
