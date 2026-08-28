import { mockLocations, defaultMapCenter } from '../mock/locations';

const delay = (ms = 120) => new Promise(resolve => setTimeout(resolve, ms));

export const locationService = {
  getLocations: async () => {
    await delay();
    return [...mockLocations];
  },

  getProviderLocations: async (filters = {}) => {
    await delay();
    let locations = [...mockLocations];
    if (filters.service) {
      locations = locations.filter(l => l.service.toLowerCase().includes(filters.service.toLowerCase()));
    }
    if (filters.verifiedOnly) {
      locations = locations.filter(l => l.verified);
    }
    return locations;
  },

  getLocationByProviderId: async (providerId) => {
    await delay();
    const loc = mockLocations.find(l => l.providerId === Number(providerId));
    return loc || {
      latitude: defaultMapCenter.latitude,
      longitude: defaultMapCenter.longitude,
      serviceArea: "Mumbai Metropolitan Region",
      serviceRadiusKm: 10
    };
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
