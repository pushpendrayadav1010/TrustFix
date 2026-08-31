import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reviewService } from '../../services/reviewService';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { RatingStars } from '../../components/common/RatingStars';
import { LoadingSpinner, EmptyState } from '../../components/common/FeedbackStates';
import { formatDate } from '../../utils/formatters';
import { Star, CheckCircle2, MessageSquare, ThumbsUp, ShieldCheck } from 'lucide-react';

export const ProviderReviewsPage = () => {
  const { providerProfile } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!providerProfile?.id) return;
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const data = await reviewService.getProviderReviews(providerProfile.id);
        setReviews(data);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [providerProfile?.id]);

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalReviews).toFixed(1)
    : (providerProfile?.rating || '5.0');

  const starCounts = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => Math.round(r.rating) === stars).length,
    percentage: totalReviews > 0
      ? ((reviews.filter(r => Math.round(r.rating) === stars).length / totalReviews) * 100).toFixed(0)
      : (stars === 5 ? 100 : 0),
  }));

  return (
    <div>
      <DashboardHeader
        title="Customer Reviews & Ratings"
        subtitle="Feedback from homeowners who completed verified service bookings."
      />

      <div className="dashboard-content">
        
        {/* Rating Summary Card */}
        <div className="card mb-8" style={{ padding: '2rem', backgroundColor: 'var(--white)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            {/* Left Score */}
            <div className="text-center">
              <span style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--neutral-900)', lineHeight: 1 }}>
                {avgRating}
              </span>
              <div className="flex justify-center my-2">
                <RatingStars rating={parseFloat(avgRating)} showScore={false} size="lg" />
              </div>
              <span className="text-xs text-muted block">
                Based on <strong>{totalReviews} verified bookings</strong>
              </span>
            </div>

            {/* Right Distribution Bars */}
            <div className="flex flex-col gap-1.5" style={{ flex: 1 }}>
              {starCounts.map((s) => (
                <div key={s.stars} className="flex items-center gap-2 text-xs">
                  <span style={{ width: '45px', fontWeight: 600, color: 'var(--neutral-700)' }}>
                    {s.stars} Stars
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: '8px',
                      backgroundColor: 'var(--neutral-100)',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${s.percentage}%`,
                        height: '100%',
                        backgroundColor: '#F59E0B',
                        borderRadius: 'var(--radius-full)',
                      }}
                    />
                  </div>
                  <span style={{ width: '30px', textAlign: 'right', color: 'var(--neutral-500)' }}>
                    {s.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--white)' }}>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--neutral-900)' }}>
            Customer Feedback ({reviews.length})
          </h4>

          {loading ? (
            <LoadingSpinner message="Loading customer feedback..." />
          ) : reviews.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No customer reviews yet"
              description="Reviews will automatically appear here once customers complete and rate their service appointments."
            />
          ) : (
            <div className="flex flex-col gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  style={{
                    padding: '1.25rem',
                    backgroundColor: 'var(--neutral-50)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--neutral-200)',
                  }}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rev.customerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                        alt={rev.customerName}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-bold">{rev.customerName}</strong>
                          <span className="badge badge-verified" style={{ fontSize: '10px', padding: '1px 5px' }}>
                            Verified
                          </span>
                        </div>
                        <span className="text-2xs text-muted">{rev.serviceName || 'Home Service'}</span>
                      </div>
                    </div>

                    <span className="text-xs text-muted">{formatDate(rev.date)}</span>
                  </div>

                  <div className="mb-2">
                    <RatingStars rating={rev.rating} showScore={false} size="sm" />
                  </div>

                  <p className="text-xs text-muted mb-0" style={{ lineHeight: 1.6, color: 'var(--neutral-800)' }}>
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
