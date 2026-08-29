import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 5, reviewCount, showScore = true, size = 'sm' }) => {
  const numRating = Number(rating) || 0;
  const starSize = size === 'lg' ? 18 : size === 'md' ? 15 : 13;

  return (
    <div className="rating-stars" aria-label={`Rated ${numRating.toFixed(1)} out of 5 stars`}>
      <div className="flex items-center gap-05">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const fillPercentage = Math.max(0, Math.min(1, numRating - (starIndex - 1)));
          const isFilled = fillPercentage >= 0.8;
          const isHalf = fillPercentage >= 0.3 && fillPercentage < 0.8;

          return (
            <span key={starIndex} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <Star
                size={starSize}
                strokeWidth={1.5}
                color="#F59E0B"
                fill={isFilled ? '#F59E0B' : isHalf ? 'url(#star-half-grad)' : 'none'}
                aria-hidden="true"
              />
            </span>
          );
        })}
      </div>

      {/* SVG linear gradient definition for half stars */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="star-half-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {showScore && <span className="rating-score">{numRating.toFixed(1)}</span>}
      {reviewCount !== undefined && (
        <span className="rating-count">({reviewCount})</span>
      )}
    </div>
  );
};
