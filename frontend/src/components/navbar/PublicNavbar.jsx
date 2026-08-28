import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

export const PublicNavbar = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (role === 'PROVIDER') return '/provider/dashboard';
    if (role === 'ADMIN') return '/admin/dashboard';
    return '/customer/dashboard';
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">🛡️</div>
          <span>TrustFix</span>
          <span className="brand-badge">Verified</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Services
              </NavLink>
            </li>
            <li>
              <NavLink to="/browse" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Find Providers
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Right CTA / User Status */}
        <div className="nav-actions">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link to={getDashboardPath()} className="btn btn-sm btn-primary">
                <span>Dashboard ({role === 'PROVIDER' ? 'Provider' : role === 'ADMIN' ? 'Admin' : 'Customer'})</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-sm btn-secondary" title="Log out">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-sm btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav">
          <NavLink
            to="/"
            className="nav-link font-semibold text-lg"
            onClick={() => setMobileMenuOpen(false)}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/services"
            className="nav-link font-semibold text-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            All Services
          </NavLink>
          <NavLink
            to="/browse"
            className="nav-link font-semibold text-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            Find Verified Providers
          </NavLink>

          <div style={{ borderTop: '1px solid var(--neutral-200)', paddingTop: '1rem', marginTop: 'auto' }}>
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link
                  to={getDashboardPath()}
                  className="btn btn-primary btn-block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="btn btn-secondary btn-block"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  className="btn btn-secondary btn-block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
