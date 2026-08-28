import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { VerificationBadge } from '../common/VerificationBadge';

export const Sidebar = ({ role = 'CUSTOMER' }) => {
  const { user, providerProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const customerLinks = [
    { to: '/customer/dashboard', label: 'Dashboard', icon: '📊', end: true },
    { to: '/customer/browse', label: 'Browse Services', icon: '🔍' },
    { to: '/customer/bookings', label: 'My Bookings', icon: '📅' },
    { to: '/customer/addresses', label: 'Saved Addresses', icon: '📍' },
    { to: '/customer/profile', label: 'Account Profile', icon: '👤' },
  ];

  const providerLinks = [
    { to: '/provider/dashboard', label: 'Dashboard', icon: '📊', end: true },
    { to: '/provider/profile', label: 'Profile & Location', icon: '🛠️' },
    { to: '/provider/services', label: 'My Services', icon: '📋' },
    { to: '/provider/pricing', label: 'Manage Pricing', icon: '💰' },
    { to: '/provider/requests', label: 'Booking Requests', icon: '📬' },
    { to: '/provider/reviews', label: 'Customer Reviews', icon: '⭐' },
    { to: '/provider/availability', label: 'Availability', icon: '⏰' },
  ];

  const links = role === 'PROVIDER' ? providerLinks : customerLinks;

  return (
    <aside className="dashboard-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon" style={{ width: '28px', height: '28px', fontSize: '0.9rem' }}>
            🛡️
          </div>
          <span style={{ fontSize: '1.15rem' }}>TrustFix</span>
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        <div style={{ padding: '0 8px 8px 8px', fontSize: '11px', fontWeight: 700, color: 'var(--neutral-400)', textTransform: 'uppercase' }}>
          {role === 'PROVIDER' ? 'Provider Portal' : 'Customer Account'}
        </div>

        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span style={{ fontSize: '1.1rem' }}>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--neutral-200)', paddingTop: '8px' }}>
          <Link to="/" className="sidebar-link">
            <span>🌐</span>
            <span>Back to Website</span>
          </Link>
        </div>
      </nav>

      {/* User Mini Profile & Logout */}
      <div className="sidebar-footer">
        <div className="user-mini-profile mb-3">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt={user?.name || 'User'}
            className="user-avatar"
          />
          <div className="min-w-0 flex-1">
            <h6 className="text-truncate font-bold text-sm" style={{ margin: 0 }}>
              {user?.name || 'User'}
            </h6>
            <div className="flex items-center gap-1">
              {role === 'PROVIDER' && providerProfile ? (
                <VerificationBadge status={providerProfile.verificationStatus} size="sm" />
              ) : (
                <span className="text-xs text-muted">Customer</span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="btn btn-sm btn-secondary btn-block"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
};
