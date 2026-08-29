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
      if (token) {
        localStorage.setItem('trustfix_token', token);
      }
      if (user) {
        localStorage.setItem('trustfix_user', JSON.stringify(user));
      }
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
  register: async ({ name, email, phone, password, role, service, serviceArea }) => {
    try {
      const response = await apiClient.post('/auth/register', {
        name,
        email,
        phone,
        password,
        role: role === 'PROVIDER' ? 'PROVIDER' : 'CUSTOMER',
        service: role === 'PROVIDER' ? service : undefined,
        serviceArea: role === 'PROVIDER' ? serviceArea : undefined
      });
      const user = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        role: response.data.role
      };

      // Registration also starts an authenticated session so a newly registered
      // provider can immediately complete their profile instead of landing in a
      // dashboard with no JWT/profile context.
      const loginResponse = await apiClient.post('/auth/login', { email, password });
      const loginData = loginResponse.data;
      const token = loginData.message;
      if (token) localStorage.setItem('trustfix_token', token);
      localStorage.setItem('trustfix_user', JSON.stringify(user));

      return { success: true, user, token, message: 'Registration successful' };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Registration failed';
      throw new Error(errorMsg);
    }
  },

  logout: async () => {
    return { success: true };
  }
};

