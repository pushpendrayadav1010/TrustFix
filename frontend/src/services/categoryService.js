import { mockCategories } from '../mock/categories';
import { mockServices } from '../mock/services';

const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

export const categoryService = {
  getCategories: async () => {
    await delay();
    return [...mockCategories];
  },

  getCategoryBySlug: async (slug) => {
    await delay();
    const category = mockCategories.find(c => c.slug === slug || c.name.toLowerCase() === slug.toLowerCase());
    return category || null;
  },

  getServices: async (filters = {}) => {
    await delay();
    let result = [...mockServices];
    if (filters.categorySlug) {
      const cat = mockCategories.find(c => c.slug === filters.categorySlug);
      if (cat) {
        result = result.filter(s => s.categoryId === cat.id);
      }
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.categoryName.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q)
      );
    }
    return result;
  },

  getServiceById: async (id) => {
    await delay();
    const service = mockServices.find(s => s.id === Number(id));
    if (!service) throw new Error(`Service not found with ID ${id}`);
    return { ...service };
  }
};
