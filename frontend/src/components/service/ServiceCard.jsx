import React from 'react';
import { Link } from 'react-router-dom';
import { RatingStars } from '../common/RatingStars';
import { formatCurrency } from '../../utils/formatters';
import { resolveServiceImage } from '../../utils/imageResolver';
import { CategoryIcon } from '../../utils/categoryIcons';
import { Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export const ServiceCard = ({ service }) => {
  const imageUrl = resolveServiceImage(service);

  return (
    <div className="card card-hoverable flex flex-col" style={{ height: '100%' }}>
      {/* Service Header / Image */}
      <div style={{ position: 'relative', height: '190px', overflow: 'hidden', backgroundColor: 'var(--neutral-100)' }}>
        <img
          src={imageUrl}
          alt={service.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
          loading="lazy"
        />
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'rgba(11, 30, 59, 0.88)',
            backdropFilter: 'blur(6px)',
            color: 'var(--white)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <CategoryIcon categoryName={service.categoryName} size={13} strokeWidth={2.2} />
          <span>{service.categoryName}</span>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            background: 'rgba(5, 150, 105, 0.92)',
            backdropFilter: 'blur(4px)',
            color: 'var(--white)',
            padding: '3px 9px',
            borderRadius: 'var(--radius-full)',
            fontSize: '10px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
          }}
        >
          <ShieldCheck size={12} strokeWidth={2.5} />
          <span>Verified Quality</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body flex-1 flex flex-col justify-between" style={{ padding: '1.25rem' }}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <RatingStars rating={service.rating || 4.9} reviewCount={service.reviewCount || 34} size="sm" />
            <span className="text-xs text-muted font-semibold flex items-center gap-1">
              <Clock size={13} color="var(--neutral-400)" />
              <span>{service.durationMinutes || 60} mins</span>
            </span>
          </div>

          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--neutral-900)', lineHeight: 1.3 }}>
            {service.name}
          </h4>

          <p className="text-xs text-muted line-clamp-2" style={{ lineHeight: 1.55, marginBottom: '1.25rem' }}>
            {service.shortDescription || service.description}
          </p>
        </div>

        {/* Price & CTA */}
        <div
          style={{
            borderTop: '1px solid var(--neutral-200)',
            paddingTop: '0.875rem',
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span className="text-2xs text-muted uppercase font-bold" style={{ display: 'block', letterSpacing: '0.04em' }}>Starting from</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-800)' }}>
              {formatCurrency(service.startingPrice || service.basePrice || 299)}
            </span>
          </div>

          <Link to={`/services/detail/${service.id}`} className="btn btn-sm btn-primary">
            <span>View Details</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};
