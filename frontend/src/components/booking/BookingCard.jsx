import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const BookingCard = ({ booking, onCancel, onReview, role = 'CUSTOMER' }) => {
  return (
    <div className="card card-hoverable mb-4">
      <div className="card-header">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm" style={{ color: 'var(--primary-800)' }}>
            #{booking.id}
          </span>
          <span className="text-xs text-muted">
            Booked on {formatDate(booking.createdAt)}
          </span>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="card-body">
        <div className="grid grid-cols-1" style={{ gap: '1rem' }}>
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <img
                src={booking.providerAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                alt={booking.providerName}
                style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--neutral-900)' }}>
                  {booking.serviceName}
                </h4>
                <p className="text-xs text-muted">
                  {role === 'CUSTOMER' ? `Provider: ${booking.providerName}` : `Customer: ${booking.customerName}`}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-muted block">Total Estimated</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                {formatCurrency(booking.totalPrice || booking.price)}
              </span>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--neutral-50)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.5rem',
              fontSize: '0.8125rem',
              color: 'var(--neutral-700)',
            }}
          >
            <div>
              <span className="text-muted block text-xs">Date & Time</span>
              <strong>📅 {formatDate(booking.date)} at {booking.time}</strong>
            </div>

            <div className="flex-1 min-w-[200px]">
              <span className="text-muted block text-xs">Service Address</span>
              <span className="text-truncate block">
                📍 {booking.address?.flat ? `${booking.address.flat}, ${booking.address.street}` : booking.address?.city || 'Mumbai'}
              </span>
            </div>
          </div>

          {booking.description && (
            <p className="text-xs text-muted italic">
              "{booking.description}"
            </p>
          )}
        </div>
      </div>

      <div className="card-footer flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-xs text-muted">
          <span>Payment: <strong>{booking.paymentStatus === 'PAID' ? 'Paid ✓' : 'Pay Post Service'}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          {role === 'CUSTOMER' && booking.status === 'COMPLETED' && !booking.hasReview && (
            <button
              onClick={() => onReview && onReview(booking)}
              className="btn btn-sm btn-success"
            >
              ★ Write Review
            </button>
          )}

          {booking.status === 'PENDING' && onCancel && (
            <button
              onClick={() => onCancel(booking.id)}
              className="btn btn-sm btn-secondary"
              style={{ color: 'var(--danger-600)' }}
            >
              Cancel Booking
            </button>
          )}

          <Link
            to={role === 'PROVIDER' ? `/provider/bookings/${booking.id}` : `/customer/bookings/${booking.id}`}
            className="btn btn-sm btn-primary"
          >
            View Details & Timeline →
          </Link>
        </div>
      </div>
    </div>
  );
};
