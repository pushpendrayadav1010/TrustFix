import apiClient from './api';

export const adminService = {
  // Users Management
  getUsersByRole: async (role) => {
    const response = await apiClient.get(`/users/role/${role}`);
    return response.data;
  },

  getAllUsers: async () => {
    // Fetch users for all roles (CUSTOMER, PROVIDER, ADMIN)
    const [customers, providers, admins] = await Promise.all([
      apiClient.get('/users/role/CUSTOMER').catch(() => ({ data: [] })),
      apiClient.get('/users/role/PROVIDER').catch(() => ({ data: [] })),
      apiClient.get('/users/role/ADMIN').catch(() => ({ data: [] })),
    ]);

    const all = [...(customers.data || []), ...(providers.data || []), ...(admins.data || [])];
    // Sort by ID descending
    return all.sort((a, b) => b.id - a.id);
  },

  getUserById: async (userId) => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  },

  // Provider Verification & Management
  getVerifiedProviders: async () => {
    const response = await apiClient.get('/providers/verified');
    return response.data;
  },

  getProviderByUserId: async (userId) => {
    try {
      const response = await apiClient.get(`/providers/user/${userId}`);
      return response.data;
    } catch (err) {
      return null;
    }
  },

  getProviderById: async (providerId) => {
    const response = await apiClient.get(`/providers/${providerId}`);
    return response.data;
  },

  getAllProviderProfiles: async () => {
    // Fetch all provider users and resolve their ProviderProfile
    const providerUsersResponse = await apiClient.get('/users/role/PROVIDER').catch(() => ({ data: [] }));
    const providerUsers = providerUsersResponse.data || [];

    const profiles = await Promise.all(
      providerUsers.map(async (u) => {
        try {
          const profile = await apiClient.get(`/providers/user/${u.id}`);
          return profile.data;
        } catch (e) {
          return {
            id: null,
            userId: u.id,
            userName: u.name,
            userEmail: u.email,
            userPhone: u.phone,
            businessName: u.name + ' (Profile Pending Setup)',
            verificationStatus: 'PENDING',
            available: false,
            city: 'N/A',
            state: 'N/A',
          };
        }
      })
    );

    return profiles;
  },

  verifyProvider: async (providerId, status) => {
    const response = await apiClient.put(`/providers/${providerId}/verify?status=${status}`);
    return response.data;
  },

  // Category Management
  getCategories: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await apiClient.post('/categories', categoryData);
    return response.data;
  },

  updateCategory: async (categoryId, categoryData) => {
    const response = await apiClient.put(`/categories/${categoryId}`, categoryData);
    return response.data;
  },

  deactivateCategory: async (categoryId) => {
    const response = await apiClient.put(`/categories/${categoryId}/deactivate`);
    return response.data;
  },

  deleteCategory: async (categoryId) => {
    const response = await apiClient.delete(`/categories/${categoryId}`);
    return response.data;
  },

  // Service Catalog Management
  getServices: async () => {
    const response = await apiClient.get('/services');
    return response.data;
  },

  getServicesByCategoryId: async (categoryId) => {
    const response = await apiClient.get(`/services/category/${categoryId}`);
    return response.data;
  },

  createService: async (categoryId, serviceData) => {
    const response = await apiClient.post(`/services/category/${categoryId}`, serviceData);
    return response.data;
  },

  updateService: async (serviceId, serviceData) => {
    const response = await apiClient.put(`/services/${serviceId}`, serviceData);
    return response.data;
  },

  deactivateService: async (serviceId) => {
    const response = await apiClient.put(`/services/${serviceId}/deactivate`);
    return response.data;
  },

  deleteService: async (serviceId) => {
    const response = await apiClient.delete(`/services/${serviceId}`);
    return response.data;
  },

  // Booking Management
  getBookingsByStatus: async (status) => {
    const response = await apiClient.get(`/bookings/status/${status}`);
    return response.data;
  },

  getAllBookings: async () => {
    const statuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    const results = await Promise.all(
      statuses.map((status) =>
        apiClient.get(`/bookings/status/${status}`).then((res) => res.data).catch(() => [])
      )
    );
    const combined = results.flat();
    return combined.sort((a, b) => b.id - a.id);
  },

  updateBookingStatus: async (bookingId, status) => {
    const response = await apiClient.put(`/bookings/${bookingId}/status?status=${status}`);
    return response.data;
  },

  assignProviderToBooking: async (bookingId, providerId) => {
    const response = await apiClient.put(`/bookings/${bookingId}/assign-provider?providerId=${providerId}`);
    return response.data;
  },
};

export default adminService;
