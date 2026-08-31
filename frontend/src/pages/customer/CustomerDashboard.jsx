import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import { userService } from '../../services/userService';
import { providerService } from '../../services/providerService';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { StatCard } from '../../components/dashboard/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { VerificationBadge } from '../../components/common/VerificationBadge';
import { ProviderCard } from '../../components/provider/ProviderCard';
import { LoadingSpinner, EmptyState } from '../../components/common/FeedbackStates';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Calendar,
  CheckCircle2,
  MapPin,
  Clock,
  ArrowRight,
  Zap,
  Wrench,
  Sparkles,
  Snowflake,
  ShieldCheck,
  Plus,
  Inbox,
  User,
  Star
} from 'lucide-react';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [recommendedProviders, setRecommendedProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;
      try {
        const [userBookings, userAddrs, topProvs] = await Promise.all([
          bookingService.getCustomerBookings(user.id),
          userService.getAddresses(user.id),
          providerService.getFeaturedProviders()
        ]);
        setBookings(userBookings);
        setAddresses(userAddrs);
        setRecommendedProviders(topProvs.slice(0, 3));
      } catch (err) {
        console.error('Error fetching customer dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user?.id]);

  const upcomingBookings = bookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS');
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');
  const nextAppointment = upcomingBookings[0] || null;

  const quickCategories = [
    { name: 'Electrical', icon: Zap, bg: 'var(--primary-100)', color: 'var(--primary-800)', link: '/services?category=Electrical' },
    { name: 'Plumbing', icon: Wrench, bg: 'var(--info-100)', color: 'var(--info-800)', link: '/services?category=Plumbing' },
    { name: 'Cleaning', icon: Sparkles, bg: 'var(--success-100)', color: 'var(--success-800)', link: '/services?category=Cleaning' },
    { name: 'AC Repair', icon: Snowflake, bg: 'var(--warning-100)', color: 'var(--warning-800)', link: '/services?category=AC%20Repair' },
  ];

  if (loading) {
    return (
      <div>
        <DashboardHeader title="Dashboard" subtitle="Loading your account..." />
        <div className="dashboard-content">
          <LoadingSpinner message="Fetching dashboard metrics..." />
        </div>
      </div>
    );
  }

  const firstName = user?.name ? user.name.split(' ')[0] : 'Customer';

  return (
    <div>
      <DashboardHeader
        title={`Good morning, ${firstName}`}
        subtitle="Manage your services, bookings and trusted professionals."
      />

      <div className="dashboard-content">
        
        {/* TOP KPI ROW */}
        <div className="grid grid-cols-1 mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <StatCard
            title="Upcoming Bookings"
            value={upcomingBookings.length}
            subtitle={upcomingBookings.length > 0 ? "Scheduled technician visits" : "No pending visits"}
            icon={<Calendar size={20} />}
            color="primary"
          />
          <StatCard
            title="Completed Services"
            value={completedBookings.length}
            subtitle="Verified doorstep repairs"
            icon={<CheckCircle2 size={20} />}
            color="success"
          />
          <StatCard
            title="Saved Addresses"
            value={addresses.length}
            subtitle="Configured delivery locations"
            icon={<MapPin size={20} />}
            color="info"
          />
        </div>

        {/* TWO-COLUMN SECTION: UPCOMING APPOINTMENT (~65%) + QUICK BOOK (~35%) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.8fr) minmax(300px, 1fr)',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
          className="dashboard-two-col"
        >
          {/* LEFT: UPCOMING APPOINTMENT */}
          <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--white)' }}>
            <div className="flex items-center justify-between mb-4 pb-3 border-bottom" style={{ borderBottom: '1px solid var(--neutral-200)' }}>
              <div className="flex items-center gap-2">
                <Calendar size={18} color="var(--primary-700)" />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Upcoming Appointment</h4>
              </div>
              {nextAppointment && <StatusBadge status={nextAppointment.status} />}
            </div>

            {nextAppointment ? (
              <div>
                <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--neutral-900)', marginBottom: '4px' }}>
                      {nextAppointment.serviceName}
                    </h3>
                    <p className="text-xs text-muted">
                      Ref: <strong>{nextAppointment.bookingReference}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted block">Total Estimated Amount</span>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                      {formatCurrency(nextAppointment.price || nextAppointment.totalPrice || 499)}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '12px',
                    backgroundColor: 'var(--neutral-50)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--neutral-200)',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Clock size={16} color="var(--primary-700)" />
                    <div>
                      <span className="text-2xs text-muted block">Scheduled Date & Time</span>
                      <strong className="text-xs">{formatDate(nextAppointment.date)} at {nextAppointment.time}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <User size={16} color="var(--primary-700)" />
                    <div>
                      <span className="text-2xs text-muted block">Assigned Provider</span>
                      <strong className="text-xs">{nextAppointment.providerName || 'Assigned Specialist'}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin size={16} color="var(--primary-700)" />
                    <div>
                      <span className="text-2xs text-muted block">Service Address</span>
                      <strong className="text-xs text-truncate">{nextAppointment.address?.flat ? `${nextAppointment.address.flat}, ${nextAppointment.address.city}` : (nextAppointment.address?.city || 'Mumbai')}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs text-muted flex items-center gap-1">
                    <ShieldCheck size={14} color="var(--success-600)" />
                    <span>₹0 advance required • Pay after service</span>
                  </span>
                  <Link to={`/customer/bookings/${nextAppointment.id}`} className="btn btn-sm btn-primary">
                    <span>View Booking Details</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-100)',
                    color: 'var(--primary-700)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px auto',
                  }}
                >
                  <Calendar size={24} />
                </div>
                <h5 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>No upcoming appointments</h5>
                <p className="text-xs text-muted mb-4">Book verified electricians, plumbers, and cleaners right now.</p>
                <Link to="/customer/browse" className="btn btn-sm btn-primary">
                  <Plus size={14} />
                  <span>Book a New Service</span>
                </Link>
              </div>
            )}
          </div>

          {/* RIGHT: QUICK BOOK */}
          <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--white)' }}>
            <div className="flex items-center justify-between mb-4 pb-3 border-bottom" style={{ borderBottom: '1px solid var(--neutral-200)' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Quick Book</h4>
              <Link to="/services" className="text-xs font-semibold" style={{ color: 'var(--primary-700)' }}>
                View Catalog
              </Link>
            </div>

            <p className="text-xs text-muted mb-4">
              Select a popular category for rapid doorstep scheduling:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {quickCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.name}
                    to={cat.link}
                    className="card card-hoverable"
                    style={{
                      padding: '1rem',
                      textDecoration: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      backgroundColor: 'var(--neutral-50)',
                      border: '1px solid var(--neutral-200)',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: cat.bg,
                        color: cat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <Icon size={20} strokeWidth={2.2} />
                    </div>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--neutral-900)' }}>
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* RECENT BOOKINGS SECTION */}
        <div className="card mb-8" style={{ padding: '1.5rem', backgroundColor: 'var(--white)' }}>
          <div className="flex items-center justify-between mb-4 pb-3 border-bottom" style={{ borderBottom: '1px solid var(--neutral-200)' }}>
            <div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Recent Bookings</h4>
              <span className="text-xs text-muted">Your latest service orders and status updates</span>
            </div>
            <Link to="/customer/bookings" className="btn btn-sm btn-secondary">
              <span>View All Bookings</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-muted">You haven't placed any bookings yet.</p>
              <Link to="/customer/browse" className="btn btn-sm btn-primary mt-2">
                Browse Services
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Service & Ref</th>
                    <th>Provider</th>
                    <th>Date & Slot</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 5).map((b) => (
                    <tr key={b.id}>
                      <td>
                        <strong className="text-sm block" style={{ color: 'var(--neutral-900)' }}>{b.serviceName}</strong>
                        <span className="text-2xs text-muted font-mono">{b.bookingReference}</span>
                      </td>
                      <td>
                        <span className="text-sm font-medium">{b.providerName}</span>
                      </td>
                      <td>
                        <span className="text-sm block">{formatDate(b.date)}</span>
                        <span className="text-2xs text-muted">{b.time}</span>
                      </td>
                      <td>
                        <strong className="text-sm text-primary">{formatCurrency(b.price || b.totalPrice || 499)}</strong>
                      </td>
                      <td>
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="text-right">
                        <Link to={`/customer/bookings/${b.id}`} className="btn btn-sm btn-secondary" style={{ padding: '4px 10px' }}>
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RECOMMENDED PROFESSIONALS */}
        {recommendedProviders.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Recommended Professionals</h4>
                <span className="text-xs text-muted">Handpicked, background-verified specialists in your area</span>
              </div>
              <Link to="/customer/browse" className="text-xs font-semibold" style={{ color: 'var(--primary-700)' }}>
                View All on Map
              </Link>
            </div>

            <div className="providers-grid">
              {recommendedProviders.map((p) => (
                <ProviderCard key={p.id} provider={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
