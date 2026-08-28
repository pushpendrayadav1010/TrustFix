import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="container text-center section-py" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--neutral-900)', marginBottom: '0.5rem' }}>
        404 — Page Not Found
      </h1>
      <p className="text-muted mb-6" style={{ maxWidth: '460px' }}>
        The page you are looking for might have been moved or does not exist. Let's get you back to safe ground.
      </p>
      <div className="flex gap-3">
        <Link to="/" className="btn btn-primary">
          Go to Home
        </Link>
        <Link to="/services" className="btn btn-secondary">
          Browse Services
        </Link>
      </div>
    </div>
  );
};
