import React from 'react';

export const RatingStars = ({ rating = 5, reviewCount, showScore = true, size = 'sm' }) => {
  const rounded = Math.round(rating * 2) / 2;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= rounded) {
      stars.push('★');
    } else if (i - 0.5 <= rounded) {
      stars.push('★'); // or half star
    } else {
      stars.push('☆');
    }
  }

  return (
    <div className="rating-stars" aria-label={`Rated ${rating} out of 5 stars`}>
      <span style={{ fontSize: size === 'lg' ? '1.25rem' : '0.95rem', letterSpacing: '1px' }}>
        {stars.join('')}
      </span>
      {showScore && <span className="rating-score">{Number(rating).toFixed(1)}</span>}
      {reviewCount !== undefined && (
        <span className="rating-count">({reviewCount})</span>
      )}
    </div>
  );
};
