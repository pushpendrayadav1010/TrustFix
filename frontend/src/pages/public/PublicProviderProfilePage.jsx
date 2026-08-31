import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { providerService } from '../../services/providerService';
import { reviewService } from '../../services/reviewService';
import { locationService } from '../../services/locationService';
import { RatingStars } from '../../components/common/RatingStars';
import { VerificationBadge } from '../../components/common/VerificationBadge';
import { MapView } from '../../components/map/MapView';
import { LoadingSpinner, ErrorMessage } from '../../components/common/FeedbackStates';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  ShieldCheck,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Award,
  Clock,
  Calendar,
  Briefcase,
  Check,
  Star
} from 'lucide-react';

export const PublicProviderProfilePage = () => {
  const { providerId } = useParams();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [providerLocation, setProviderLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviderData = async () => {
      setLoading(true);
      try {
        const [prov, revs, loc] = await Promise.all([
          providerService.getProviderById(providerId),
          reviewService.getProviderReviews(providerId),
          locationService.getLocationByProviderId(providerId)
        ]);
        setProvider(prov);
        setReviews(revs);
        setProviderLocation(loc);
      } catch (err) {
        setError(err.message || 'Provider not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProviderData();
  }, [providerId]);

  if (loading) return <LoadingSpinner message="Loading provider profile..." />;
  if (error || !provider) {
    return (
      <div className="container section-py">
        <ErrorMessage message={error || 'Provider not found'} onRetry={() => navigate('/browse')} />
      </div>
    );
  }

  return (
    <div className="provider-details-page" style={{ padding: '2rem 0 4rem 0' }}>
      <div className="container">
        
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--neutral-500)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Link to="/" style={{ color: 'var(--neutral-500)' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to="/browse" style={{ color: 'var(--neutral-500)' }}>Providers</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--neutral-800)', fontWeight: 600 }}>{provider.name}</span>
        </nav>

        {/* Hero Card */}
        <div className="card mb-8">
          <div style={{ height: '140px', background: 'linear-gradient(135deg, #071A33 0%, #0B1E3B 60%, #1E3A8A 100%)', position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
          </div>

          <div className="card-body" style={{ marginTop: '-48px', position: 'relative' }}>
            <div className="flex items-end justify-between flex-wrap gap-4">
              
              <div className="flex items-end gap-4">
                <img
                  src={provider.avatar}
                  alt={provider.name}
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: 'var(--radius-lg)',
                    objectFit: 'cover',
                    border: '4px solid var(--white)',
                    boxShadow: 'var(--shadow-md)',
                    backgroundColor: 'var(--white)',
                  }}
                />

                <div style={{ paddingBottom: '4px' }}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--neutral-900)' }}>
                      {provider.name}
                    </h1>
                    <VerificationBadge status={provider.verificationStatus} />
                  </div>

                  {provider.companyName && (
                    <p className="text-sm font-semibold" style={{ color: 'var(--primary-700)', marginTop: '2px' }}>
                      {provider.companyName}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <div className="text-right mr-2">
                  <span className="text-xs text-muted block uppercase font-bold" style={{ letterSpacing: '0.04em' }}>Starting Base Rate</span>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                    {formatCurrency(provider.startingPrice)}
                  </span>
                </div>

                <Link
                  to={`/customer/book?providerId=${provider.id}&category=${encodeURIComponent(provider.service || '')}`}
                  className="btn btn-lg btn-primary"
                  style={{ padding: '0.75rem 1.5rem', fontWeight: 700 }}
                >
                  <span>Book This Provider</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

            </div>

            {/* Metrics Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem',
                borderTop: '1px solid var(--neutral-200)',
                borderBottom: '1px solid var(--neutral-200)',
                padding: '1rem 0',
                marginTop: '1.5rem',
                fontSize: '0.875rem',
              }}
            >
              <div>
                <span className="text-muted block text-xs">Customer Rating</span>
                <RatingStars rating={provider.rating} reviewCount={provider.reviewCount} size="sm" />
              </div>

              <div>
                <span className="text-muted block text-xs">Field Experience</span>
                <strong style={{ color: 'var(--neutral-800)' }}>{provider.experience} Years Certified</strong>
              </div>

              <div>
                <span className="text-muted block text-xs">Completed Jobs</span>
                <strong style={{ color: 'var(--neutral-800)' }}>{provider.completedJobs || 50}+ Verified Jobs</strong>
              </div>

              <div>
                <span className="text-muted block text-xs">Availability</span>
                <span className="flex items-center gap-1">
                  <span className={`status-dot ${provider.available ? 'online' : 'offline'}`} />
                  <strong style={{ color: provider.available ? 'var(--success-700)' : 'var(--neutral-600)' }}>
                    {provider.available ? 'Available for Bookings' : 'Currently Busy'}
                  </strong>
                </span>
              </div>

              <div>
                <span className="text-muted block text-xs">Primary Trade</span>
                <strong style={{ color: 'var(--primary-800)' }}>{provider.service}</strong>
              </div>
            </div>

            {/* Provider Bio */}
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>About Professional</h4>
              <p style={{ color: 'var(--neutral-700)', lineHeight: 1.65, maxWidth: '820px' }}>
                {provider.bio}
              </p>
            </div>

          </div>
        </div>

        {/* 2-Column Content: Pricing & Services Left, Location Map Right */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem',
          }}
        >
          {/* Rate Card & Credentials */}
          <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--white)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--neutral-900)' }}>
              Rate Card & Services
            </h3>

            <div className="flex flex-col gap-3">
              {(provider.pricingDetails || [
                { item: "General Doorstep Inspection & Diagnostic", price: provider.startingPrice, type: "Base Visit Fee" },
                { item: "Standard Labor & Precision Repair", price: provider.hourlyRate || 350, type: "Standard Labor Rate" }
              ]).map((rate, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.875rem 1rem',
                    backgroundColor: 'var(--neutral-50)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--neutral-200)',
                  }}
                >
                  <div>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--neutral-900)' }}>{rate.item}</h5>
                    <span className="text-xs text-muted">{rate.type}</span>
                  </div>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                    {formatCurrency(rate.price)}
                  </span>
                </div>
              ))}
            </div>

            {/* Specialties */}
            {provider.specialties && (
              <div style={{ marginTop: '1.5rem' }}>
                <h5 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--neutral-800)' }}>
                  Specialized Skills
                </h5>
                <div className="flex flex-wrap gap-2">
                  {provider.specialties.map((spec, idx) => (
                    <span key={idx} className="badge badge-confirmed" style={{ padding: '4px 8px' }}>
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Documents Checklist */}
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--neutral-200)', paddingTop: '1.25rem' }}>
              <h5 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--success-800)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="var(--success-600)" />
                <span>Verified Credentials on File</span>
              </h5>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(provider.documentsVerified || [
                  'Government Photo ID Verified',
                  'Police Clearance Background Checked',
                  'Trade Skill & Safety Standard Certified'
                ]).map((doc, idx) => (
                  <li key={idx} className="text-xs text-muted flex items-center gap-1.5">
                    <CheckCircle2 size={13} color="var(--success-600)" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Location & Service Area Map */}
          <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--white)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--neutral-900)' }}>
              Service Area & Operational Radius
            </h3>
            <p className="text-xs text-muted mb-3 flex items-center gap-1">
              <MapPin size={13} color="var(--primary-700)" />
              <span>Servicing: <strong>{provider.serviceArea}</strong> (~{providerLocation?.serviceRadiusKm || 25} km radius)</span>
            </p>

            <div style={{ flex: 1, minHeight: '300px', marginBottom: '1rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--neutral-200)' }}>
              <MapView
                locations={providerLocation ? [providerLocation] : []}
                selectedProviderId={provider.id}
                height="300px"
                showServiceRadius={true}
                interactive={true}
              />
            </div>

            <div className="text-xs text-muted">
              <span>Doorstep service available across all listed localities with zero travel surcharge.</span>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--white)' }}>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--neutral-900)' }}>
                Verified Customer Reviews ({reviews.length})
              </h3>
              <p className="text-xs text-muted">Authentic feedback from verified TrustFix completed bookings.</p>
            </div>
            <RatingStars rating={provider.rating} reviewCount={provider.reviewCount} size="md" />
          </div>

          {reviews.length === 0 ? (
            <p className="text-sm text-muted">No reviews yet for this provider.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  style={{
                    padding: '1.25rem',
                    backgroundColor: 'var(--neutral-50)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--neutral-200)',
                  }}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.customerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                        alt={rev.customerName}
                        style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span className="font-bold text-sm" style={{ color: 'var(--neutral-900)' }}>{rev.customerName}</span>
                      <span className="badge badge-verified" style={{ fontSize: '10px', padding: '1px 6px' }}>
                        <Check size={10} strokeWidth={3} />
                        Verified Order
                      </span>
                    </div>

                    <span className="text-xs text-muted">{formatDate(rev.date)}</span>
                  </div>

                  <div className="mb-2">
                    <RatingStars rating={rev.rating} showScore={false} size="sm" />
                    {rev.serviceName && (
                      <span className="text-xs text-muted font-semibold ml-2">({rev.serviceName})</span>
                    )}
                  </div>

                  <p className="text-xs" style={{ color: 'var(--neutral-700)', lineHeight: 1.6 }}>
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
