import apiClient from './api';

export const userService = {
  getUserProfile: async (userId) => {
    if (!userId || userId === 'undefined' || userId === 'null') {
      throw new Error('Valid User ID is required');
    }
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`[userService] Error fetching user ${userId}:`, error);
      throw error;
    }
  },

  updateUserProfile: async (userId, data) => {
    if (!userId || userId === 'undefined' || userId === 'null') {
      throw new Error('Valid User ID is required');
    }
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role || 'CUSTOMER',
        active: data.active !== undefined ? data.active : true,
      };
      const response = await apiClient.put(`/users/${userId}`, payload);
      return response.data;
    } catch (error) {
      console.error(`[userService] Error updating user ${userId}:`, error);
      throw error;
    }
  },

  getAddresses: async (userId) => {
    if (!userId || userId === 'undefined' || userId === 'null') {
      return [];
    }
    try {
      const response = await apiClient.get(`/addresses/user/${userId}`);
      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        return data.map((addr) => ({
          id: addr.id,
          label: addr.landmark || 'Home Address',
          flat: addr.addressLine1,
          street: addr.addressLine2 || addr.city,
          city: addr.city,
          state: addr.state,
          pincode: addr.postalCode,
          latitude: addr.latitude || 19.1136,
          longitude: addr.longitude || 72.8697,
          isDefault: addr.defaultAddress,
          addressLine1: addr.addressLine1,
          postalCode: addr.postalCode,
        }));
      }
      return [];
    } catch (error) {
      console.warn(`[userService] Failed to fetch addresses for user ${userId}:`, error);
      return [];
    }
  },

  addAddress: async (userId, addressData = {}) => {
    const targetUserId = userId || 4;
    try {
      const payload = {
        addressLine1: addressData.addressLine1 || addressData.flat || '101, Service Apartment',
        addressLine2: addressData.addressLine2 || addressData.street || 'MG Road, Andheri West',
        city: addressData.city || 'Mumbai',
        state: addressData.state || 'Maharashtra',
        postalCode: addressData.postalCode || addressData.pincode || '400053',
        country: addressData.country || 'India',
        landmark: addressData.landmark || addressData.label || 'Home',
        latitude: addressData.latitude || 19.1136,
        longitude: addressData.longitude || 72.8697,
        defaultAddress: addressData.defaultAddress !== undefined ? addressData.defaultAddress : true,
      };
      const response = await apiClient.post(`/addresses/user/${targetUserId}`, payload);
      const addr = response.data;
      return {
        id: addr.id,
        label: addr.landmark || 'Home Address',
        flat: addr.addressLine1,
        street: addr.addressLine2 || addr.city,
        city: addr.city,
        state: addr.state,
        pincode: addr.postalCode,
        latitude: addr.latitude || 19.1136,
        longitude: addr.longitude || 72.8697,
        isDefault: addr.defaultAddress,
        addressLine1: addr.addressLine1,
        postalCode: addr.postalCode,
      };
    } catch (error) {
      console.error(`[userService] Failed to add address for user ${userId}:`, error);
      throw error;
    }
  },

  updateAddress: async (id, updatedData = {}) => {
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Valid Address ID is required');
    }
    try {
      const payload = {
        addressLine1: updatedData.flat || updatedData.addressLine1,
        addressLine2: updatedData.street || updatedData.addressLine2,
        city: updatedData.city,
        state: updatedData.state,
        postalCode: updatedData.pincode || updatedData.postalCode,
        country: 'India',
        landmark: updatedData.label || updatedData.landmark,
        defaultAddress: updatedData.isDefault !== undefined ? updatedData.isDefault : false,
      };
      const response = await apiClient.put(`/addresses/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error(`[userService] Failed to update address ${id}:`, error);
      throw error;
    }
  },

  deleteAddress: async (id) => {
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Valid Address ID is required');
    }
    try {
      await apiClient.delete(`/addresses/${id}`);
      return { success: true };
    } catch (error) {
      console.error(`[userService] Failed to delete address ${id}:`, error);
      throw error;
    }
  },

  setDefaultAddress: async (id) => {
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Valid Address ID is required');
    }
    try {
      const response = await apiClient.put(`/addresses/${id}/default`);
      return response.data;
    } catch (error) {
      console.error(`[userService] Failed to set default address ${id}:`, error);
      throw error;
    }
  },
};
