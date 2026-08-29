import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { VerificationBadge } from '../common/VerificationBadge';
import {
  LayoutDashboard,
  Search,
  Calendar,
  MapPin,
  User,
  Wrench,
  ClipboardList,
  CreditCard,
  Inbox,
  Star,
  Clock,
  Users,
  ShieldCheck,
  Layers,
  Globe,
  LogOut,
} from 'lucide-react';

export const Sidebar = ({ role = 'CUSTOMER' }) => {
  const { user, providerProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const customerLinks = [
    { to: '/customer/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/customer/browse', label: 'Browse Services', icon: Search },
    { to: '/customer/bookings', label: 'My Bookings', icon: Calendar },
    { to: '/customer/addresses', label: 'Saved Addresses', icon: MapPin },
    { to: '/customer/profile', label: 'Account Profile', icon: User },
  ];

  const providerLinks = [
    { to: '/provider/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/provider/profile', label: 'Profile & Location', icon: Wrench },
    { to: '/provider/services', label: 'My Services', icon: ClipboardList },
    { to: '/provider/pricing', label: 'Manage Pricing', icon: CreditCard },
    { to: '/provider/requests', label: 'Booking Requests', icon: Inbox },
    { to: '/provider/reviews', label: 'Customer Reviews', icon: Star },
    { to: '/provider/availability', label: 'Availability', icon: Clock },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'Users Directory', icon: Users },
    { to: '/admin/providers', label: 'Provider Verification', icon: ShieldCheck },
    { to: '/admin/categories', label: 'Category Catalog', icon: Layers },
    { to: '/admin/services', label: 'Service Catalog', icon: ClipboardList },
    { to: '/admin/bookings', label: 'Bookings Monitor', icon: Calendar },
  ];

  const links = role === 'ADMIN' ? adminLinks : role === 'PROVIDER' ? providerLinks : customerLinks;
  const portalLabel = role === 'ADMIN' ? 'Admin Portal' : role === 'PROVIDER' ? 'Provider Portal' : 'Customer Account';

  return (
    <aside className="dashboard-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon" style={{ width: '32px', height: '32px' }}>
            <ShieldCheck size={18} strokeWidth={2.2} />
          </div>
          <span style={{ fontSize: '1.15rem' }}>TrustFix</span>
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        <div style={{ padding: '0 8px 8px 8px', fontSize: '11px', fontWeight: 700, color: 'var(--neutral-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {portalLabel}
        </div>

        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--neutral-200)', paddingTop: '8px' }}>
          <Link to="/" className="sidebar-link">
            <Globe size={18} strokeWidth={1.8} />
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
                <span className="text-xs text-muted">{role === 'ADMIN' ? 'Administrator' : 'Customer'}</span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="btn btn-sm btn-secondary btn-block"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
