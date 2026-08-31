import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Menu, X, User, LogOut, Check, Search, ArrowRight } from 'lucide-react';

export const PublicNavbar = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (role === 'PROVIDER') return '/provider/dashboard';
    if (role === 'ADMIN') return '/admin/dashboard';
    return '/customer/dashboard';
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchOpen(false);
      setSearchVal('');
    }
  };

  const handleHowItWorksClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('how-it-works');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* Brand Logo with Shield */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <ShieldCheck size={20} strokeWidth={2.4} />
          </div>
          <span>TrustFix</span>
          <span className="brand-badge">
            <Check size={10} strokeWidth={3} />
            Verified Pros
          </span>
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
            <li>
              <a href="/#how-it-works" onClick={handleHowItWorksClick} className="nav-link">
                How It Works
              </a>
            </li>
          </ul>
        </nav>

        {/* Right CTA / Search / Auth */}
        <div className="nav-actions">
          {/* Quick Search Trigger */}
          {searchOpen ? (
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="text"
                className="form-control"
                style={{ height: '34px', fontSize: '13px', width: '170px', padding: '4px 8px' }}
                placeholder="Search service..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                style={{ padding: '4px 8px' }}
                onClick={() => setSearchOpen(false)}
              >
                <X size={14} />
              </button>
            </form>
          ) : (
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              style={{ padding: '6px 10px' }}
              onClick={() => setSearchOpen(true)}
              title="Search services and providers"
              aria-label="Search"
            >
              <Search size={14} />
            </button>
          )}

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link to={getDashboardPath()} className="btn btn-sm btn-primary">
                <User size={14} />
                <span>Dashboard ({role === 'PROVIDER' ? 'Provider' : role === 'ADMIN' ? 'Admin' : 'Customer'})</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-sm btn-secondary" title="Log out">
                <LogOut size={14} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-sm btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                <span>Get Started</span>
                <ArrowRight size={13} />
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
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
            Services
          </NavLink>
          <NavLink
            to="/browse"
            className="nav-link font-semibold text-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            Find Providers
          </NavLink>
          <a
            href="/#how-it-works"
            className="nav-link font-semibold text-lg"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleHowItWorksClick(e);
            }}
          >
            How It Works
          </a>

          <div style={{ borderTop: '1px solid var(--neutral-200)', paddingTop: '1.25rem', marginTop: 'auto' }}>
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link
                  to={getDashboardPath()}
                  className="btn btn-primary btn-block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={16} />
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="btn btn-secondary btn-block"
                >
                  <LogOut size={16} />
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
                  <span>Get Started</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
