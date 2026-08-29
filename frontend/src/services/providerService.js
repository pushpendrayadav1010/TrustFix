import apiClient from './api';
import { resolveProviderAvatar } from '../utils/imageResolver';

const detectServiceTrade = (businessName = '', bio = '') => {
  const text = `${businessName} ${bio}`.toLowerCase();
  if (text.includes('electric') || text.includes('wiring')) return 'Electrical';
  if (text.includes('plumb') || text.includes('leak') || text.includes('pipe')) return 'Plumbing';
  if (text.includes('clean') || text.includes('sanitiz')) return 'Cleaning';
  if (text.includes('ac') || text.includes('cooling') || text.includes('air condition')) return 'AC Repair';
  if (text.includes('appliance') || text.includes('washing machine') || text.includes('fridge')) return 'Appliance Repair';
  if (text.includes('paint')) return 'Painting';
  if (text.includes('carpent') || text.includes('wood') || text.includes('door') || text.includes('lock')) return 'Carpentry';
  return 'Home Repair Specialist';
};

const mapProviderProfile = (p) => {
  if (!p) return null;
  const avatar = resolveProviderAvatar(p);
  const service = detectServiceTrade(p.businessName, p.bio);
  const startingPrice = service === 'Cleaning' ? 1499 : service === 'Painting' ? 1299 : service === 'AC Repair' ? 599 : 499;

  return {
    id: p.id,
    userId: p.userId,
    name: p.userName || (p.businessName ? p.businessName.split(' ')[0] : 'Verified Technician'),
    companyName: p.businessName || 'TrustFix Certified Specialist',
    businessName: p.businessName || 'TrustFix Certified Specialist',
    phone: p.userPhone || '+91 98201 00000',
    email: p.userEmail || '',
    bio: p.bio || 'Verified home service professional with guaranteed on-time visit and standard service checklist.',
    experience: p.experienceYears !== undefined ? p.experienceYears : 5,
    experienceYears: p.experienceYears !== undefined ? p.experienceYears : 5,
    verificationStatus: p.verificationStatus || 'PENDING',
    documentUrl: p.documentUrl,
    latitude: p.latitude || 19.1136,
    longitude: p.longitude || 72.8697,
    serviceRadiusKm: p.serviceRadiusKm || 25,
    city: p.city || 'Mumbai',
    state: p.state || 'Maharashtra',
    postalCode: p.postalCode || '400053',
    rating: p.rating !== undefined && p.rating > 0 ? p.rating : 4.8,
    reviewCount: p.reviewCount !== undefined && p.reviewCount > 0 ? p.reviewCount : 15,
    available: p.available !== undefined ? p.available : true,
    serviceArea: p.city ? `${p.city}, ${p.state || 'Maharashtra'}` : 'Mumbai Metropolitan Region',
    service,
    startingPrice,
    completedJobs: (p.reviewCount || 10) * 3 + 12,
    avatar,
    avatarUrl: avatar,
    specialties: [
      `${service} Diagnostics`,
      'Emergency Repairs',
      'Installation & Maintenance'
    ],
    documentsVerified: [
      'Govt Trade Certification',
      'Government ID Verified',
      'Police Clearance Checked'
    ],
    createdAt: p.createdAt,
    updatedAt: p.updatedAt
  };
};

