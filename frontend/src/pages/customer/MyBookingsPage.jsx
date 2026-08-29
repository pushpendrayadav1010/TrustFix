import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import { reviewService } from '../../services/reviewService';
import { BookingCard } from '../../components/booking/BookingCard';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { LoadingSpinner, EmptyState } from '../../components/common/FeedbackStates';
import { Calendar, Star } from 'lucide-react';

export const MyBookingsPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Cancel Modal State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const customerId = user?.id || 4;
      const data = await bookingService.getCustomerBookings(customerId, statusFilter);
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user, statusFilter]);

  const handleOpenReview = (booking) => {
    setSelectedBookingForReview(booking);
    setReviewRating(5);
    setReviewComment('');
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedBookingForReview) return;

    setReviewSubmitting(true);
    try {
      await reviewService.createReview({
        bookingId: selectedBookingForReview.id,
        providerId: selectedBookingForReview.providerId,
        rating: reviewRating,
        comment: reviewComment,
        customerName: user?.name || "Customer",
        serviceName: selectedBookingForReview.serviceName
      });
      setReviewModalOpen(false);
      fetchBookings();
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    await bookingService.cancelBooking(bookingToCancel);
    setCancelModalOpen(false);
    setBookingToCancel(null);
    fetchBookings();
  };

  const filterTabs = [
    { key: 'ALL', label: 'All Orders' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'CONFIRMED', label: 'Confirmed' },
    { key: 'IN_PROGRESS', label: 'In Progress' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div className="my-bookings-page" style={{ padding: '2rem 0 4rem 0' }}>
      <div className="container">
        
        {/* Header */}
        <div className="mb-6">
          <span className="section-subtitle">Customer Activity</span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--neutral-900)', margin: 0 }}>
            My Service Bookings
          </h1>
          <p className="text-xs text-muted">Track appointment progress, technician dispatches, and review past completed services.</p>
        </div>

        {/* Filter Tabs */}
        <div className="card mb-6" style={{ padding: '0.5rem' }}>
          <div className="flex items-center gap-2 flex-wrap">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`btn btn-sm ${statusFilter === tab.key ? 'btn-primary' : 'btn-light'}`}
                onClick={() => setStatusFilter(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <LoadingSpinner message="Fetching your service history..." />
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title={`No ${statusFilter !== 'ALL' ? statusFilter.toLowerCase() : ''} bookings found`}
            description="You don't have any service appointments under this filter."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                role="CUSTOMER"
                onReview={handleOpenReview}
                onCancel={(id) => { setBookingToCancel(id); setCancelModalOpen(true); }}
              />
            ))}
          </div>
        )}

        {/* Review Modal */}
        <Modal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          title={`Rate & Review Service (${selectedBookingForReview?.serviceName})`}
          footer={
            <>
              <Button variant="secondary" onClick={() => setReviewModalOpen(false)}>Cancel</Button>
              <Button variant="primary" loading={reviewSubmitting} onClick={handleSubmitReview}>
                Submit Review
              </Button>
            </>
          }
        >
          <div className="form-group mb-4">
            <label className="form-label">Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: star <= reviewRating ? '#F59E0B' : 'var(--neutral-300)',
                  }}
                >
                  <Star size={24} fill={star <= reviewRating ? '#F59E0B' : 'none'} color="#F59E0B" />
                </button>
              ))}
              <span className="font-bold text-sm ml-2">({reviewRating} / 5 Stars)</span>
            </div>
          </div>

          <div className="form-group mb-0">
            <label className="form-label">Your Feedback / Experience</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Share details about the technician's punctuality, work quality, and cleanliness..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              required
            />
          </div>
        </Modal>

        {/* Cancel Confirmation Modal */}
        <Modal
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          title="Cancel Service Booking"
          footer={
            <>
              <Button variant="secondary" onClick={() => setCancelModalOpen(false)}>Keep Booking</Button>
              <Button variant="danger" onClick={handleConfirmCancel}>Confirm Cancellation</Button>
            </>
          }
        >
          <p className="text-sm text-neutral-700">
            Are you sure you want to cancel booking <strong>#{bookingToCancel}</strong>? There are no cancellation penalties on TrustFix.
          </p>
        </Modal>

      </div>
    </div>
  );
};
