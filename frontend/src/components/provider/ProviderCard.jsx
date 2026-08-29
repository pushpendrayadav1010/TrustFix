import React from 'react';
import { Link } from 'react-router-dom';
import { RatingStars } from '../common/RatingStars';
import { VerificationBadge } from '../common/VerificationBadge';
import { formatCurrency } from '../../utils/formatters';
import { resolveProviderAvatar } from '../../utils/imageResolver';
import { MapPin, Map, ArrowRight } from 'lucide-react';

export const ProviderCard = ({ provider, onSelectOnMap, isSelected = false }) => {
  const avatarUrl = provider.avatar || resolveProviderAvatar(provider);

  return (
    <div className={`card card-hoverable ${isSelected ? 'border-primary' : ''}`} style={{ position: 'relative' }}>
      <div className="card-body">
        <div className="flex items-start gap-4">
          {/* Avatar with Status Dot */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src={avatarUrl}
              alt={provider.name}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-lg)',
                objectFit: 'cover',
                border: '2px solid var(--white)',
                boxShadow: 'var(--shadow-sm)',
              }}
            />
            <span
              className={`status-dot ${provider.available ? 'online' : 'offline'}`}
              style={{ position: 'absolute', bottom: '-2px', right: '-2px' }}
              title={provider.available ? 'Available for bookings' : 'Currently busy'}
            />
          </div>

          {/* Core Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between flex-wrap gap-1 mb-1">
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--neutral-900)' }}>
                {provider.name}
              </h4>
              <VerificationBadge status={provider.verificationStatus} />
            </div>

            {provider.companyName && (
              <p className="text-xs font-semibold" style={{ color: 'var(--primary-700)', marginBottom: '4px' }}>
                {provider.companyName}
              </p>
            )}

            <div className="flex items-center gap-2 flex-wrap text-xs text-muted mb-2">
              <span className="font-semibold" style={{ color: 'var(--neutral-800)' }}>
                {provider.service}
              </span>
              <span>•</span>
              <span>{provider.experience} yrs exp</span>
              <span>•</span>
              <span>{provider.completedJobs || 50}+ jobs</span>
            </div>

            {/* Ratings */}
            <div className="mb-2">
              <RatingStars rating={provider.rating} reviewCount={provider.reviewCount} size="sm" />
            </div>

            {/* Service Area */}
            <p className="text-xs text-muted mb-3 flex items-center gap-1">
              <MapPin size={12} color="var(--neutral-400)" />
              <span className="text-truncate">Area: <strong>{provider.serviceArea}</strong></span>
            </p>

            {/* Bottom Row: Starting Price & CTAs */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--neutral-200)',
                paddingTop: '0.75rem',
                marginTop: '0.5rem',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div>
                <span className="text-xs text-muted block">Starting Price</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                  {formatCurrency(provider.startingPrice)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {onSelectOnMap && (
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => onSelectOnMap(provider.id)}
                    title="Locate on map"
                  >
                    <Map size={13} />
                    <span>Pin</span>
                  </button>
                )}

                <Link to={`/providers/${provider.id}`} className="btn btn-sm btn-primary">
                  <span>Book</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
