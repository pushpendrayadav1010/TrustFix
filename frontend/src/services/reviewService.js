import apiClient from './api';

export const reviewService = {
  getProviderReviews: async (providerId) => {
    if (!providerId) return [];
    try {
      const response = await apiClient.get(`/reviews/provider/${providerId}`);
      return response.data.map((r) => ({
        id: r.id,
        bookingId: r.bookingId,
        providerId: r.providerId,
        providerName: r.providerName,
        customerId: r.customerId,
        customerName: r.customerName || 'Verified Homeowner',
        customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        rating: r.rating || 5,
        date: r.createdAt ? r.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
        serviceName: r.serviceName || 'Home Service',
        comment: r.comment || '',
        verifiedBooking: true,
      }));
    } catch (err) {
      console.error('Failed to fetch provider reviews:', err);
      return [];
    }
  },

  createReview: async ({ bookingId, rating, comment }) => {
    if (!bookingId) throw new Error('Booking ID is required to submit a review');
    const response = await apiClient.post(
      `/reviews/booking/${bookingId}?rating=${rating || 5}&comment=${encodeURIComponent(comment || '')}`
    );
    const r = response.data;
    return {
      id: r.id,
      bookingId: r.bookingId,
      providerId: r.providerId,
      providerName: r.providerName,
      customerId: r.customerId,
      customerName: r.customerName || 'Verified Homeowner',
      rating: r.rating || 5,
      date: r.createdAt ? r.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
      serviceName: r.serviceName || 'Home Service',
      comment: r.comment || '',
      verifiedBooking: true,
    };
  },
};
