import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import { providerService } from '../../services/providerService';
import { RatingStars } from '../../components/common/RatingStars';
import { VerificationBadge } from '../../components/common/VerificationBadge';
import { ProviderCard } from '../../components/provider/ProviderCard';
import { LoadingSpinner, ErrorMessage } from '../../components/common/FeedbackStates';
import { formatCurrency } from '../../utils/formatters';

export const ServiceDetailsPage = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [matchingProviders, setMatchingProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        const serv = await categoryService.getServiceById(serviceId);
        setService(serv);

        // Fetch providers for this category
        const provs = await providerService.getProviders({
          category: serv.categoryName.toLowerCase()
        });
        setMatchingProviders(provs);
      } catch (err) {
        setError(err.message || 'Service not found');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  if (loading) return <LoadingSpinner message="Loading service details..." />;
  if (error || !service) {
    return (
      <div className="container section-py">
        <ErrorMessage message={error || 'Service not found'} onRetry={() => navigate('/services')} />
      </div>
    );
  }

  return (
    <div className="service-details-page" style={{ padding: '2.5rem 0 4rem 0' }}>
      <div className="container">
        {/* Breadcrumbs */}
        <nav style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--neutral-500)' }}>
          <Link to="/">Home</Link> <span>›</span> <Link to="/services">Services</Link> <span>›</span> <span>{service.name}</span>
        </nav>

        {/* Main Service Hero Grid */}
        <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          
          {/* Service Image Gallery */}
          <div className="card" style={{ overflow: 'hidden', height: '360px' }}>
            <img
              src={service.image}
              alt={service.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Service Summary Card */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-verified">
                  ✓ Verified Service Standard
                </span>
                <span className="badge badge-confirmed">
                  {service.categoryName}
                </span>
              </div>

              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--neutral-900)', marginBottom: '0.75rem' }}>
                {service.name}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <RatingStars rating={service.rating} reviewCount={service.reviewCount} size="md" />
                <span className="text-sm text-muted">• Duration: ~{service.durationMinutes} mins</span>
              </div>

              <p style={{ fontSize: '1rem', color: 'var(--neutral-600)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {service.description}
              </p>
            </div>

            {/* Price Box & Action */}
            <div
              className="card"
              style={{
                padding: '1.5rem',
                backgroundColor: 'var(--primary-50)',
                borderColor: 'var(--primary-200, #BFDBFE)',
              }}
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <span className="text-xs text-muted block">Starting Standard Fee</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                    {formatCurrency(service.startingPrice)}
                  </span>
                  <span className="text-xs text-muted block mt-1">+ 18% GST • 30-Day Guarantee</span>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/browse?category=${encodeURIComponent(service.categoryName.toLowerCase())}`}
                    className="btn btn-secondary"
                  >
                    Select From {matchingProviders.length} Providers
                  </Link>

                  <Link
                    to={`/customer/book?serviceId=${service.id}&providerId=${matchingProviders[0]?.id || 101}`}
                    className="btn btn-primary"
                  >
                    ⚡ Instant Book
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Inclusions & Exclusions */}
        <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
          
          <div className="card" style={{ padding: '1.75rem' }}>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--success-800)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>✓</span> What's Included
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(service.included || service.features).map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-muted">
                  <span style={{ color: 'var(--success-600)', fontWeight: 700 }}>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--neutral-800)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>ℹ️</span> Please Note / Excluded
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(service.excluded || ["Replacement hardware parts billed on actuals", "Major masonry cutting"]).map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-muted">
                  <span style={{ color: 'var(--neutral-400)' }}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Specialized Verified Providers for this Service */}
        <div>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--neutral-900)', margin: 0 }}>
                Verified Specialists for {service.name}
              </h3>
              <p className="text-sm text-muted">Directly book top-rated professionals verified for this trade.</p>
            </div>

            <Link to={`/browse?category=${encodeURIComponent(service.categoryName.toLowerCase())}`} className="btn btn-secondary">
              View on Map →
            </Link>
          </div>

          <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {matchingProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
