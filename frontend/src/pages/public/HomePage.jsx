import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import { providerService } from '../../services/providerService';
import { ServiceCard } from '../../components/service/ServiceCard';
import { ProviderCard } from '../../components/provider/ProviderCard';
import { LoadingSpinner } from '../../components/common/FeedbackStates';
import { CategoryIcon } from '../../utils/categoryIcons';
import {
  ShieldCheck,
  Search,
  Check,
  ArrowRight,
  Star,
  Clock,
  Award,
  Zap,
  Wrench,
  Sparkles,
  Snowflake,
  CreditCard,
  Users,
  CheckCircle2,
} from 'lucide-react';

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
      {/* ============================================================
          HERO SECTION - TRUST + VERIFICATION + HOME SERVICES
          ============================================================ */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--primary-950) 0%, var(--primary-900) 60%, var(--primary-850) 100%)',
          color: 'var(--white)',
          padding: '4rem 0 4.5rem 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle geometric pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.85,
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              alignItems: 'center',
              gap: '3rem',
            }}
          >
            {/* Left Content Column */}
            <div>
              {/* Trust Badge Pill */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 16px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--primary-100)',
                  marginBottom: '1.25rem',
                  backdropFilter: 'blur(6px)',
                }}
              >
                <ShieldCheck size={16} color="var(--success-400)" />
                <span>Verified Home Service Professionals</span>
              </div>

              {/* Main Headline */}
              <h1
                style={{
                  fontSize: 'clamp(2.25rem, 4.5vw, 3.25rem)',
                  fontWeight: 800,
                  color: 'var(--white)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.03em',
                  marginBottom: '1.25rem',
                }}
              >
                Trusted professionals.
                <br />
                Right at your doorstep.
              </h1>

              {/* Supporting Subtitle */}
              <p
                style={{
                  fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
                  color: 'var(--primary-100)',
                  lineHeight: 1.6,
                  marginBottom: '2rem',
                  maxWidth: '540px',
                }}
              >
                Book verified electricians, plumbers, cleaners, appliance technicians and more with transparent pricing and trusted service.
              </p>

              {/* Search Bar Input */}
              <form
                onSubmit={handleSearch}
                style={{
                  backgroundColor: 'var(--white)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '6px',
                  boxShadow: 'var(--shadow-xl)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  maxWidth: '540px',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ paddingLeft: '12px', display: 'flex', alignItems: 'center', color: 'var(--neutral-400)' }}>
                  <Search size={20} strokeWidth={2} />
                </div>
                <input
                  type="text"
                  placeholder="What service do you need? (e.g. Electrician, Leak Fix)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.9375rem',
                    color: 'var(--neutral-800)',
                    padding: '8px 4px',
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.625rem 1.25rem' }}>
                  Find a Service
                </button>
              </form>

              {/* Dual CTA & Quick Category Links */}
              <div className="flex items-center gap-3 flex-wrap">
                <Link to="/services" className="btn btn-outline-secondary" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
                  Explore Services
                </Link>
                <Link to="/browse" className="btn btn-light">
                  Find Providers Near You →
                </Link>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  width: '100%',
                  maxWidth: '440px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 'var(--radius-2xl)',
                  padding: '1.75rem',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.4)',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--success-600)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                      }}
                    >
                      <ShieldCheck size={22} strokeWidth={2.2} />
                    </div>
                    <div>
                      <h4 style={{ color: '#fff', fontSize: '1rem', margin: 0, fontWeight: 700 }}>
                        TrustFix Shield
                      </h4>
                      <span style={{ fontSize: '11px', color: 'var(--success-400)', fontWeight: 600 }}>
                        100% Certified Network
                      </span>
                    </div>
                  </div>
                  <span className="badge badge-verified">
                    <Check size={10} strokeWidth={3} />
                    Live Verified
                  </span>
                </div>

                {/* Verification Checkpoints */}
                <div className="flex flex-col gap-3 mb-4">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <CheckCircle2 size={16} color="var(--success-400)" />
                    <span style={{ fontSize: '0.8125rem', color: 'var(--neutral-100)' }}>
                      Multi-tier Police & ID Verification
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <CheckCircle2 size={16} color="var(--success-400)" />
                    <span style={{ fontSize: '0.8125rem', color: 'var(--neutral-100)' }}>
                      Trade Skill & Electrical Safety Tested
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <CheckCircle2 size={16} color="var(--success-400)" />
                    <span style={{ fontSize: '0.8125rem', color: 'var(--neutral-100)' }}>
                      30-Day Workmanship Warranty
                    </span>
                  </div>
                </div>

                {/* Provider Mini Live Preview */}
                <div
                  style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    paddingTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2" style={{ display: 'flex' }}>
                      <img
                        src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100&auto=format&fit=crop&q=80"
                        alt="Rajesh"
                        style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #fff', objectFit: 'cover' }}
                      />
                      <img
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                        alt="Priya"
                        style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #fff', objectFit: 'cover', marginLeft: '-8px' }}
                      />
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                        alt="Amit"
                        style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #fff', objectFit: 'cover', marginLeft: '-8px' }}
                      />
                    </div>
                    <div style={{ marginLeft: '6px' }}>
                      <div className="flex items-center gap-1">
                        <Star size={12} fill="#F59E0B" color="#F59E0B" />
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>4.9/5.0</span>
                      </div>
                      <span style={{ fontSize: '10px', color: 'var(--primary-200)' }}>1,500+ Mumbai bookings</span>
                    </div>
                  </div>

                  <Link to="/browse" className="btn btn-sm btn-success" style={{ padding: '4px 10px', fontSize: '11px' }}>
                    View All
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          POPULAR CATEGORIES SECTION
          ============================================================ */}
      <section className="section-py" style={{ backgroundColor: 'var(--white)' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">Services Directory</span>
            <h2 className="section-title">Explore Home Services</h2>
            <p className="section-desc">Select a category to discover specialized verified technicians in your neighborhood.</p>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading categories..." />
          ) : (
            <div className="categories-grid">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/services?category=${cat.id}`}
                  className="card card-hoverable"
                  style={{
                    padding: '1.5rem',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
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
                      marginBottom: '1rem',
                      border: '1px solid var(--primary-100)',
                    }}
                  >
                    <CategoryIcon categoryName={cat.name} slug={cat.slug} size={24} strokeWidth={2} />
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--neutral-900)', marginBottom: '0.25rem' }}>
                    {cat.name}
                  </h4>
                  <p className="text-xs text-muted" style={{ marginBottom: '1rem', lineHeight: 1.5, flex: 1 }}>
                    {cat.description}
                  </p>
                  <span className="text-xs font-semibold" style={{ color: 'var(--primary-700)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span>Explore services</span>
                    <ArrowRight size={13} />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          POPULAR SERVICES SECTION
          ============================================================ */}
      <section className="section-py" style={{ backgroundColor: 'var(--neutral-50)' }}>
        <div className="container">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <span className="section-subtitle">Top Booked</span>
              <h2 className="section-title" style={{ margin: 0 }}>Most Requested Services</h2>
            </div>
            <Link to="/services" className="btn btn-secondary">
              <span>View All Services</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading services..." />
          ) : (
            <div className="services-grid">
              {popularServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          FEATURED VERIFIED PROVIDERS
          ============================================================ */}
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
            <div className="providers-grid">
              {featuredProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/browse" className="btn btn-lg btn-primary">
              <span>Explore All Verified Providers & Map</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          HOW TRUSTFIX WORKS - 4 SIMPLE STEPS
          ============================================================ */}
      <section className="section-py" style={{ backgroundColor: 'var(--neutral-100)' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">Simple Process</span>
            <h2 className="section-title">How TrustFix Works</h2>
            <p className="section-desc">Get your household repairs resolved in 4 easy steps.</p>
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
              <p className="text-sm text-muted">Pick a convenient time, select your address with map preview, and confirm with zero advance fee.</p>
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

      {/* ============================================================
          WHY HOMEOWNERS TRUST US - 4 TRUST PILLARS
          ============================================================ */}
      <section className="section-py" style={{ backgroundColor: 'var(--white)' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">The TrustFix Difference</span>
            <h2 className="section-title">Why Homeowners Trust Us</h2>
            <p className="section-desc">Built from the ground up for safety, reliability, and guaranteed craftsmanship.</p>
          </div>

          <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            
            <div className="flex gap-4">
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--success-50)',
                  color: 'var(--success-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={26} strokeWidth={2} />
              </div>
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
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary-50)',
                  color: 'var(--primary-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CreditCard size={26} strokeWidth={2} />
              </div>
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
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--warning-50)',
                  color: 'var(--warning-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Star size={26} strokeWidth={2} />
              </div>
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
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--success-50)',
                  color: 'var(--success-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Award size={26} strokeWidth={2} />
              </div>
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

      {/* ============================================================
          CONVERSION CTA BANNER
          ============================================================ */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--primary-900) 0%, var(--primary-800) 100%)',
          color: 'var(--white)',
          padding: '4.5rem 0',
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
              <span>Join As Service Provider</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
