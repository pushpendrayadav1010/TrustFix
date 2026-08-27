import { mockReviews } from '../mock/reviews';

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

let reviewsState = [...mockReviews];

export const reviewService = {
  getProviderReviews: async (providerId) => {
    await delay();
    return reviewsState.filter(r => r.providerId === Number(providerId));
  },

  createReview: async ({ bookingId, providerId, rating, comment, customerName, serviceName }) => {
    await delay(250);
    const newReview = {
      id: Date.now(),
      providerId: Number(providerId),
      bookingId,
      customerId: 1,
      customerName: customerName || "Aarav Sharma",
      customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      rating: Number(rating),
      date: new Date().toISOString().split('T')[0],
      serviceName: serviceName || "Home Service",
      comment,
      verifiedBooking: true
    };
    reviewsState.unshift(newReview);
    return newReview;
  }
};
