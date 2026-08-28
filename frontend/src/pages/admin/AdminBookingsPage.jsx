import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { adminService } from '../../services/adminService';
import { StatusBadge } from '../../components/common/StatusBadge';

export const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
      setError('Unable to fetch bookings from backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    if (processingId) return;
    try {
      setProcessingId(bookingId);
      setActionSuccess(null);
      const updated = await adminService.updateBookingStatus(bookingId, newStatus);
      setActionSuccess(`Booking #${updated.id} (${updated.bookingReference}) status updated to ${updated.status}.`);
      await fetchBookings();
    } catch (err) {
      alert('Status update failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'ALL') return true;
    return b.status === statusFilter;
  });

  return (
    <div className="admin-bookings-page">
      <DashboardHeader
        title="Platform Bookings Monitor"
        subtitle="Oversight of customer bookings, lifecycle status updates, and provider assignments."
      />

      <div className="dashboard-content">
        <div className="container" style={{ maxWidth: '1200px' }}>
          {actionSuccess && (
            <div className="alert alert-success mb-4" role="alert">
              ✓ {actionSuccess}
            </div>
          )}

          {error && (
            <div className="alert alert-danger mb-4" role="alert">
              ⚠️ {error}
            </div>
          )}

          {/* Filter Bar */}
          <div className="card p-3 mb-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm">Status Filter:</span>
              {['ALL', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((st) => (
                <button
                  key={st}
                  className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setStatusFilter(st)}
                >
                  {st}
                </button>
              ))}
            </div>

            <button className="btn btn-sm btn-outline-primary" onClick={fetchBookings}>
              🔄 Refresh List
            </button>
          </div>

          {/* Bookings Table */}
          <div className="card p-0 overflow-hidden">
            {loading ? (
              <div className="p-5 text-center">
                <div className="spinner-border text-primary mb-2" role="status" />
                <p className="text-muted">Loading bookings from backend...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="p-5 text-center text-muted">No bookings match selected filter.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: 'var(--neutral-100)', borderBottom: '1px solid var(--neutral-200)' }}>
                    <tr>
                      <th style={{ padding: '0.75rem 1rem' }}>Ref / ID</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Service</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Customer</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Assigned Provider</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Amount</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b) => (
                      <tr key={b.id} style={{ borderBottom: '1px solid var(--neutral-200)' }}>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div className="font-bold text-neutral-900">{b.bookingReference || `#${b.id}`}</div>
                          <div className="text-xs text-muted">ID #{b.id}</div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>
                          {b.serviceName || 'Home Service'}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div className="text-sm font-semibold">{b.customerName}</div>
                          <div className="text-xs text-muted">{b.customerEmail}</div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          {b.providerBusinessName ? (
                            <div className="text-sm font-semibold text-neutral-900">{b.providerBusinessName}</div>
                          ) : (
                            <span className="text-xs text-muted">Unassigned</span>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary-700)' }}>
                          ₹{b.totalAmount}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <StatusBadge status={b.status} />
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                          {b.status !== 'COMPLETED' && b.status !== 'CANCELLED' && (
                            <div className="flex items-center justify-end gap-1">
                              {b.status === 'PENDING' && (
                                <button
                                  className="btn btn-xs btn-outline-success"
                                  disabled={processingId === b.id}
                                  onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')}
                                >
                                  Confirm
                                </button>
                              )}
                              {b.status === 'CONFIRMED' && (
                                <button
                                  className="btn btn-xs btn-outline-info"
                                  disabled={processingId === b.id}
                                  onClick={() => handleUpdateStatus(b.id, 'IN_PROGRESS')}
                                >
                                  Start Job
                                </button>
                              )}
                              {b.status === 'IN_PROGRESS' && (
                                <button
                                  className="btn btn-xs btn-success"
                                  disabled={processingId === b.id}
                                  onClick={() => handleUpdateStatus(b.id, 'COMPLETED')}
                                >
                                  Complete
                                </button>
                              )}
                              <button
                                className="btn btn-xs btn-outline-danger"
                                disabled={processingId === b.id}
                                onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                              >
                                Cancel
                              </button>
                            </div>
                          )}
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
    </div>
  );
};
