import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const PublicFooter = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem' }}>
          
          {/* Column 1: Brand & Description */}
          <div style={{ maxWidth: '300px' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="brand-icon" style={{ width: '34px', height: '34px' }}>
                <ShieldCheck size={20} strokeWidth={2.4} />
              </div>
              <span style={{ color: 'var(--white)', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                TrustFix
              </span>
            </div>
            <p style={{ color: 'var(--neutral-400)', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              India's verified home-service marketplace. Connecting homeowners with background-checked, skilled professionals with upfront pricing and service guarantees.
            </p>
            <div className="flex items-center gap-2">
              <span className="badge badge-verified" style={{ fontSize: '11px', padding: '4px 8px' }}>
                <CheckCircle2 size={12} strokeWidth={2.5} />
                <span>100% Background Checked</span>
              </span>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h5>Services</h5>
            <ul className="footer-links">
              <li><Link to="/services" className="footer-link">Electrical</Link></li>
              <li><Link to="/services" className="footer-link">Plumbing</Link></li>
              <li><Link to="/services" className="footer-link">Cleaning</Link></li>
              <li><Link to="/services" className="footer-link">AC Repair</Link></li>
              <li><Link to="/services" className="footer-link">Appliance Repair</Link></li>
              <li><Link to="/services" className="footer-link">Painting</Link></li>
              <li><Link to="/services" className="footer-link">Carpentry</Link></li>
              <li><Link to="/services" className="footer-link">Pest Control</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h5>Company</h5>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">About TrustFix</Link></li>
              <li><a href="/#how-it-works" className="footer-link">How It Works</a></li>
              <li><Link to="/services" className="footer-link">Explore Catalog</Link></li>
              <li><Link to="/browse" className="footer-link">Find Providers</Link></li>
              <li>
                <Link to="/register?role=PROVIDER" className="footer-link" style={{ color: 'var(--primary-400)', fontWeight: 600 }}>
                  <span>Join as Professional</span>
                  <ArrowRight size={13} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust */}
          <div>
            <h5>Trust & Safety</h5>
            <ul className="footer-links">
              <li><span className="footer-link">Verified Professionals</span></li>
              <li><span className="footer-link">Transparent Pricing</span></li>
              <li><span className="footer-link">₹0 Advance Payment</span></li>
              <li><span className="footer-link">30-Day Service Guarantee</span></li>
              <li><span className="footer-link">Multi-tier Police & ID Checks</span></li>
            </ul>
          </div>

          {/* Column 5: Legal */}
          <div>
            <h5>Legal</h5>
            <ul className="footer-links">
              <li><span className="footer-link">Privacy Policy</span></li>
              <li><span className="footer-link">Terms of Service</span></li>
              <li><span className="footer-link">Customer Protection</span></li>
              <li><span className="footer-link">Security Guidelines</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© 2026 TrustFix — Verified Home Service Platform. All rights reserved.</p>
          <div className="flex gap-4 items-center">
            <span style={{ color: 'var(--neutral-400)' }}>Privacy</span>
            <span style={{ color: 'var(--neutral-600)' }}>•</span>
            <span style={{ color: 'var(--neutral-400)' }}>Terms</span>
            <span style={{ color: 'var(--neutral-600)' }}>•</span>
            <span style={{ color: 'var(--neutral-400)' }}>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
