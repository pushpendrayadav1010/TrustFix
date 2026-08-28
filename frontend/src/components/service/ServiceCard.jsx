import React from 'react';
import { Link } from 'react-router-dom';
import { RatingStars } from '../common/RatingStars';
import { formatCurrency } from '../../utils/formatters';

export const ServiceCard = ({ service }) => {
  return (
    <div className="card card-hoverable flex flex-col">
      {/* Service Header / Image */}
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden', backgroundColor: 'var(--neutral-100)' }}>
        <img
          src={service.image}
          alt={service.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            color: 'var(--white)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {service.categoryName}
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <RatingStars rating={service.rating} reviewCount={service.reviewCount} size="sm" />
            <span className="text-xs text-muted font-semibold">{service.providerCount} Providers</span>
          </div>

          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--neutral-900)' }}>
            {service.name}
          </h4>

          <p className="text-xs text-muted" style={{ lineHeight: 1.5, marginBottom: '1rem' }}>
            {service.shortDescription}
          </p>
        </div>

        {/* Price & CTA */}
        <div
          style={{
            borderTop: '1px solid var(--neutral-200)',
            paddingTop: '0.75rem',
            marginTop: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span className="text-xs text-muted" style={{ display: 'block' }}>Starts at</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-800)' }}>
              {formatCurrency(service.startingPrice)}
            </span>
          </div>

          <Link to={`/services/detail/${service.id}`} className="btn btn-sm btn-primary">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
