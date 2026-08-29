import apiClient from './api';
import { resolveServiceImage, resolveCategoryImage } from '../utils/imageResolver';
import { sanitizeCategoryName, sanitizeCategoryDescription } from '../utils/categoryIcons';

export const categoryService = {
  // =========================
  // GET ALL CATEGORIES
  // =========================
  getCategories: async () => {
    const response = await apiClient.get('/categories');
    return response.data.map((category) => {
      const cleanName = sanitizeCategoryName(category.name);
      const cleanDesc = sanitizeCategoryDescription(category.description, cleanName);
      const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      return {
        id: category.id,
        rawName: category.name,
        name: cleanName,
        slug,
        icon: cleanName, // mapped via CategoryIcon component
        image: resolveCategoryImage(cleanName),
        description: cleanDesc,
        providerCount: 4,
        active: category.active !== false,
      };
    });
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

    return result.map((service) => {
      const resolvedImg = resolveServiceImage(service);
      const cleanCatName = sanitizeCategoryName(service.categoryName);
      
      return {
        id: service.id,
        name: service.name,
        description: service.description,
        shortDescription: service.description,
        basePrice: service.basePrice,
        price: service.basePrice,
        startingPrice: service.basePrice,
        durationInMinutes: service.durationInMinutes || 60,
        durationMinutes: service.durationInMinutes || 60,
        categoryId: service.categoryId,
        categoryName: cleanCatName,
        image: resolvedImg,
        imageUrl: resolvedImg,
        rating: 4.9,
        reviewCount: 28,
        providerCount: 3,
        included: [
          "Certified technician doorstep visit & inspection",
          "Complete diagnostic check and safety evaluation",
          "Standard labor & precision repair execution",
          "30-day TrustFix post-service warranty guarantee"
        ],
        excluded: [
          "Replacement spare parts and hardware billed separately with invoice",
          "Concealed wall cutting or major masonry work"
        ],
        active: service.active,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
      };
    });
  },

  // =========================
  // GET SERVICE BY ID
  // =========================
  getServiceById: async (id) => {
    const response = await apiClient.get(`/services/${id}`);
    const service = response.data;
    const resolvedImg = resolveServiceImage(service);
    const cleanCatName = sanitizeCategoryName(service.categoryName);

    return {
      id: service.id,
      name: service.name,
      description: service.description,
      shortDescription: service.description,
      basePrice: service.basePrice,
      price: service.basePrice,
      startingPrice: service.basePrice,
      durationInMinutes: service.durationInMinutes || 60,
      categoryId: service.categoryId,
      categoryName: cleanCatName,
      image: resolvedImg,
      imageUrl: resolvedImg,
      rating: 4.9,
      reviewCount: 28,
      providerCount: 3,
      included: [
        "Certified technician doorstep visit & inspection",
        "Complete diagnostic check and safety evaluation",
        "Standard labor & precision repair execution",
        "30-day TrustFix post-service warranty guarantee"
      ],
      excluded: [
        "Replacement spare parts and hardware billed separately with invoice",
        "Concealed wall cutting or major masonry work"
      ],
      active: service.active,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };
  },
};