import { mockUsers } from '../mock/users';
import { mockAddresses } from '../mock/addresses';

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

let addressesState = [...mockAddresses];

export const userService = {
  getUserProfile: async (userId) => {
    await delay();
    const user = mockUsers.find(u => u.id === userId) || mockUsers[0];
    return { ...user };
  },

  updateUserProfile: async (userId, data) => {
    await delay();
    return { ...data, id: userId };
  },

  getAddresses: async (userId) => {
    await delay();
    return addressesState.filter(a => a.userId === userId || userId === 1);
  },

  addAddress: async (addressData) => {
    await delay();
    const newAddress = {
      ...addressData,
      id: Date.now(),
      latitude: addressData.latitude || 19.1136,
      longitude: addressData.longitude || 72.8697
    };
    if (newAddress.isDefault) {
      addressesState = addressesState.map(a => ({ ...a, isDefault: false }));
    }
    addressesState.unshift(newAddress);
    return newAddress;
  },

  updateAddress: async (id, updatedData) => {
    await delay();
    addressesState = addressesState.map(a => a.id === id ? { ...a, ...updatedData } : a);
    return updatedData;
  },

  deleteAddress: async (id) => {
    await delay();
    addressesState = addressesState.filter(a => a.id !== id);
    return { success: true };
  },

  setDefaultAddress: async (id) => {
    await delay();
    addressesState = addressesState.map(a => ({ ...a, isDefault: a.id === id }));
    return { success: true };
  }
};
