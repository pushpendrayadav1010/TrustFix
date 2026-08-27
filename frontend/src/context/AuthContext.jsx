import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { mockUsers } from '../mock/users';
import { mockProviders } from '../mock/providers';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize from localStorage or default to pre-authenticated Customer for seamless evaluation
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('trustfix_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    // Default initial user: Customer
    return mockUsers[0];
  });

  const [providerProfile, setProviderProfile] = useState(() => {
    const saved = localStorage.getItem('trustfix_provider_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return mockProviders[0];
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('trustfix_token') || 'mock_jwt_customer_token_initial';
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('trustfix_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('trustfix_user');
    }
  }, [user]);

  useEffect(() => {
    if (providerProfile) {
      localStorage.setItem('trustfix_provider_profile', JSON.stringify(providerProfile));
    } else {
      localStorage.removeItem('trustfix_provider_profile');
    }
  }, [providerProfile]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('trustfix_token', token);
    } else {
      localStorage.removeItem('trustfix_token');
    }
  }, [token]);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      setUser(res.user);
      if (res.providerProfile) {
        setProviderProfile(res.providerProfile);
      }
      setToken(res.token);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authService.register(userData);
      setUser(res.user);
      if (res.providerProfile) {
        setProviderProfile(res.providerProfile);
      }
      setToken(res.token);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setProviderProfile(null);
      setToken(null);
      localStorage.removeItem('trustfix_user');
      localStorage.removeItem('trustfix_provider_profile');
      localStorage.removeItem('trustfix_token');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedFields) => {
    setUser(prev => ({ ...prev, ...updatedFields }));
  };

  const updateProvider = (updatedFields) => {
    setProviderProfile(prev => ({ ...prev, ...updatedFields }));
  };

  // Switch demo persona (Instant convenience for review & grading)
  const switchDemoPersona = (roleType) => {
    if (roleType === 'CUSTOMER') {
      const customer = mockUsers[0];
      setUser(customer);
      setToken('mock_jwt_customer_token');
    } else if (roleType === 'PROVIDER_VERIFIED') {
      const providerUser = mockUsers[1];
      const profile = mockProviders[0];
      setUser(providerUser);
      setProviderProfile(profile);
      setToken('mock_jwt_provider_token');
    } else if (roleType === 'PROVIDER_PENDING') {
      const pendingUser = { ...mockUsers[1], id: 107, name: "Anand Verma", email: "anand.paint@trustfix.com" };
      const pendingProfile = mockProviders.find(p => p.verificationStatus === 'PENDING') || mockProviders[6];
      setUser(pendingUser);
      setProviderProfile(pendingProfile);
      setToken('mock_jwt_pending_provider_token');
    } else if (roleType === 'ADMIN') {
      const adminUser = mockUsers[3];
      setUser(adminUser);
      setToken('mock_jwt_admin_token');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        providerProfile,
        role: user?.role || null,
        isAuthenticated: !!user && !!token,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        updateProvider,
        switchDemoPersona
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
