import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { providerService } from '../../services/providerService';
import { categoryService } from '../../services/categoryService';
import { userService } from '../../services/userService';
import { bookingService } from '../../services/bookingService';
import { MapView } from '../../components/map/MapView';
import { Button } from '../../components/common/Button';
import { LoadingSpinner, ErrorMessage } from '../../components/common/FeedbackStates';
import { CategoryIcon } from '../../utils/categoryIcons';
import { formatCurrency } from '../../utils/formatters';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Star,
  ChevronRight,
  Layers,
  Wrench,
  UserCheck,
  Sparkles,
  Info
} from 'lucide-react';

export const BookServicePage = () => {
  const [searchParams] = useSearchParams();
  const initialProviderId = searchParams.get('providerId') || null;
  const initialServiceId = searchParams.get('serviceId') || null;
  const initialCategoryParam = searchParams.get('category') || null;

  const { user } = useAuth();
  const navigate = useNavigate();

  // Data State
  const [categories, setCategories] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [allProviders, setAllProviders] = useState([]);
  const [addresses, setAddresses] = useState([]);

  // Selection State
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedProviderId, setSelectedProviderId] = useState(null);
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

  // =========================================================================
  // Load All Context Data (Categories, Services, Providers, Addresses)
  // =========================================================================
  useEffect(() => {
    const loadBookingContext = async () => {
      setLoading(true);
      setError(null);
      try {
        const [fetchedCats, fetchedServices, fetchedProviders, fetchedAddrs] = await Promise.all([
          categoryService.getCategories().catch(() => []),
          categoryService.getServices().catch(() => []),
          providerService.getVerifiedProviders().catch(() => []),
          user?.id ? userService.getAddresses(user.id).catch(() => []) : Promise.resolve([])
        ]);

        setCategories(fetchedCats || []);
        setAllServices(fetchedServices || []);
        setAllProviders(fetchedProviders || []);

        // Manage User Addresses
        let userAddrs = fetchedAddrs;
        if (!userAddrs || userAddrs.length === 0) {
          try {
            const userId = user?.id || 4;
            const createdAddr = await userService.addAddress(userId, {
              flat: '101, Palm Beach Residency',
              street: 'Sector 15, Vashi',
              city: 'Navi Mumbai',
              state: 'Maharashtra',
              pincode: '400703',
              landmark: 'Near Bus Depot'
            });
            userAddrs = [createdAddr];
          } catch (addrErr) {
            console.warn('Address creation fallback warning:', addrErr);
          }
        }
        setAddresses(userAddrs || []);
        if (userAddrs && userAddrs.length > 0) {
          const defaultAddr = userAddrs.find(a => a.isDefault) || userAddrs[0];
          setSelectedAddressId(defaultAddr.id);
        }

        // =====================================================================
        // Resolve Initial Service & Provider smartly based on query params
        // =====================================================================
        let initialProv = null;
        let initialServ = null;

        if (initialProviderId) {
          initialProv = fetchedProviders.find(p => String(p.id) === String(initialProviderId));
        }

        if (initialServiceId) {
          initialServ = fetchedServices.find(s => String(s.id) === String(initialServiceId));
        }

        // If provider is specified but service is not:
        // Match the service corresponding to this provider's category/trade!
        if (initialProv && !initialServ) {
          const provTrade = (initialProv.service || '').toLowerCase();
          const matchingServices = fetchedServices.filter(s => {
            const catName = (s.categoryName || '').toLowerCase();
            const servName = (s.name || '').toLowerCase();
            return catName.includes(provTrade) || servName.includes(provTrade) || provTrade.includes(catName);
          });

          if (matchingServices.length > 0) {
            initialServ = matchingServices[0];
          }
        }

        // If category is passed in URL:
        if (!initialServ && initialCategoryParam) {
          const catParamLower = initialCategoryParam.toLowerCase();
          const matchingServices = fetchedServices.filter(s =>
            (s.categoryName || '').toLowerCase().includes(catParamLower) ||
            (s.name || '').toLowerCase().includes(catParamLower)
          );
          if (matchingServices.length > 0) {
            initialServ = matchingServices[0];
          }
        }

        // Final fallback for service:
        if (!initialServ && fetchedServices.length > 0) {
          initialServ = fetchedServices[0];
        }

        // If service is selected but provider is not:
        // Match a provider with this service's trade!
        if (initialServ && !initialProv) {
          const servCat = (initialServ.categoryName || '').toLowerCase();
          const matchingProvs = fetchedProviders.filter(p => {
            const pTrade = (p.service || '').toLowerCase();
            return servCat.includes(pTrade) || pTrade.includes(servCat);
          });
          if (matchingProvs.length > 0) {
            initialProv = matchingProvs[0];
          } else if (fetchedProviders.length > 0) {
            initialProv = fetchedProviders[0];
          }
        }

        if (initialServ) {
          setSelectedServiceId(initialServ.id);
          setSelectedCategory(initialServ.categoryName || 'ALL');
        }

        if (initialProv) {
          setSelectedProviderId(initialProv.id);
        }

      } catch (err) {
        console.error('Error loading booking configuration:', err);
        setError(err.message || 'Failed to load booking configuration');
      } finally {
        setLoading(false);
      }
    };

    loadBookingContext();
  }, [initialProviderId, initialServiceId, initialCategoryParam, user?.id]);

  // =========================================================================
  // Active Entities Resolution
  // =========================================================================
  const activeService = useMemo(() => {
    return allServices.find(s => s.id === Number(selectedServiceId)) || allServices[0] || null;
  }, [allServices, selectedServiceId]);

  const activeProvider = useMemo(() => {
    return allProviders.find(p => p.id === Number(selectedProviderId)) || null;
  }, [allProviders, selectedProviderId]);

  // Filtered Services according to Category Tab
  const displayedServices = useMemo(() => {
    if (selectedCategory === 'ALL') return allServices;
    return allServices.filter(s =>
      (s.categoryName || '').toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (s.name || '').toLowerCase().includes(selectedCategory.toLowerCase())
    );
  }, [allServices, selectedCategory]);

  // Matching Providers for the currently selected service
  const matchingProviders = useMemo(() => {
    if (!activeService) return allProviders;
    const servCat = (activeService.categoryName || '').toLowerCase();
    const matches = allProviders.filter(p => {
      const pTrade = (p.service || '').toLowerCase();
      return servCat.includes(pTrade) || pTrade.includes(servCat);
    });
    return matches.length > 0 ? matches : allProviders;
  }, [allProviders, activeService]);

  // Handle Category Change
  const handleCategorySelect = (catName) => {
    setSelectedCategory(catName);
    const candidateServices = catName === 'ALL'
      ? allServices
      : allServices.filter(s => (s.categoryName || '').toLowerCase().includes(catName.toLowerCase()));

    if (candidateServices.length > 0) {
      const newService = candidateServices[0];
      setSelectedServiceId(newService.id);

      // Auto match provider
      const servCat = (newService.categoryName || '').toLowerCase();
      const matchProv = allProviders.find(p => {
        const pTrade = (p.service || '').toLowerCase();
        return servCat.includes(pTrade) || pTrade.includes(servCat);
      });
      if (matchProv) {
        setSelectedProviderId(matchProv.id);
      }
    }
  };

  // Handle Service Selection
  const handleServiceSelect = (serviceItem) => {
    setSelectedServiceId(serviceItem.id);
    if (serviceItem.categoryName) {
      setSelectedCategory(serviceItem.categoryName);
    }

    // Auto-select a matching provider for this service if current provider doesn't match
    const servCat = (serviceItem.categoryName || '').toLowerCase();
    const currentProvTrade = (activeProvider?.service || '').toLowerCase();
    if (!servCat.includes(currentProvTrade) && !currentProvTrade.includes(servCat)) {
      const matchProv = allProviders.find(p => {
        const pTrade = (p.service || '').toLowerCase();
        return servCat.includes(pTrade) || pTrade.includes(servCat);
      });
      if (matchProv) {
        setSelectedProviderId(matchProv.id);
      }
    }
  };

  // =========================================================================
  // Pricing Calculation
  // =========================================================================
  const selectedAddress = addresses.find(a => a.id === Number(selectedAddressId)) || addresses[0];
  const basePrice = Number(activeService?.basePrice || activeService?.price || activeProvider?.startingPrice || 499);
  const tax = +(basePrice * 0.18).toFixed(2);
  const totalPrice = +(basePrice + tax).toFixed(2);

  // =========================================================================
  // Form Submission
  // =========================================================================
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

      if (!activeService?.id) {
        throw new Error('Please select a valid service to book.');
      }

      await bookingService.createBooking({
        customerId: user?.id,
        serviceId: activeService.id,
        addressId: targetAddressId,
        providerId: activeProvider?.id || (matchingProviders.length > 0 ? matchingProviders[0].id : null),
        date,
        time,
        price: totalPrice,
        description: description.trim() || `Booked ${activeService.name} with certified technician`
      });

      // Redirect to customer bookings page with success alert
      navigate('/customer/bookings?success=true');
    } catch (err) {
      console.error('Booking submission failed:', err);
      setError(err.message || 'Failed to create booking.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Preparing booking configuration..." />;

  return (
    <div className="book-service-page" style={{ padding: '2rem 0 4rem 0' }}>
      <div className="container">
        
        {/* Header */}
        <div className="mb-6">
          <nav style={{ marginBottom: '0.75rem', fontSize: '0.875rem', color: 'var(--neutral-500)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Link to="/customer/dashboard">Dashboard</Link>
            <ChevronRight size={14} />
            <Link to="/services">Services</Link>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--neutral-800)', fontWeight: 600 }}>Book Appointment</span>
          </nav>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--neutral-900)', margin: 0 }}>
            Schedule Verified Service Appointment
          </h1>
          <p className="text-xs text-muted" style={{ marginTop: '4px' }}>
            Choose your service, select a certified local pro, and confirm on-time doorstep visit with zero advance payment.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleConfirmBooking}>
          <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            
            {/* Left Column: Booking Form Steps */}
            <div className="flex flex-col gap-6">

              {/* Step 1: Choose Service & Category */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Wrench size={18} color="var(--primary-700)" />
                    <span>1. Select Service / Work</span>
                  </h4>
                  <span className="badge badge-confirmed">
                    {activeService ? activeService.categoryName : 'Choose Work'}
                  </span>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedCategory === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleCategorySelect('ALL')}
                    style={{ fontSize: '11px', padding: '5px 10px' }}
                  >
                    <Layers size={12} />
                    <span>All Services</span>
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`btn btn-sm ${selectedCategory.toLowerCase() === cat.name.toLowerCase() ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => handleCategorySelect(cat.name)}
                      style={{ fontSize: '11px', padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    >
                      <CategoryIcon categoryName={cat.name} size={12} />
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>

                {/* Service Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                  {displayedServices.map((s) => {
                    const isSelected = activeService?.id === s.id;
                    return (
                      <div
                        key={s.id}
                        onClick={() => handleServiceSelect(s)}
                        style={{
                          border: isSelected ? '2px solid var(--primary-700)' : '1px solid var(--neutral-200)',
                          backgroundColor: isSelected ? 'var(--primary-50)' : 'var(--white)',
                          borderRadius: 'var(--radius-md)',
                          padding: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          boxShadow: isSelected ? '0 2px 8px rgba(30, 58, 138, 0.12)' : 'none'
                        }}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-2xs font-bold uppercase" style={{ color: 'var(--primary-800)', letterSpacing: '0.04em' }}>
                              {s.categoryName}
                            </span>
                            {isSelected && <CheckCircle2 size={14} color="var(--primary-700)" />}
                          </div>
                          <h5 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--neutral-900)' }}>
                            {s.name}
                          </h5>
                          <p className="text-xs text-muted" style={{ margin: 0, lineHeight: 1.4 }}>
                            {s.description?.length > 70 ? `${s.description.slice(0, 70)}...` : s.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between" style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                          <span className="text-xs text-muted flex items-center gap-1">
                            <Clock size={11} />
                            <span>{s.durationInMinutes || s.durationMinutes || 45} mins</span>
                          </span>
                          <strong style={{ fontSize: '0.95rem', color: 'var(--primary-800)' }}>
                            {formatCurrency(s.basePrice || s.price || 499)}
                          </strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Assigned Professional (Provider) */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserCheck size={18} color="var(--primary-700)" />
                    <span>2. Assigned Verified Professional</span>
                  </h4>
                  <span className="badge badge-verified">
                    <ShieldCheck size={12} strokeWidth={2.2} />
                    Verified Specialists
                  </span>
                </div>

                <p className="text-xs text-muted mb-3">
                  Select a certified technician specializing in <strong>{activeService?.categoryName || 'this service'}</strong>:
                </p>

                <div className="flex flex-col gap-2">
                  {matchingProviders.map((p) => {
                    const isSelected = activeProvider?.id === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedProviderId(p.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          padding: '12px',
                          borderRadius: 'var(--radius-md)',
                          border: isSelected ? '2px solid var(--primary-700)' : '1px solid var(--neutral-200)',
                          backgroundColor: isSelected ? 'var(--primary-50)' : 'var(--white)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: isSelected ? '0 2px 6px rgba(30, 58, 138, 0.1)' : 'none'
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={p.avatar}
                            alt={p.name}
                            style={{
                              width: '46px',
                              height: '46px',
                              borderRadius: 'var(--radius-md)',
                              objectFit: 'cover',
                              border: isSelected ? '2px solid var(--primary-700)' : '1px solid var(--neutral-300)'
                            }}
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h5 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--neutral-900)' }}>
                                {p.name}
                              </h5>
                              <span className="badge badge-verified" style={{ fontSize: '9px', padding: '1px 5px' }}>
                                Verified Pro
                              </span>
                            </div>
                            <p className="text-xs text-muted" style={{ margin: 0, marginTop: '2px' }}>
                              {p.companyName || `${p.service} Specialist`} • {p.experience} yrs exp • Area: {p.serviceArea || p.city}
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex items-center gap-3 flex-shrink-0">
                          <div>
                            <div className="flex items-center gap-1 justify-end">
                              <Star size={11} fill="#F59E0B" color="#F59E0B" />
                              <span style={{ fontSize: '12px', fontWeight: 700 }}>{p.rating}</span>
                            </div>
                            <span className="text-2xs text-muted">({p.reviewCount} reviews)</span>
                          </div>
                          <div
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              border: isSelected ? '5px solid var(--primary-700)' : '2px solid var(--neutral-400)',
                              backgroundColor: '#fff'
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Date & Time Slot */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} color="var(--primary-700)" />
                  <span>3. Choose Date & Time Slot</span>
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
                        className={`btn btn-sm ${time === slot ? 'btn-primary' : 'btn-secondary'} flex items-center justify-center gap-1`}
                        onClick={() => setTime(slot)}
                      >
                        <Clock size={12} />
                        <span>{slot}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 4: Address Selection & Location Preview */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={18} color="var(--primary-700)" />
                    <span>4. Service Location Address</span>
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
                        border: selectedAddressId === addr.id ? '2px solid var(--primary-700)' : '1px solid var(--neutral-300)',
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
                          <strong style={{ fontSize: '0.9rem' }}>{addr.label || 'Home'}</strong>
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
                {selectedAddress && activeProvider && (
                  <div>
                    <span className="text-xs text-muted block mb-2 font-semibold flex items-center gap-1">
                      <MapPin size={12} color="var(--primary-700)" />
                      <span>Location Map Preview:</span>
                    </span>
                    <div style={{ height: '180px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                      <MapView
                        locations={[{ id: 99, name: 'Service Location', latitude: selectedAddress.latitude, longitude: selectedAddress.longitude, service: activeProvider.service, verified: true }]}
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

              {/* Step 5: Problem Description */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  5. Describe The Issue (Optional)
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

                {/* Selected Service Card */}
                {activeService && (
                  <div style={{ padding: '12px', backgroundColor: 'var(--neutral-50)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--neutral-200)' }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xs font-bold uppercase" style={{ color: 'var(--primary-700)' }}>{activeService.categoryName}</span>
                      <span className="text-xs text-muted flex items-center gap-1"><Clock size={11} /> {activeService.durationInMinutes || 45} mins</span>
                    </div>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--neutral-900)', display: 'block' }}>{activeService.name}</strong>
                  </div>
                )}

                {/* Selected Provider Card */}
                {activeProvider && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--primary-100)' }}>
                    <img
                      src={activeProvider.avatar}
                      alt={activeProvider.name}
                      style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                    />
                    <div className="min-w-0 flex-1">
                      <strong style={{ fontSize: '0.875rem', color: 'var(--neutral-900)', display: 'block' }}>{activeProvider.name}</strong>
                      <span className="text-2xs text-muted">{activeProvider.companyName || `${activeProvider.service} Specialist`} • ⭐ {activeProvider.rating}</span>
                    </div>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="flex flex-col gap-3 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Standard Labor Fee:</span>
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
                    <CheckCircle2 size={14} color="var(--success-600)" />
                    <span>Zero Advance Payment Required</span>
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
