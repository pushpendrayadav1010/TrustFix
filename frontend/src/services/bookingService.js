import { mockBookings } from '../mock/bookings';
import { mockProviders } from '../mock/providers';

const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

let bookingsState = [...mockBookings];

export const bookingService = {
  createBooking: async (bookingData) => {
    await delay(300);
    const provider = mockProviders.find(p => p.id === Number(bookingData.providerId));
    const newId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const basePrice = Number(bookingData.price) || 299;
    const tax = +(basePrice * 0.18).toFixed(2);
    const totalPrice = +(basePrice + tax).toFixed(2);

    const newBooking = {
      id: newId,
      customerId: bookingData.customerId || 1,
      customerName: bookingData.customerName || "Aarav Sharma",
      customerPhone: bookingData.customerPhone || "+91 98201 12345",
      customerEmail: bookingData.customerEmail || "customer@trustfix.com",
      providerId: provider?.id || 101,
      providerName: provider?.name || "Rajesh Kumar",
      providerPhone: provider?.phone || "+91 98202 23456",
      providerAvatar: provider?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      serviceId: bookingData.serviceId,
      serviceName: bookingData.serviceName || "Home Repair Service",
      categoryName: provider?.service || "General",
      date: bookingData.date,
      time: bookingData.time,
      status: "PENDING",
      price: basePrice,
      tax: tax,
      totalPrice: totalPrice,
      paymentStatus: "PENDING_POST_SERVICE",
      address: bookingData.address,
      latitude: bookingData.latitude || 19.1294,
      longitude: bookingData.longitude || 72.8752,
      description: bookingData.description || "General inspection requested",
      createdAt: new Date().toISOString(),
      timeline: [
        { 
          step: "Booking Created", 
          time: new Date().toLocaleString(), 
          done: true, 
          desc: "Booking request submitted by customer." 
        },
        { 
          step: "Provider Accepted", 
          time: "Awaiting confirmation", 
          done: false, 
          desc: `Waiting for ${provider?.name || 'Provider'} to accept.` 
        },
        { 
          step: "Service In Progress", 
          time: "Pending", 
          done: false, 
          desc: "Technician arrives at location." 
        },
        { 
          step: "Completed & Verified", 
          time: "Pending", 
          done: false, 
          desc: "Service completed, inspected, and verified." 
        }
      ]
    };

    bookingsState.unshift(newBooking);
    return newBooking;
  },

  getCustomerBookings: async (customerId, statusFilter = 'ALL') => {
    await delay();
    let result = bookingsState.filter(b => b.customerId === Number(customerId) || customerId === 1);
    if (statusFilter && statusFilter !== 'ALL') {
      result = result.filter(b => b.status === statusFilter);
    }
    return result;
  },

  getProviderBookings: async (providerId, statusFilter = 'ALL') => {
    await delay();
    let result = bookingsState.filter(b => b.providerId === Number(providerId) || providerId === 101);
    if (statusFilter && statusFilter !== 'ALL') {
      result = result.filter(b => b.status === statusFilter);
    }
    return result;
  },

  getBookingById: async (id) => {
    await delay();
    const booking = bookingsState.find(b => b.id === id);
    if (!booking) throw new Error(`Booking ${id} not found`);
    return { ...booking };
  },

  updateBookingStatus: async (id, newStatus) => {
    await delay(180);
    bookingsState = bookingsState.map(b => {
      if (b.id === id) {
        const updatedTimeline = [...b.timeline];
        const nowStr = new Date().toLocaleString();
        
        if (newStatus === 'CONFIRMED') {
          updatedTimeline[1] = { step: "Provider Accepted", time: nowStr, done: true, desc: "Provider accepted the appointment." };
        } else if (newStatus === 'IN_PROGRESS') {
          updatedTimeline[1] = { ...updatedTimeline[1], done: true };
          updatedTimeline[2] = { step: "Service In Progress", time: nowStr, done: true, desc: "Technician arrived and began service." };
        } else if (newStatus === 'COMPLETED') {
          updatedTimeline[1] = { ...updatedTimeline[1], done: true };
          updatedTimeline[2] = { ...updatedTimeline[2], done: true };
          updatedTimeline[3] = { step: "Completed & Verified", time: nowStr, done: true, desc: "Job completed and verified." };
        } else if (newStatus === 'CANCELLED') {
          updatedTimeline.push({ step: "Booking Cancelled", time: nowStr, done: true, desc: "Booking was cancelled." });
        }

        return {
          ...b,
          status: newStatus,
          paymentStatus: newStatus === 'COMPLETED' ? 'PAID' : b.paymentStatus,
          timeline: updatedTimeline,
          completedAt: newStatus === 'COMPLETED' ? new Date().toISOString() : b.completedAt
        };
      }
      return b;
    });

    return bookingsState.find(b => b.id === id);
  },

  cancelBooking: async (id, reason = "Customer request") => {
    await delay(150);
    return bookingService.updateBookingStatus(id, 'CANCELLED');
  }
};
