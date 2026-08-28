import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import { providerService } from '../../services/providerService';
import { ServiceCard } from '../../components/service/ServiceCard';
import { ProviderCard } from '../../components/provider/ProviderCard';
import { LoadingSpinner } from '../../components/common/FeedbackStates';

export const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [popularServices, setPopularServices] = useState([]);
  const [featuredProviders, setFeaturedProviders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [cats, servs, provs] = await Promise.all([
          categoryService.getCategories(),
          categoryService.getServices(),
          providerService.getFeaturedProviders()
        ]);
        setCategories(cats);
        setPopularServices(servs.slice(0, 6));
        setFeaturedProviders(provs);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section
        style={{
          backgroundColor: 'var(--primary-900)',
          color: 'var(--white)',
          padding: '4.5rem 0 5rem 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.8,
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            
            {/* Trust badge pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 16px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--primary-100)',
                marginBottom: '1.5rem',
              }}
            >
              <span style={{ color: 'var(--success-500)' }}>✓</span>
              <span>100% Background Verified & Certified Home Professionals</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
                fontWeight: 800,
                color: 'var(--white)',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem',
              }}
            >
              Find Trusted, Verified Professionals For Your Home.
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: 'var(--primary-100)',
                lineHeight: 1.6,
                marginBottom: '2.5rem',
                maxWidth: '680px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              Book certified electricians, plumbers, deep cleaners, appliance technicians, and carpenters with upfront pricing and verified background checks.
            </p>

            {/* Quick Hero Search Box */}
            <form
              onSubmit={handleSearch}
              style={{
                backgroundColor: 'var(--white)',
                borderRadius: 'var(--radius-lg)',
                padding: '8px',
                boxShadow: 'var(--shadow-xl)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                maxWidth: '640px',
                margin: '0 auto 2rem auto',
              }}
            >
              <span style={{ fontSize: '1.25rem', paddingLeft: '12px', color: 'var(--neutral-400)' }}>🔍</span>
              <input
                type="text"
                placeholder="What service do you need? (e.g. Electrician, Tap Leak, AC Jet Servicing)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '1rem',
                  color: 'var(--neutral-800)',
                  padding: '8px 4px',
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}>
                Find Service
              </button>
            </form>

            {/* Quick category badges in hero */}
            <div className="flex items-center justify-center flex-wrap gap-2 text-xs" style={{ color: 'var(--primary-100)' }}>
              <span style={{ opacity: 0.8 }}>Popular:</span>
              <Link to="/services/electrical" className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>⚡ Electrical</Link>
              <Link to="/services/plumbing" className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>🚰 Plumbing</Link>
              <Link to="/services/cleaning" className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>✨ Cleaning</Link>
              <Link to="/services/ac-repair" className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>❄️ AC Repair</Link>
            </div>

          </div>
        </div>
      </section>

      {/* Popular Categories Grid */}
      <section className="section-py" style={{ backgroundColor: 'var(--white)' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">Categories</span>
            <h2 className="section-title">Explore Home Services</h2>
            <p className="section-desc">Select a category to discover specialized verified technicians in your neighborhood.</p>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading categories..." />
          ) : (
            <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/services/${cat.slug}`}
                  className="card card-hoverable"
                  style={{ padding: '1.5rem', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--primary-50)',
                      color: 'var(--primary-800)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      marginBottom: '1rem',
                    }}
                  >
                    {cat.icon}
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--neutral-900)', marginBottom: '0.25rem' }}>
                    {cat.name}
                  </h4>
                  <p className="text-xs text-muted" style={{ marginBottom: '0.75rem', lineHeight: 1.5 }}>
                    {cat.description}
                  </p>
                  <span className="text-xs font-semibold" style={{ color: 'var(--primary-700)', marginTop: 'auto' }}>
                    {cat.providerCount} Verified Providers →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="section-py" style={{ backgroundColor: 'var(--neutral-50)' }}>
        <div className="container">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <span className="section-subtitle">Top Booked</span>
              <h2 className="section-title" style={{ margin: 0 }}>Most Requested Services</h2>
            </div>
            <Link to="/services" className="btn btn-secondary">
              View All Services →
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading services..." />
          ) : (
            <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {popularServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Verified Providers */}
      <section className="section-py" style={{ backgroundColor: 'var(--white)' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">Top Rated Professionals</span>
            <h2 className="section-title">Featured Verified Providers</h2>
            <p className="section-desc">Every provider undergoes government ID verification, background checks, and trade skill tests.</p>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading verified providers..." />
          ) : (
            <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {featuredProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/browse" className="btn btn-lg btn-primary">
              Explore All Verified Providers & Map →
            </Link>
          </div>
        </div>
      </section>

      {/* How TrustFix Works */}
      <section className="section-py" style={{ backgroundColor: 'var(--neutral-100)' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">Simple Process</span>
            <h2 className="section-title">How TrustFix Works</h2>
            <p className="section-desc">Get your household problems resolved in 4 easy steps.</p>
          </div>

          <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            
            <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-800)',
                  color: 'var(--white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  margin: '0 auto 1.25rem auto',
                }}
              >
                1
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Choose a Service</h4>
              <p className="text-sm text-muted">Browse dozens of home repair categories with transparent starting prices and checklists.</p>
            </div>

            <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-800)',
                  color: 'var(--white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  margin: '0 auto 1.25rem auto',
                }}
              >
                2
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Find a Verified Provider</h4>
              <p className="text-sm text-muted">Inspect provider ratings, completed jobs, service areas, and background verification badges.</p>
            </div>

            <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-800)',
                  color: 'var(--white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  margin: '0 auto 1.25rem auto',
                }}
              >
                3
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Book Date & Slot</h4>
              <p className="text-sm text-muted">Pick a convenient time, select your address with map location preview, and confirm with zero advance fee.</p>
            </div>

            <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--success-600)',
                  color: 'var(--white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  margin: '0 auto 1.25rem auto',
                }}
              >
                4
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Get Work Done & Pay</h4>
              <p className="text-sm text-muted">Technician arrives on time, performs verified repairs, and you pay securely after job satisfaction.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Why TrustFix Section */}
      <section className="section-py" style={{ backgroundColor: 'var(--white)' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">The TrustFix Difference</span>
            <h2 className="section-title">Why Homeowners Trust Us</h2>
            <p className="section-desc">Built from the ground up for safety, reliability, and guaranteed craftsmanship.</p>
          </div>

          <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
            <div className="flex gap-4">
              <div style={{ fontSize: '2rem', color: 'var(--success-600)' }}>🛡️</div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Rigorous Verification
                </h4>
                <p className="text-sm text-muted">
                  Every provider on TrustFix passes multi-tier identity checks, criminal history verification, and trade skill certifications before activation.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div style={{ fontSize: '2rem', color: 'var(--primary-700)' }}>🏷️</div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Transparent Pricing
                </h4>
                <p className="text-sm text-muted">
                  No surprise bills or hidden contractor commissions. Upfront service checklists and clear labor rates guarantee fair dealings.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div style={{ fontSize: '2rem', color: 'var(--primary-700)' }}>⭐</div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Genuine Customer Reviews
                </h4>
                <p className="text-sm text-muted">
                  Only customers with completed and verified bookings can submit reviews, ensuring authentic feedback without manipulated ratings.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div style={{ fontSize: '2rem', color: 'var(--success-600)' }}>🔒</div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  30-Day Service Guarantee
                </h4>
                <p className="text-sm text-muted">
                  If an issue recurs within 30 days of service completion, the provider returns for a free re-inspection and resolution.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Deep Blue Call to Action Section */}
      <section
        style={{
          backgroundColor: 'var(--primary-800)',
          color: 'var(--white)',
          padding: '5rem 0',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '720px' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--white)', marginBottom: '1rem' }}>
            Ready to Fix Your Home with Verified Pros?
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--primary-100)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Join thousands of satisfied homeowners across Mumbai and Thane who rely on TrustFix for prompt, reliable home services.
          </p>
          <div className="flex items-center justify-center flex-wrap gap-4">
            <Link to="/browse" className="btn btn-lg btn-secondary" style={{ backgroundColor: 'var(--white)', color: 'var(--primary-900)', border: 'none' }}>
              Find Verified Providers
            </Link>
            <Link to="/register?role=PROVIDER" className="btn btn-lg btn-success">
              Join As Service Provider →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
