import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const DemoSwitcher = () => {
  const { user, role, switchDemoPersona, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (persona, redirectPath) => {
    switchDemoPersona(persona);
    setIsOpen(false);
    if (redirectPath) {
      navigate(redirectPath);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        fontFamily: 'var(--font-family)',
      }}
    >
      {isOpen ? (
        <div
          className="card"
          style={{
            padding: '16px',
            width: '290px',
            boxShadow: 'var(--shadow-xl)',
            border: '2px solid var(--primary-800)',
            backgroundColor: 'var(--white)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary-800)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ⚡ Quick Demo Persona
            </span>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: 'var(--neutral-500)' }}
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <button
              className={`btn btn-sm ${role === 'CUSTOMER' ? 'btn-primary' : 'btn-secondary'} justify-between`}
              onClick={() => handleSelect('CUSTOMER', '/customer/dashboard')}
            >
              <span>👤 Customer</span>
              <span className="text-xs text-muted">Aarav S.</span>
            </button>

            <button
              className={`btn btn-sm ${role === 'PROVIDER' ? 'btn-primary' : 'btn-secondary'} justify-between`}
              onClick={() => handleSelect('PROVIDER_VERIFIED', '/provider/dashboard')}
            >
              <span>🛠️ Verified Provider</span>
              <span className="badge badge-verified" style={{ padding: '1px 4px', fontSize: '9px' }}>✓ Rajesh</span>
            </button>

            <button
              className="btn btn-sm btn-secondary justify-between"
              onClick={() => handleSelect('PROVIDER_PENDING', '/provider/dashboard')}
            >
              <span>⏳ Pending Provider</span>
              <span className="badge badge-pending" style={{ padding: '1px 4px', fontSize: '9px' }}>Anand V.</span>
            </button>

            <button
              className={`btn btn-sm ${role === 'ADMIN' ? 'btn-primary' : 'btn-secondary'} justify-between`}
              onClick={() => handleSelect('ADMIN', '/admin/dashboard')}
            >
              <span>🛡️ Admin Placeholder</span>
              <span className="text-xs text-muted">Officer</span>
            </button>

            <div style={{ borderTop: '1px solid var(--neutral-200)', marginTop: '4px', paddingTop: '6px' }} className="flex justify-between items-center">
              <button
                className="btn btn-sm btn-light text-xs"
                onClick={() => { logout(); setIsOpen(false); navigate('/'); }}
              >
                Log Out
              </button>
              <span className="text-xs text-muted">
                Role: <strong>{role || 'Guest'}</strong>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            backgroundColor: 'var(--primary-900)',
            color: 'var(--white)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 'var(--radius-full)',
            boxShadow: 'var(--shadow-lg)',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 700,
          }}
          title="Switch role for demo testing"
        >
          <span style={{ fontSize: '14px' }}>⚡</span>
          <span>Demo Role: {role || 'Guest'}</span>
        </button>
      )}
    </div>
  );
};
