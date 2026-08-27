import { mockProviders } from '../mock/providers';

const delay = (ms = 180) => new Promise(resolve => setTimeout(resolve, ms));

let providersState = [...mockProviders];

export const providerService = {
  getProviders: async (filters = {}) => {
    await delay();
    let result = [...providersState];

    if (filters.category) {
      result = result.filter(p => 
        p.categorySlug === filters.category.toLowerCase() || 
        p.service.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.service.toLowerCase().includes(q) ||
        (p.companyName && p.companyName.toLowerCase().includes(q)) ||
        p.serviceArea.toLowerCase().includes(q)
      );
    }

    if (filters.minRating) {
      result = result.filter(p => p.rating >= Number(filters.minRating));
    }

    if (filters.maxPrice) {
      result = result.filter(p => p.startingPrice <= Number(filters.maxPrice));
    }

    if (filters.onlyAvailable) {
      result = result.filter(p => p.available);
    }

    if (filters.verifiedOnly) {
      result = result.filter(p => p.verificationStatus === 'VERIFIED');
    }

    return result;
  },

  getFeaturedProviders: async () => {
    await delay(120);
    return providersState.filter(p => p.verificationStatus === 'VERIFIED' && p.rating >= 4.85).slice(0, 4);
  },

  getProviderById: async (id) => {
    await delay();
    const provider = providersState.find(p => p.id === Number(id));
    if (!provider) {
      throw new Error(`Provider not found with ID ${id}`);
    }
    return { ...provider };
  },

  updateProviderProfile: async (id, updatedFields) => {
    await delay();
    providersState = providersState.map(p => {
      if (p.id === Number(id)) {
        // Verification status cannot be changed directly by provider
        const { verificationStatus, ...allowedUpdates } = updatedFields;
        return { ...p, ...allowedUpdates };
      }
      return p;
    });
    return providersState.find(p => p.id === Number(id));
  },

  toggleAvailability: async (id) => {
    await delay(100);
    providersState = providersState.map(p => {
      if (p.id === Number(id)) {
        return { ...p, available: !p.available };
      }
      return p;
    });
    const updated = providersState.find(p => p.id === Number(id));
    return updated.available;
  },

  getProviderServices: async (providerId) => {
    await delay();
    const provider = providersState.find(p => p.id === Number(providerId));
    return provider?.pricingDetails || [];
  },

  addProviderService: async (providerId, newService) => {
    await delay();
    const provider = providersState.find(p => p.id === Number(providerId));
    if (provider) {
      provider.pricingDetails = [...(provider.pricingDetails || []), newService];
    }
    return provider?.pricingDetails;
  },

  deleteProviderService: async (providerId, serviceItem) => {
    await delay();
    const provider = providersState.find(p => p.id === Number(providerId));
    if (provider) {
      provider.pricingDetails = provider.pricingDetails.filter(s => s.item !== serviceItem);
    }
    return provider?.pricingDetails;
  }
};
