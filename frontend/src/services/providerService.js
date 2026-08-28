import apiClient from './api';

const mapProviderProfile = (p) => {
  if (!p) return null;
  return {
    id: p.id,
    userId: p.userId,
    name: p.userName || 'Provider',
    companyName: p.businessName || 'Business Enterprise',
    businessName: p.businessName || 'Business Enterprise',
    phone: p.userPhone || '',
    email: p.userEmail || '',
    bio: p.bio || '',
    experience: p.experienceYears || 0,
    experienceYears: p.experienceYears || 0,
    verificationStatus: p.verificationStatus || 'PENDING',
    documentUrl: p.documentUrl,
    latitude: p.latitude || 19.1136,
    longitude: p.longitude || 72.8697,
    serviceRadiusKm: p.serviceRadiusKm || 25,
    city: p.city || 'Mumbai',
    state: p.state || 'Maharashtra',
    postalCode: p.postalCode || '400053',
    rating: p.rating !== undefined && p.rating > 0 ? p.rating : 4.9,
    reviewCount: p.reviewCount !== undefined ? p.reviewCount : 0,
    available: p.available !== undefined ? p.available : true,
    serviceArea: p.city ? `${p.city}, ${p.state || ''}` : 'Mumbai',
    service: 'Home Service',
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
        try {
          const createRes = await apiClient.post(`/providers/user/${userId}`, {
            businessName: 'Rajesh Electricals & Home Repair',
            bio: 'Professional certified home service specialist with 8+ years experience.',
            experienceYears: 8,
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400053',
            available: true
          });
          return mapProviderProfile(createRes.data);
        } catch (createErr) {
          console.error('[providerService] Failed to auto-create provider profile:', createErr);
        }
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

      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        list = list.filter(p =>
          p.name?.toLowerCase().includes(q) ||
          p.companyName?.toLowerCase().includes(q) ||
          p.city?.toLowerCase().includes(q) ||
          p.serviceArea?.toLowerCase().includes(q)
        );
      }
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
