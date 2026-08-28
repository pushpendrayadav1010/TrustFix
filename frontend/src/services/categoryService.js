import apiClient from './api';

export const categoryService = {
  // =========================
  // GET ALL CATEGORIES
  // =========================
  getCategories: async () => {
    const response = await apiClient.get('/categories');
    return response.data.map((category) => ({
      id: category.id,
      name: category.name,
      icon: category.iconUrl || '🔧',
      description: category.description,
      active: category.active !== false,
    }));
  },

  // =========================
  // GET SERVICES BY CATEGORY ID OR ALL
  // =========================
  getServices: async (filters = {}) => {
    let url = '/services/active';

    if (
      filters.categoryId !== undefined &&
      filters.categoryId !== null &&
      filters.categoryId !== '' &&
      filters.categoryId !== 'all'
    ) {
      url = `/services/category/${filters.categoryId}`;
    }

    const response = await apiClient.get(url);
    let result = Array.isArray(response.data) ? response.data : [];

    // Search filter
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (service) =>
          service.name?.toLowerCase().includes(q) ||
          service.description?.toLowerCase().includes(q) ||
          service.categoryName?.toLowerCase().includes(q)
      );
    }

    return result.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      shortDescription: service.description,
      basePrice: service.basePrice,
      price: service.basePrice,
      durationInMinutes: service.durationInMinutes,
      categoryId: service.categoryId,
      categoryName: service.categoryName,
      imageUrl: service.imageUrl,
      active: service.active,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    }));
  },

  // =========================
  // GET SERVICE BY ID
  // =========================
  getServiceById: async (id) => {
    const response = await apiClient.get(`/services/${id}`);
    const service = response.data;

    return {
      id: service.id,
      name: service.name,
      description: service.description,
      shortDescription: service.description,
      basePrice: service.basePrice,
      price: service.basePrice,
      durationInMinutes: service.durationInMinutes,
      categoryId: service.categoryId,
      categoryName: service.categoryName,
      imageUrl: service.imageUrl,
      active: service.active,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };
  },
};