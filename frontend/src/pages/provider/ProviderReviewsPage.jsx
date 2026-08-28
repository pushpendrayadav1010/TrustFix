import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reviewService } from '../../services/reviewService';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { RatingStars } from '../../components/common/RatingStars';
import { LoadingSpinner } from '../../components/common/FeedbackStates';
import { formatDate } from '../../utils/formatters';

export const ProviderReviewsPage = () => {
  const { providerProfile } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!providerProfile?.id) {
        setReviews([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await reviewService.getProviderReviews(providerProfile.id);
        setReviews(data);
      } catch (e) {
        console.error('Failed to fetch provider reviews:', e);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [providerProfile]);

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    const star = Math.floor(r.rating) || 5;
    if (ratingCounts[star] !== undefined) ratingCounts[star]++;
  });

  return (
    <div className="provider-reviews-page">
      <DashboardHeader
        title="Customer Ratings & Reviews"
        subtitle="Feedback from homeowners who completed verified service orders with you."
      />

      <div className="dashboard-content">
        {loading ? (
          <LoadingSpinner message="Fetching customer reviews..." />
        ) : (
          <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            
            {/* Rating Breakdown Card */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                Ratings Performance
              </h3>

              <div className="flex items-center gap-4 mb-6">
                <div style={{ textAlign: 'center' }}>
                  <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--neutral-900)', margin: 0, lineHeight: 1 }}>
                    {providerProfile?.rating || 4.9}
                  </h1>
                  <RatingStars rating={providerProfile?.rating || 4.9} showScore={false} size="md" />
                  <span className="text-xs text-muted block mt-1">out of 5 stars</span>
                </div>

                <div className="flex-1" style={{ borderLeft: '1px solid var(--neutral-200)', paddingLeft: '1.5rem' }}>
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = ratingCounts[stars] || 0;
                    const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;

                    return (
                      <div key={stars} className="flex items-center gap-2 mb-1 text-xs">
                        <span style={{ width: '40px' }}>{stars} Star</span>
                        <div
                          style={{
                            flex: 1,
                            height: '8px',
                            backgroundColor: 'var(--neutral-200)',
                            borderRadius: 'var(--radius-full)',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${percent}%`,
                              height: '100%',
                              backgroundColor: '#F59E0B',
                            }}
                          />
                        </div>
                        <span style={{ width: '24px', textAlign: 'right' }} className="text-muted">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--success-50)',
                  border: '1px solid var(--success-100)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '12px',
                  color: 'var(--success-800)',
                }}
              >
                ✓ Maintain a 4.5+ rating to retain Verified Top Provider badge priority.
              </div>
            </div>

            {/* Customer Reviews Feed */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
                Recent Verified Reviews ({reviews.length})
              </h3>

              {reviews.length === 0 ? (
                <p className="text-sm text-muted">No reviews received yet.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {reviews.map(rev => (
                    <div
                      key={rev.id}
                      style={{
                        padding: '1rem',
                        backgroundColor: 'var(--neutral-50)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--neutral-200)',
                      }}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={rev.customerAvatar}
                            alt={rev.customerName}
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <strong className="text-sm">{rev.customerName}</strong>
                          <span className="badge badge-verified" style={{ fontSize: '10px' }}>✓ Verified Job</span>
                        </div>
                        <span className="text-xs text-muted">{formatDate(rev.date)}</span>
                      </div>

                      <div className="mb-2">
                        <RatingStars rating={rev.rating} showScore={false} size="sm" />
                        <span className="text-xs text-muted ml-2 font-semibold">({rev.serviceName})</span>
                      </div>

                      <p className="text-xs text-neutral-700" style={{ margin: 0, lineHeight: 1.5 }}>
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
