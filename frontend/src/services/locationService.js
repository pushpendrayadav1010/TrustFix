import { providerService } from './providerService';

const defaultMapCenter = {
  latitude: 19.1136,
  longitude: 72.8697,
  city: "Mumbai Metropolitan Region",
  zoom: 11
};

export const locationService = {
  getLocations: async () => {
    try {
      const providers = await providerService.getProviders();
      return providers.map(p => ({
        id: p.id,
        providerId: p.id,
        name: p.name || p.companyName,
        service: p.service || 'Home Service',
        verified: p.verificationStatus === 'VERIFIED',
        latitude: p.latitude || 19.1136,
        longitude: p.longitude || 72.8697,
        serviceRadiusKm: p.serviceRadiusKm || 25,
        rating: p.rating || 4.9,
        startingPrice: p.startingPrice || 499,
        serviceArea: p.serviceArea || `${p.city || 'Mumbai'}, ${p.state || 'Maharashtra'}`
      }));
    } catch (e) {
      return [];
    }
  },

  getProviderLocations: async (filters = {}) => {
    try {
      const providers = await providerService.getProviders({
        category: filters.service || filters.category,
        verifiedOnly: filters.verifiedOnly !== false,
        onlyAvailable: filters.onlyAvailable,
        search: filters.search
      });

      return providers.map(p => ({
        id: p.id,
        providerId: p.id,
        name: p.name || p.companyName,
        service: p.service || 'Home Service',
        verified: p.verificationStatus === 'VERIFIED',
        latitude: p.latitude || 19.1136,
        longitude: p.longitude || 72.8697,
        serviceRadiusKm: p.serviceRadiusKm || 25,
        rating: p.rating || 4.9,
        startingPrice: p.startingPrice || 499,
        serviceArea: p.serviceArea || `${p.city || 'Mumbai'}, ${p.state || 'Maharashtra'}`
      }));
    } catch (e) {
      return [];
    }
  },

  getLocationByProviderId: async (providerId) => {
    try {
      const p = await providerService.getProviderById(providerId);
      return {
        id: p.id,
        providerId: p.id,
        name: p.name || p.companyName,
        service: p.service || 'Home Service',
        verified: p.verificationStatus === 'VERIFIED',
        latitude: p.latitude || defaultMapCenter.latitude,
        longitude: p.longitude || defaultMapCenter.longitude,
        serviceRadiusKm: p.serviceRadiusKm || 25,
        rating: p.rating || 4.9,
        startingPrice: p.startingPrice || 499,
        serviceArea: p.serviceArea || `${p.city || 'Mumbai'}, ${p.state || 'Maharashtra'}`
      };
    } catch (e) {
      return {
        latitude: defaultMapCenter.latitude,
        longitude: defaultMapCenter.longitude,
        serviceArea: "Mumbai Metropolitan Region",
        serviceRadiusKm: 25
      };
    }
  },

  getDefaultCenter: () => defaultMapCenter,

  // Helper for UI simulated distance display (clearly indicated as mock/estimated UI display)
  calculateEstimatedDistanceKm: (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return +(R * c).toFixed(1);
  }
};
