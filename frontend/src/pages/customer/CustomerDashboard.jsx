import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import { providerService } from '../../services/providerService';
import { categoryService } from '../../services/categoryService';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { StatCard } from '../../components/dashboard/StatCard';
import { BookingCard } from '../../components/booking/BookingCard';
import { ProviderCard } from '../../components/provider/ProviderCard';
import { LoadingSpinner, EmptyState } from '../../components/common/FeedbackStates';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [recommendedProviders, setRecommendedProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [myBookings, recProvs, cats] = await Promise.all([
          bookingService.getCustomerBookings(user?.id || 1),
          providerService.getFeaturedProviders(),
          categoryService.getCategories()
        ]);
        setBookings(myBookings);
        setRecommendedProviders(recProvs.slice(0, 3));
        setCategories(cats.slice(0, 6));
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  const upcomingBooking = bookings.find(b => b.status === 'CONFIRMED' || b.status === 'PENDING' || b.status === 'IN_PROGRESS');
  const completedCount = bookings.filter(b => b.status === 'COMPLETED').length;
  const activeCount = bookings.filter(b => ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(b.status)).length;

  return (
    <div className="customer-dashboard">
      <DashboardHeader
        title={`Hello, ${user?.name?.split(' ')[0] || 'User'} 👋`}
        subtitle="Manage your home services, track active appointments, and discover verified local pros."
      />

      <div className="dashboard-content">
        {loading ? (
          <LoadingSpinner message="Loading your dashboard..." />
        ) : (
          <>
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <StatCard
                title="Active Bookings"
                value={activeCount}
                subtitle="Appointments in progress or pending"
                icon="📅"
                color="primary"
              />
              <StatCard
                title="Completed Services"
                value={completedCount}
                subtitle="Verified jobs finished"
                icon="✓"
                color="success"
              />
              <StatCard
                title="Verified Pros Nearby"
                value="24+"
                subtitle="Available in your neighborhood"
                icon="🛡️"
                color="primary"
              />
            </div>

            {/* Active / Upcoming Appointment Spotlight */}
            {upcomingBooking && (
              <div className="card mb-8" style={{ borderLeft: '4px solid var(--primary-700)', backgroundColor: 'var(--white)' }}>
                <div className="card-header flex items-center justify-between" style={{ backgroundColor: 'var(--primary-50)' }}>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '1.2rem' }}>⚡</span>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-800)', margin: 0 }}>
                      Upcoming Service Appointment
                    </h4>
                  </div>
                  <Link to={`/customer/bookings/${upcomingBooking.id}`} className="btn btn-sm btn-primary">
                    Track Live Timeline →
                  </Link>
                </div>

                <div className="card-body">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={upcomingBooking.providerAvatar}
                        alt={upcomingBooking.providerName}
                        style={{ width: '54px', height: '54px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                      />
                      <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                          {upcomingBooking.serviceName}
                        </h4>
                        <p className="text-xs text-muted">
                          Technician: <strong>{upcomingBooking.providerName}</strong> ({upcomingBooking.providerPhone})
                        </p>
                        <p className="text-xs" style={{ color: 'var(--neutral-700)', marginTop: '2px' }}>
                          📅 <strong>{upcomingBooking.date}</strong> at <strong>{upcomingBooking.time}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="badge badge-confirmed" style={{ fontSize: '12px', padding: '4px 8px' }}>
                        {upcomingBooking.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Service Categories Grid */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  Quick Book Services
                </h3>
                <Link to="/customer/browse" className="btn btn-sm btn-secondary">
                  Browse All →
                </Link>
              </div>

              <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                {categories.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/customer/browse?category=${cat.slug}`}
                    className="card card-hoverable"
                    style={{ padding: '1.25rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}
                  >
                    <span style={{ fontSize: '1.75rem' }}>{cat.icon}</span>
                    <div>
                      <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--neutral-900)', margin: 0 }}>{cat.name}</h5>
                      <span className="text-xs text-muted">Book now</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 2-Column: Recent Bookings Left, Recommended Providers Right */}
            <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
              
              {/* Recent Bookings */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                    Recent Bookings
                  </h3>
                  <Link to="/customer/bookings" className="btn btn-sm btn-light">
                    View All ({bookings.length})
                  </Link>
                </div>

                {bookings.length === 0 ? (
                  <EmptyState
                    icon="📋"
                    title="No bookings yet"
                    description="Book your first verified electrician, plumber, or cleaner in seconds."
                    action={<Link to="/customer/browse" className="btn btn-primary">Book a Service</Link>}
                  />
                ) : (
                  <div className="flex flex-col gap-3">
                    {bookings.slice(0, 3).map(b => (
                      <BookingCard key={b.id} booking={b} role="CUSTOMER" />
                    ))}
                  </div>
                )}
              </div>

              {/* Recommended Top Rated Providers */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                    Top Rated In Your Area
                  </h3>
                  <Link to="/customer/browse" className="btn btn-sm btn-light">
                    Explore Map →
                  </Link>
                </div>

                <div className="flex flex-col gap-3">
                  {recommendedProviders.map(p => (
                    <ProviderCard key={p.id} provider={p} />
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
