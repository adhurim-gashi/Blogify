// Keeps session state and token lifecycle in one provider while the hook lives in auth-context.js for Fast Refresh.
import { useState, useEffect, useCallback } from 'react';
import { api, setTokens, clearTokens, getAccessToken } from './api';
import { AuthContext } from './auth-context';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const storeUser = useCallback((userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const res = await api.get('/users/me');
    const userData = res.data?.user || res.data;
    storeUser(userData);
    return userData;
  }, [storeUser]);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      // Try to load current user
      refreshUser()
        .catch(() => {
          // Token is invalid, clear it
          clearTokens();
          storeUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [refreshUser, storeUser]);

  // Login user
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password }, { needsAuth: false });
      if (res.success && res.data) {
        const { user: userData, access, refresh } = res.data;
        setTokens(access, refresh);
        storeUser(userData);
        return userData;
      }
      throw new Error(res.message || res.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Register user
  const register = async (emailOrPayload, username, password, name) => {
    setIsLoading(true);
    try {
      const payload = typeof emailOrPayload === 'object'
        ? emailOrPayload
        : { email: emailOrPayload, username, password, name };
      const res = await api.post('/auth/register', payload, { needsAuth: false });
      if (res.success && res.data) {
        const { user: userData, access, refresh } = res.data;
        setTokens(access, refresh);
        storeUser(userData);
        return userData;
      }
      throw new Error(res.message || res.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refresh: refreshToken }, { needsAuth: false });
      }
    } finally {
      clearTokens();
      storeUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
