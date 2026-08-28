import apiClient from './api';

export const authService = {
  // Real API login using Spring Boot /api/auth/login
  login: async ({ email, password }) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const data = response.data;
      // Response format: { message: "<JWT TOKEN>", userId: 4, name: "...", email: "...", role: "CUSTOMER" }
      const token = data.message;
      const user = {
        id: data.userId,
        name: data.name,
        email: data.email,
        role: data.role
      };
      return {
        success: true,
        user,
        token,
        message: 'Login successful'
      };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Invalid email or password';
      throw new Error(errorMsg);
    }
  },

  // Real API register using Spring Boot /api/auth/register
  register: async ({ name, email, phone, password, role }) => {
    try {
      const response = await apiClient.post('/auth/register', {
        name,
        email,
        phone,
        password,
        role: role === 'PROVIDER' ? 'PROVIDER' : 'CUSTOMER'
      });
      const data = response.data;
      const user = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role
      };
      return {
        success: true,
        user,
        message: 'Registration successful'
      };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Registration failed';
      throw new Error(errorMsg);
    }
  },

  logout: async () => {
    return { success: true };
  }
};

