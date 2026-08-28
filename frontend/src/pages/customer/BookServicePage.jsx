import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { providerService } from '../../services/providerService';
import { categoryService } from '../../services/categoryService';
import { userService } from '../../services/userService';
import { bookingService } from '../../services/bookingService';
import { MapView } from '../../components/map/MapView';
import { Button } from '../../components/common/Button';
import { LoadingSpinner, ErrorMessage } from '../../components/common/FeedbackStates';
import { formatCurrency } from '../../utils/formatters';

export const BookServicePage = () => {
  const [searchParams] = useSearchParams();
  const initialProviderId = searchParams.get('providerId') || '101';
  const initialServiceId = searchParams.get('serviceId') || '1';

  const { user } = useAuth();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [service, setService] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Form State
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('11:00 AM');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const timeSlots = [
    '09:00 AM',
    '11:00 AM',
    '01:30 PM',
    '03:30 PM',
    '05:00 PM',
    '06:30 PM'
  ];

  useEffect(() => {
    const loadBookingContext = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = user?.id || 4;

        const [prov, serv, fetchedAddrs] = await Promise.all([
          providerService.getProviderById(initialProviderId).catch(() => null),
          categoryService.getServiceById(initialServiceId).catch(() => categoryService.getServices().then(s => s[0])),
          userService.getAddresses(userId)
        ]);

        let userAddrs = fetchedAddrs;
        if (!userAddrs || userAddrs.length === 0) {
          try {
            const createdAddr = await userService.addAddress(userId, {
              flat: '101, Service Apartment',
              street: 'Andheri West',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400053',
              landmark: 'Home Address'
            });
            userAddrs = [createdAddr];
          } catch (addrErr) {
            console.warn('Address creation fallback warning:', addrErr);
          }
        }

        setProvider(prov || { id: null, name: 'Assigned Specialist', rating: 4.9, reviewCount: 24, experience: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' });
        setService(serv);
        setAddresses(userAddrs || []);
        if (userAddrs && userAddrs.length > 0) {
          const defaultAddr = userAddrs.find(a => a.isDefault) || userAddrs[0];
          setSelectedAddressId(defaultAddr.id);
        }
      } catch (err) {
        console.error('Error loading booking parameters:', err);
        setError(err.message || 'Failed to load booking configuration');
      } finally {
        setLoading(false);
      }
    };

    loadBookingContext();
  }, [initialProviderId, initialServiceId, user]);

  const selectedAddress = addresses.find(a => a.id === Number(selectedAddressId)) || addresses[0];
  const basePrice = service?.basePrice || service?.price || provider?.startingPrice || 499;
  const tax = +(basePrice * 0.18).toFixed(2);
  const totalPrice = +(basePrice + tax).toFixed(2);

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      let targetAddressId = selectedAddress?.id || (addresses.length > 0 ? addresses[0].id : null);
      const userId = user?.id || 4;

      if (!targetAddressId) {
        const newAddr = await userService.addAddress(userId, {
          flat: '101, Service Apartment',
          street: 'Andheri West',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400053',
          landmark: 'Home Address'
        });
        targetAddressId = newAddr.id;
      }

      const newBooking = await bookingService.createBooking({
        customerId: userId,
        serviceId: service?.id || 1,
        addressId: targetAddressId,
        providerId: provider?.id,
        date,
        time,
        price: totalPrice,
        description: description.trim() || 'General inspection and repair requested'
      });

      // Redirect to customer bookings
      navigate('/customer/bookings?success=true');
    } catch (err) {
      console.error('Booking submission failed:', err);
      setError(err.message || 'Failed to create booking.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Preparing booking configuration..." />;
  if (error && !service) {
    return (
      <div className="container section-py">
        <ErrorMessage message={error} onRetry={() => navigate('/services')} />
      </div>
    );
  }

  return (
    <div className="book-service-page" style={{ padding: '2rem 0 4rem 0' }}>
      <div className="container">
        
        {/* Header */}
        <div className="mb-6">
          <nav style={{ marginBottom: '0.75rem', fontSize: '0.875rem', color: 'var(--neutral-500)' }}>
            <Link to="/customer/dashboard">Dashboard</Link> <span>›</span> <Link to="/customer/browse">Services</Link> <span>›</span> <span>Book Appointment</span>
          </nav>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--neutral-900)', margin: 0 }}>
            Schedule Verified Service Appointment
          </h1>
          <p className="text-xs text-muted">Complete your details to confirm an on-time visit with zero advance deposit required.</p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleConfirmBooking}>
          <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            
            {/* Left Column: Form Details */}
            <div className="flex flex-col gap-6">
              
              {/* Provider & Service Summary Card */}
              <div className="card" style={{ padding: '1.25rem' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-muted uppercase">Selected Professional</span>
                  <span className="badge badge-verified">✓ Background Verified</span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={provider.avatar}
                    alt={provider.name}
                    style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                      {provider.name}
                    </h4>
                    <p className="text-xs text-muted font-semibold" style={{ color: 'var(--primary-700)' }}>
                      {provider.companyName || `${provider.service} Specialist`}
                    </p>
                    <p className="text-xs text-muted">
                      ★ {provider.rating} ({provider.reviewCount} reviews) • {provider.experience} yrs exp
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--neutral-200)', paddingTop: '0.75rem' }}>
                  <span className="text-xs text-muted block">Service Name</span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--neutral-900)' }}>
                    {service?.name || `${provider.service} Standard Inspection`}
                  </strong>
                </div>
              </div>

              {/* Step 1: Date & Time Slot */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
                  1. Choose Date & Time Slot
                </h4>

                <div className="form-group mb-4">
                  <label className="form-label">Service Date <span className="required">*</span></label>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group mb-0">
                  <label className="form-label">Available Time Slots <span className="required">*</span></label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        className={`btn btn-sm ${time === slot ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setTime(slot)}
                      >
                        🕒 {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 2: Address Selection & Location Preview */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                    2. Service Location Address
                  </h4>
                  <Link to="/customer/addresses" className="text-xs font-semibold" style={{ color: 'var(--primary-700)' }}>
                    + Manage Addresses
                  </Link>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        border: selectedAddressId === addr.id ? '2px solid var(--primary-800)' : '1px solid var(--neutral-300)',
                        backgroundColor: selectedAddressId === addr.id ? 'var(--primary-50)' : 'var(--white)',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="radio"
                        name="addressSelection"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        style={{ marginTop: '3px' }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <strong style={{ fontSize: '0.9rem' }}>{addr.label}</strong>
                          {addr.isDefault && <span className="badge badge-confirmed" style={{ fontSize: '10px' }}>Default</span>}
                        </div>
                        <p className="text-xs text-muted" style={{ margin: 0, marginTop: '2px' }}>
                          {addr.flat}, {addr.street}, {addr.city} - {addr.pincode}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Map Location Preview for Selected Address */}
                {selectedAddress && (
                  <div>
                    <span className="text-xs text-muted block mb-2 font-semibold">📍 Location Map Preview:</span>
                    <div style={{ height: '180px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                      <MapView
                        locations={[{ id: 99, name: 'Service Location', latitude: selectedAddress.latitude, longitude: selectedAddress.longitude, service: provider.service, verified: true }]}
                        center={{ latitude: selectedAddress.latitude, longitude: selectedAddress.longitude, city: selectedAddress.city }}
                        customerLocation={{ latitude: selectedAddress.latitude, longitude: selectedAddress.longitude }}
                        height="180px"
                        showServiceRadius={false}
                        interactive={false}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Problem Description */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  3. Describe The Issue (Optional)
                </h4>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Describe your issue in detail (e.g. Switch sparking, bathroom drain blocked, AC not cooling)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

            </div>

            {/* Right Column: Order Summary & Confirmation Box */}
            <div>
              <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', borderBottom: '1px solid var(--neutral-200)', paddingBottom: '0.75rem' }}>
                  Booking Summary
                </h3>

                <div className="flex flex-col gap-3 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Service Standard Labor:</span>
                    <strong style={{ color: 'var(--neutral-900)' }}>{formatCurrency(basePrice)}</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted">GST (18%):</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted">Safety & Verification Fee:</span>
                    <span style={{ color: 'var(--success-700)', fontWeight: 700 }}>FREE</span>
                  </div>

                  <div
                    style={{
                      borderTop: '2px dashed var(--neutral-300)',
                      paddingTop: '0.75rem',
                      marginTop: '0.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                    }}
                  >
                    <span className="font-bold text-base">Total Estimated Price:</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>

                {/* Trust Highlights */}
                <div
                  style={{
                    backgroundColor: 'var(--success-50)',
                    border: '1px solid var(--success-100)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    marginBottom: '1.5rem',
                    fontSize: '12px',
                    color: 'var(--success-800)',
                  }}
                >
                  <div className="flex items-center gap-1 font-bold mb-1">
                    <span>✓</span> Zero Advance Payment Required
                  </div>
                  <p style={{ margin: 0, color: 'var(--neutral-600)' }}>
                    Pay securely via UPI, Card, or Cash only after service completion & your full satisfaction.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  block
                  loading={submitting}
                  style={{ padding: '0.875rem', fontSize: '1rem' }}
                >
                  Confirm & Schedule Appointment
                </Button>

                <p className="text-xs text-muted text-center mt-3">
                  By confirming, you agree to TrustFix's 30-Day Service Warranty terms.
                </p>
              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
};
