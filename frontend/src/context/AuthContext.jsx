import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { mockUsers } from '../mock/users';
import { mockProviders } from '../mock/providers';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize from localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('trustfix_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return null;
  });

  const [providerProfile, setProviderProfile] = useState(() => {
    const saved = localStorage.getItem('trustfix_provider_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('trustfix_token') || null;
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
      setToken(res.token);

      if (res.user?.role === 'PROVIDER') {
        try {
          const realProfile = await providerService.getProviderByUserId(res.user.id);
          setProviderProfile(realProfile);
        } catch (pErr) {
          console.warn('Could not fetch provider profile for user:', res.user.id, pErr);
          if (res.providerProfile) setProviderProfile(res.providerProfile);
        }
      } else if (res.providerProfile) {
        setProviderProfile(res.providerProfile);
      }

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
      setToken(res.token);

      if (res.user?.role === 'PROVIDER') {
        try {
          const realProfile = await providerService.getProviderByUserId(res.user.id);
          setProviderProfile(realProfile);
        } catch (pErr) {
          if (res.providerProfile) setProviderProfile(res.providerProfile);
        }
      } else if (res.providerProfile) {
        setProviderProfile(res.providerProfile);
      }

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
    setUser(prev => (prev ? { ...prev, ...updatedFields } : updatedFields));
  };

  const updateProvider = (updatedFields) => {
    setProviderProfile(prev => (prev ? { ...prev, ...updatedFields } : updatedFields));
  };

  // Switch demo persona (Instant convenience for review & grading)
  const switchDemoPersona = async (roleType) => {
    if (roleType === 'CUSTOMER') {
      try {
        await login({ email: 'testcustomer@gmail.com', password: 'Test@123' });
      } catch (err) {
        console.error('Demo customer login failed:', err);
      }
    } else if (roleType === 'PROVIDER_VERIFIED' || roleType === 'PROVIDER_PENDING') {
      try {
        await login({ email: 'testprovider@gmail.com', password: 'Test@123' });
      } catch (err) {
        console.error('Demo provider login failed:', err);
      }
    } else if (roleType === 'ADMIN') {
      try {
        await login({ email: 'admin@trustfix.com', password: 'Admin@123' });
      } catch (err) {
        console.error('Demo admin login failed:', err);
      }
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
