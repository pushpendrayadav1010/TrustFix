import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, ArrowRight } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="container text-center section-py" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-50)',
          color: 'var(--primary-700)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto',
        }}
      >
        <Search size={36} strokeWidth={1.8} />
      </div>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--neutral-900)', marginBottom: '0.5rem' }}>
        404 — Page Not Found
      </h1>
      <p className="text-muted mb-6" style={{ maxWidth: '460px' }}>
        The page you are looking for might have been moved or does not exist. Let's get you back to safe ground.
      </p>
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <Link to="/" className="btn btn-primary">
          <Home size={15} />
          <span>Go to Home</span>
        </Link>
        <Link to="/services" className="btn btn-secondary">
          <span>Browse Services</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
};