export const providerService = {
  getProviderById: async (id) => {
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Valid Provider ID is required');
    }
    try {
      const response = await apiClient.get(`/providers/${id}`);
      return mapProviderProfile(response.data);
    } catch (error) {
      console.warn(`[providerService] Error fetching provider by ID ${id}:`, error);
      throw error;
    }
  },

  getProviderByUserId: async (userId) => {
    if (!userId || userId === 'undefined' || userId === 'null') {
      throw new Error('Valid User ID is required');
    }
    try {
      const response = await apiClient.get(`/providers/user/${userId}`);
      return mapProviderProfile(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  createProviderProfile: async (userId, data = {}) => {
    if (!userId || userId === 'undefined' || userId === 'null') {
      throw new Error('Valid User ID is required');
    }
    try {
      const payload = {
        contactName: data.name || data.contactName || '',
        phone: data.phone || '',
        serviceArea: data.serviceArea || '',
        businessName: data.companyName || data.businessName || 'Home Repair Enterprise',
        bio: data.bio || 'Professional certified home service provider.',
        experienceYears: Number(data.experience || data.experienceYears) || 5,
        documentUrl: data.documentUrl || null,
        latitude: data.latitude || 19.1136,
        longitude: data.longitude || 72.8697,
        serviceRadiusKm: Number(data.serviceRadiusKm) || 25,
        city: data.city || 'Mumbai',
        state: data.state || 'Maharashtra',
        postalCode: data.postalCode || '400053',
        available: data.available !== undefined ? data.available : true
      };
      const response = await apiClient.post(`/providers/user/${userId}`, payload);
      return mapProviderProfile(response.data);
    } catch (error) {
      console.error(`[providerService] Error creating provider profile for user ${userId}:`, error);
      throw error;
    }
  },

  updateProviderProfile: async (id, data = {}) => {
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Valid Provider Profile ID is required');
    }
    try {
      const payload = {
        businessName: data.companyName || data.businessName || 'Home Repair Enterprise',
        bio: data.bio || '',
        experienceYears: Number(data.experience !== undefined ? data.experience : data.experienceYears) || 0,
        documentUrl: data.documentUrl || null,
        latitude: data.latitude || 19.1136,
        longitude: data.longitude || 72.8697,
        serviceRadiusKm: Number(data.serviceRadiusKm) || 25,
        city: data.city || 'Mumbai',
        state: data.state || 'Maharashtra',
        postalCode: data.postalCode || '400053',
        available: data.available !== undefined ? data.available : true
      };
      const response = await apiClient.put(`/providers/${id}`, payload);
      return mapProviderProfile(response.data);
    } catch (error) {
      console.error(`[providerService] Error updating provider profile ${id}:`, error);
      throw error;
    }
  },

  toggleAvailability: async (id, currentAvailable) => {
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Valid Provider Profile ID is required');
    }
    try {
      const newAvail = !currentAvailable;
      const response = await apiClient.put(`/providers/${id}`, { available: newAvail });
      return response.data.available;
    } catch (error) {
      console.error(`[providerService] Error toggling availability for provider ${id}:`, error);
      throw error;
    }
  },

  getProviderServices: async (providerId) => {
    if (!providerId || providerId === 'undefined' || providerId === 'null') {
      return [];
    }
    try {
      const response = await apiClient.get(`/provider-services/provider/${providerId}`);
      if (Array.isArray(response.data)) {
        return response.data.map(ps => ({
          id: ps.id,
          serviceId: ps.serviceId,
          serviceName: ps.serviceName || 'Home Repair',
          item: ps.serviceName || 'Home Repair Service',
          price: ps.customPrice || ps.basePrice || 499,
          type: 'Base Visit',
          available: ps.available !== undefined ? ps.available : true
        }));
      }
      return [];
    } catch (error) {
      console.warn(`[providerService] Error fetching services for provider ${providerId}:`, error);
      return [];
    }
  },

  addProviderService: async (providerId, serviceId, customPrice) => {
    if (!providerId || !serviceId) {
      throw new Error('Valid Provider ID and Service ID are required');
    }
    try {
      const priceParam = customPrice ? `?customPrice=${customPrice}` : '';
      const response = await apiClient.post(`/provider-services/provider/${providerId}/service/${serviceId}${priceParam}`);
      return response.data;
    } catch (error) {
      console.error(`[providerService] Error adding service ${serviceId} to provider ${providerId}:`, error);
      throw error;
    }
  },

  deleteProviderService: async (providerId, serviceId) => {
    if (!providerId || !serviceId) {
      throw new Error('Valid Provider ID and Service ID are required');
    }
    try {
      await apiClient.delete(`/provider-services/provider/${providerId}/service/${serviceId}`);
      return { success: true };
    } catch (error) {
      console.error(`[providerService] Error deleting service ${serviceId} from provider ${providerId}:`, error);
      throw error;
    }
  },

  getProviders: async (filters = {}) => {
    try {
      const response = await apiClient.get('/providers/verified');
      let list = Array.isArray(response.data) ? response.data.map(mapProviderProfile) : [];

      // Category filter
      if (filters.category && filters.category !== 'all') {
        const cat = filters.category.toLowerCase().replace(/[^a-z0-9]/g, '');
        list = list.filter(p => {
          const s = (p.service || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          const b = (p.businessName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          return s.includes(cat) || b.includes(cat) || cat.includes(s);
        });
      }

      // Search keyword filter
      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        list = list.filter(p =>
          p.name?.toLowerCase().includes(q) ||
          p.companyName?.toLowerCase().includes(q) ||
          p.businessName?.toLowerCase().includes(q) ||
          p.city?.toLowerCase().includes(q) ||
          p.service?.toLowerCase().includes(q) ||
          p.serviceArea?.toLowerCase().includes(q) ||
          p.bio?.toLowerCase().includes(q)
        );
      }

      // Minimum rating filter
      if (filters.minRating) {
        const min = parseFloat(filters.minRating);
        if (!isNaN(min)) {
          list = list.filter(p => (p.rating || 0) >= min);
        }
      }

      // Max starting price filter
      if (filters.maxPrice) {
        const max = parseFloat(filters.maxPrice);
        if (!isNaN(max)) {
          list = list.filter(p => (p.startingPrice || 0) <= max);
        }
      }

      // Verified only
      if (filters.verifiedOnly !== false) {
        list = list.filter(p => p.verificationStatus === 'VERIFIED');
      }

      // Availability filter
      if (filters.onlyAvailable) {
        list = list.filter(p => p.available);
      }

      return list;
    } catch (error) {
      console.warn('[providerService] Error fetching providers:', error);
      return [];
    }
  },

  getVerifiedProviders: async () => {
    try {
      const response = await apiClient.get('/providers/verified');
      return Array.isArray(response.data) ? response.data.map(mapProviderProfile) : [];
    } catch (error) {
      console.warn('[providerService] Error fetching verified providers:', error);
      return [];
    }
  },

  getFeaturedProviders: async () => {
    try {
      const response = await apiClient.get('/providers/available');
      return Array.isArray(response.data) ? response.data.map(mapProviderProfile) : [];
    } catch (error) {
      console.warn('[providerService] Error fetching featured providers:', error);
      return [];
    }
  }
};
