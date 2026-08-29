import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const PublicFooter = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid grid-cols-1">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem' }}>
            
            {/* Column 1: Brand & Promise */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="brand-icon" style={{ width: '32px', height: '32px' }}>
                  <ShieldCheck size={18} strokeWidth={2.2} />
                </div>
                <h4 style={{ color: 'var(--white)', margin: 0, fontWeight: 800 }}>TrustFix</h4>
              </div>
              <p style={{ color: 'var(--neutral-400)', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: 1.6 }}>
                The verified home-service marketplace. Connecting discerning homeowners with verified, background-checked, and certified repair specialists.
              </p>
              <div className="flex items-center gap-2">
                <span className="badge badge-verified" style={{ fontSize: '11px' }}>
                  <CheckCircle2 size={12} strokeWidth={2} />
                  100% Background Checked
                </span>
              </div>
            </div>

            {/* Column 2: Popular Services */}
            <div>
              <h5>Popular Services</h5>
              <ul className="footer-links">
                <li><Link to="/services" className="footer-link">Electrical Repairs & Wiring</Link></li>
                <li><Link to="/services" className="footer-link">Plumbing & Leak Control</Link></li>
                <li><Link to="/services" className="footer-link">Full Home Deep Cleaning</Link></li>
                <li><Link to="/services" className="footer-link">AC Servicing & Gas Top-Up</Link></li>
                <li><Link to="/services" className="footer-link">Washing Machine & Fridge Repair</Link></li>
                <li><Link to="/services" className="footer-link">Furniture & Lock Carpentry</Link></li>
              </ul>
            </div>

            {/* Column 3: Trust & Safety */}
            <div>
              <h5>Trust & Verification</h5>
              <ul className="footer-links">
                <li><span className="footer-link">Government ID Verification</span></li>
                <li><span className="footer-link">Skill Trade Certification</span></li>
                <li><span className="footer-link">Police Background Clearance</span></li>
                <li><span className="footer-link">Transparent Price Guidelines</span></li>
                <li><span className="footer-link">30-Day Service Guarantee</span></li>
              </ul>
            </div>

            {/* Column 4: Quick Links & Join as Provider */}
            <div>
              <h5>Account & Partners</h5>
              <ul className="footer-links">
                <li><Link to="/login" className="footer-link">Customer Login</Link></li>
                <li><Link to="/register" className="footer-link">Create Free Account</Link></li>
                <li>
                  <Link to="/register?role=PROVIDER" className="footer-link" style={{ color: 'var(--primary-300)', fontWeight: 600 }}>
                    <span>Join as Service Provider</span>
                    <ArrowRight size={14} />
                  </Link>
                </li>
                <li><Link to="/services" className="footer-link">Service Directory</Link></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} TrustFix — Verified Home Service Platform. All rights reserved.</p>
          <div className="flex gap-4">
            <span style={{ color: 'var(--neutral-400)' }}>Privacy Policy</span>
            <span style={{ color: 'var(--neutral-400)' }}>•</span>
            <span style={{ color: 'var(--neutral-400)' }}>Terms of Service</span>
            <span style={{ color: 'var(--neutral-400)' }}>•</span>
            <span style={{ color: 'var(--neutral-400)' }}>Safety Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
