import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import { providerService } from '../../services/providerService';
import { RatingStars } from '../../components/common/RatingStars';
import { ProviderCard } from '../../components/provider/ProviderCard';
import { LoadingSpinner, ErrorMessage } from '../../components/common/FeedbackStates';
import { formatCurrency } from '../../utils/formatters';
import { resolveServiceImage } from '../../utils/imageResolver';
import { ShieldCheck, Clock, CheckCircle2, Info, ArrowRight, ChevronRight } from 'lucide-react';

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
          category: (serv.categoryName || '').toLowerCase()
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
        <nav style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--neutral-500)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to="/services">Services</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--neutral-800)', fontWeight: 600 }}>{service.name}</span>
        </nav>

        {/* Main Service Hero Grid */}
        <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          
          {/* Service Image */}
          <div className="card" style={{ overflow: 'hidden', minHeight: '320px' }}>
            <img
              src={resolveServiceImage(service)}
              alt={service.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Service Summary Card */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-verified">
                  <ShieldCheck size={13} strokeWidth={2.2} />
                  <span>Verified Service Standard</span>
                </span>
                <span className="badge badge-confirmed">
                  {service.categoryName || 'Home Service'}
                </span>
              </div>

              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--neutral-900)', marginBottom: '0.75rem' }}>
                {service.name}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <RatingStars rating={service.rating || 4.9} reviewCount={service.reviewCount || 24} size="md" />
                <span className="text-sm text-muted flex items-center gap-1">
                  <Clock size={14} />
                  <span>Duration: ~{service.durationInMinutes || service.durationMinutes || 60} mins</span>
                </span>
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
                borderColor: 'var(--primary-200)',
              }}
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <span className="text-xs text-muted block">Starting Standard Fee</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                    {formatCurrency(service.basePrice || service.price || service.startingPrice || 499)}
                  </span>
                  <span className="text-xs text-muted block mt-1">+ 18% GST • 30-Day Guarantee</span>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/browse?category=${encodeURIComponent(service.categoryName || '')}`}
                    className="btn btn-secondary"
                  >
                    Select From Providers
                  </Link>

                  <Link
                    to={matchingProviders[0]?.id ? `/customer/book?serviceId=${service.id}&providerId=${matchingProviders[0].id}` : `/customer/book?serviceId=${service.id}`}
                    className="btn btn-primary"
                  >
                    <span>Instant Book</span>
                    <ArrowRight size={14} />
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
              <CheckCircle2 size={18} color="var(--success-600)" />
              <span>What's Included</span>
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(service.included || service.features || [
                "Certified technician doorstep visit & inspection",
                "Complete diagnostic check and safety evaluation",
                "Standard labor & precision repair execution",
                "30-day TrustFix post-service warranty guarantee"
              ]).map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-muted">
                  <CheckCircle2 size={14} color="var(--success-600)" style={{ flexShrink: 0 }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--neutral-800)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={18} color="var(--primary-700)" />
              <span>Please Note / Excluded</span>
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(service.excluded || ["Replacement hardware parts billed on actuals with invoice", "Major masonry or wall cutting"]).map((item, idx) => (
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

            <Link to={`/browse?category=${encodeURIComponent((service.categoryName || '').toLowerCase())}`} className="btn btn-secondary">
              <span>View on Map</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="providers-grid">
            {matchingProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
