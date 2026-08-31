import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, ArrowRight, ShieldAlert } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div
      className="container text-center section-py"
      style={{
        minHeight: '65vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--primary-100)',
          color: 'var(--primary-800)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto',
          boxShadow: '0 4px 14px rgba(30, 58, 138, 0.12)',
        }}
      >
        <ShieldAlert size={40} strokeWidth={1.8} />
      </div>

      <span
        style={{
          fontSize: '3.5rem',
          fontWeight: 800,
          color: 'var(--primary-900)',
          lineHeight: 1,
          marginBottom: '0.5rem',
          letterSpacing: '-0.03em',
        }}
      >
        404
      </span>

      <h1
        style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: 'var(--neutral-900)',
          marginBottom: '0.5rem',
        }}
      >
        Page not found
      </h1>

      <p className="text-muted mb-6" style={{ maxWidth: '440px', fontSize: '0.9375rem', lineHeight: 1.6 }}>
        The page you're looking for doesn't exist or has been moved. Let's get you back to safe ground.
      </p>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <Link to="/" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          <Home size={16} />
          <span>Go Home</span>
        </Link>
        <Link to="/services" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
          <span>Browse Services</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};
