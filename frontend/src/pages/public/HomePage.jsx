import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import { providerService } from '../../services/providerService';
import { ServiceCard } from '../../components/service/ServiceCard';
import { ProviderCard } from '../../components/provider/ProviderCard';
import { CategoryCard } from '../../components/category/CategoryCard';
import { LoadingSpinner } from '../../components/common/FeedbackStates';
import {
  ShieldCheck,
  Search,
  Check,
  ArrowRight,
  Star,
  Award,
  CreditCard,
  CheckCircle2,
  Lock,
  Wrench,
  Calendar,
  Sparkles,
  Users,
  Shield,
  Clock,
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
        setFeaturedProviders(provs.slice(0, 6));
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
          1. HERO SECTION - TRUST + VERIFIED PROS + GUARANTEE CARD
          ============================================================ */}
      <section
        style={{
          background: 'linear-gradient(145deg, #071A33 0%, #0B1E3B 50%, #0E254A 100%)',
          color: 'var(--white)',
          padding: '4.5rem 0 5rem 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle geometric pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.65,
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              alignItems: 'center',
              gap: '3.5rem',
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
                  backgroundColor: 'rgba(37, 99, 235, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 16px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--primary-300)',
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
                  fontSize: 'clamp(2.25rem, 4.5vw, 3.4rem)',
                  fontWeight: 800,
                  color: 'var(--white)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.035em',
                  marginBottom: '1.25rem',
                }}
              >
                Trusted professionals.
                <br />
                <span style={{ color: 'var(--primary-400)' }}>Right at your doorstep.</span>
              </h1>

              {/* Supporting Subtitle */}
              <p
                style={{
                  fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
                  color: 'var(--primary-200)',
                  lineHeight: 1.6,
                  marginBottom: '2rem',
                  maxWidth: '540px',
                }}
              >
                Book verified home-service professionals for repairs, cleaning, maintenance and more — with transparent pricing and reliable service.
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
                  marginBottom: '1.75rem',
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

              {/* Dual CTA */}
              <div className="flex items-center gap-3 flex-wrap mb-6">
                <Link to="/browse" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--primary-700)', borderColor: 'var(--primary-700)' }}>
                  <span>Find a Service</span>
                  <ArrowRight size={15} />
                </Link>
                <Link to="/services" className="btn btn-outline-secondary" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff', padding: '0.75rem 1.5rem' }}>
                  Explore Services
                </Link>
              </div>

              {/* Below CTAs Trust Metrics */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                  paddingTop: '1.25rem',
                  fontSize: '0.8125rem',
                  color: 'var(--primary-200)',
                }}
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} color="var(--success-400)" />
                  <span style={{ fontWeight: 600, color: 'var(--white)' }}>Verified Professionals</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} color="var(--success-400)" />
                  <span style={{ fontWeight: 600, color: 'var(--white)' }}>Transparent Pricing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={16} fill="#F59E0B" color="#F59E0B" />
                  <span style={{ fontWeight: 600, color: 'var(--white)' }}>4.9/5 Customer Rating</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual: TrustFix Guarantee Card */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="hero-guarantee-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--primary-700)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        boxShadow: '0 2px 6px rgba(37, 99, 235, 0.4)',
                      }}
                    >
                      <ShieldCheck size={22} strokeWidth={2.4} />
                    </div>
                    <div>
                      <h4 style={{ color: '#fff', fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>
                        TrustFix Guarantee
                      </h4>
                      <span style={{ fontSize: '11px', color: 'var(--primary-300)', fontWeight: 600 }}>
                        Verified Protection Standard
                      </span>
                    </div>
                  </div>
                  <span className="badge badge-verified" style={{ fontSize: '10px', padding: '3px 8px' }}>
                    <Check size={10} strokeWidth={3} />
                    Active Shield
                  </span>
                </div>

                {/* 4 Guarantee Metrics Grid */}
                <div className="hero-guarantee-grid">
                  <div className="hero-guarantee-item">
                    <div className="hero-guarantee-value" style={{ color: 'var(--success-400)' }}>100%</div>
                    <div className="hero-guarantee-label">Background Checked</div>
                  </div>
                  <div className="hero-guarantee-item">
                    <div className="hero-guarantee-value" style={{ color: 'var(--primary-300)' }}>₹0</div>
                    <div className="hero-guarantee-label">Advance Payment</div>
                  </div>
                  <div className="hero-guarantee-item">
                    <div className="hero-guarantee-value" style={{ color: '#FBBF24' }}>4.9/5</div>
                    <div className="hero-guarantee-label">Customer Satisfaction</div>
                  </div>
                  <div className="hero-guarantee-item">
                    <div className="hero-guarantee-value" style={{ color: 'var(--success-400)' }}>30-Day</div>
                    <div className="hero-guarantee-label">Service Warranty</div>
                  </div>
                </div>

                {/* Booking CTA Button */}
                <Link
                  to="/browse"
                  className="btn btn-block btn-success"
                  style={{ padding: '0.75rem', fontSize: '0.9375rem', fontWeight: 700 }}
                >
                  <span>Book a Service</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. BROWSE BY CATEGORY SECTION
          ============================================================ */}
      <section className="section-py" style={{ backgroundColor: 'var(--white)' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">Services Directory</span>
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-desc">From electrical to deep cleaning — find verified professionals for every home need.</p>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading categories..." />
          ) : (
            <div className="categories-grid">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          3. POPULAR SERVICES SECTION
          ============================================================ */}
      <section className="section-py" style={{ backgroundColor: 'var(--neutral-50)' }}>
        <div className="container">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <span className="section-subtitle">Top Booked</span>
              <h2 className="section-title" style={{ margin: 0 }}>Popular Services</h2>
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
          4. TOP-RATED PROFESSIONALS SECTION
          ============================================================ */}
      <section className="section-py" style={{ backgroundColor: 'var(--white)' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">Verified Network</span>
            <h2 className="section-title">Top-Rated Professionals</h2>
            <p className="section-desc">Handpicked, background-verified experts near you.</p>
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
          5. HOW TRUSTFIX WORKS - 4 HORIZONTAL STEPS
          ============================================================ */}
      <section id="how-it-works" className="section-py" style={{ backgroundColor: 'var(--neutral-100)' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">Simple Process</span>
            <h2 className="section-title">How TrustFix Works</h2>
            <p className="section-desc">Get your household repairs resolved in 4 simple steps.</p>
          </div>

          <div className="step-workflow-container">
            {/* Step 1 */}
            <div className="step-card">
              <div className="step-icon-badge">
                <Search size={22} strokeWidth={2.4} />
              </div>
              <span className="text-2xs font-bold text-primary mb-1 uppercase" style={{ letterSpacing: '0.08em' }}>Step 01</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }}>Choose a Service</h4>
              <p className="text-xs text-muted" style={{ lineHeight: 1.5 }}>
                Browse home repair categories with transparent starting rates, standard duration, and inclusions checklist.
              </p>
            </div>

            {/* Step 2 */}
            <div className="step-card">
              <div className="step-icon-badge">
                <ShieldCheck size={22} strokeWidth={2.4} />
              </div>
              <span className="text-2xs font-bold text-primary mb-1 uppercase" style={{ letterSpacing: '0.08em' }}>Step 02</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }}>Find a Verified Pro</h4>
              <p className="text-xs text-muted" style={{ lineHeight: 1.5 }}>
                Inspect ratings, verified badges, field experience, and service radius on the interactive map.
              </p>
            </div>

            {/* Step 3 */}
            <div className="step-card">
              <div className="step-icon-badge">
                <Calendar size={22} strokeWidth={2.4} />
              </div>
              <span className="text-2xs font-bold text-primary mb-1 uppercase" style={{ letterSpacing: '0.08em' }}>Step 03</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }}>Schedule a Visit</h4>
              <p className="text-xs text-muted" style={{ lineHeight: 1.5 }}>
                Pick your preferred date and slot, enter address details, and confirm booking with ₹0 advance deposit.
              </p>
            </div>

            {/* Step 4 */}
            <div className="step-card step-success">
              <div className="step-icon-badge">
                <CheckCircle2 size={22} strokeWidth={2.4} />
              </div>
              <span className="text-2xs font-bold text-success mb-1 uppercase" style={{ letterSpacing: '0.08em' }}>Step 04</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }}>Get the Work Done</h4>
              <p className="text-xs text-muted" style={{ lineHeight: 1.5 }}>
                Technician arrives on time, executes certified repairs, and you pay securely only after complete satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          6. TRUST SECTION - 4 DARK NAVY CARDS
          ============================================================ */}
      <section className="section-py" style={{ backgroundColor: 'var(--white)' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">The TrustFix Standard</span>
            <h2 className="section-title">Built on trust, delivered with care</h2>
            <p className="section-desc">Engineered from the ground up for safety, transparent transactions, and guaranteed workmanship.</p>
          </div>

          <div className="dark-trust-grid">
            {/* Card 1 */}
            <div className="dark-trust-card trust-green">
              <div className="dark-trust-icon">
                <ShieldCheck size={24} strokeWidth={2.2} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--white)', marginBottom: '0.4rem' }}>
                Verified Professionals
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--neutral-300)', lineHeight: 1.6 }}>
                Every professional undergoes government ID checks, trade skill tests, and criminal background verification before onboarding.
              </p>
            </div>

            {/* Card 2 */}
            <div className="dark-trust-card">
              <div className="dark-trust-icon">
                <CreditCard size={24} strokeWidth={2.2} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--white)', marginBottom: '0.4rem' }}>
                Transparent Pricing
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--neutral-300)', lineHeight: 1.6 }}>
                Clear rate cards and upfront job scopes. No surprise contractor markups or unapproved added charges.
              </p>
            </div>

            {/* Card 3 */}
            <div className="dark-trust-card trust-green">
              <div className="dark-trust-icon">
                <Lock size={24} strokeWidth={2.2} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--white)', marginBottom: '0.4rem' }}>
                ₹0 Advance Payment
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--neutral-300)', lineHeight: 1.6 }}>
                Book with confidence without paying upfront fees. Pay conveniently and safely after the technician finishes the job.
              </p>
            </div>

            {/* Card 4 */}
            <div className="dark-trust-card">
              <div className="dark-trust-icon">
                <Award size={24} strokeWidth={2.2} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--white)', marginBottom: '0.4rem' }}>
                Service Guarantee
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--neutral-300)', lineHeight: 1.6 }}>
                Enjoy complete peace of mind with our 30-day post-service warranty and free re-inspection support on all completed jobs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          7. CONVERSION CTA BANNER
          ============================================================ */}
      <section
        style={{
          background: 'linear-gradient(135deg, #071A33 0%, #0B1E3B 60%, #1E3A8A 100%)',
          color: 'var(--white)',
          padding: '4.5rem 0',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="container" style={{ maxWidth: '720px' }}>
          <div className="brand-icon" style={{ width: '44px', height: '44px', margin: '0 auto 1rem auto' }}>
            <ShieldCheck size={24} strokeWidth={2.4} />
          </div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--white)', marginBottom: '1rem', letterSpacing: '-0.025em' }}>
            Ready to Fix Your Home with Verified Pros?
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--primary-200)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Join thousands of satisfied homeowners who rely on TrustFix for prompt, reliable, and background-checked doorstep services.
          </p>
          <div className="flex items-center justify-center flex-wrap gap-4">
            <Link to="/browse" className="btn btn-lg btn-secondary" style={{ backgroundColor: 'var(--white)', color: 'var(--primary-900)', border: 'none', fontWeight: 700 }}>
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
