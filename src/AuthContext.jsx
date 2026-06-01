// Keeps session state and token lifecycle in one provider while the hook lives in auth-context.js for Fast Refresh.
import { useState, useEffect, useCallback } from 'react';
import { api, setTokens, clearTokens, getAccessToken, getRefreshToken, refreshAccessToken } from './api';
import { AuthContext } from './auth-context';

// Reads the saved user after refresh and clears it if the saved data is broken
const readStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readStoredUser());
  const [isLoading, setIsLoading] = useState(true);

  // Keeps react state and localstorage updated together
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


  // Tries to keep the user logged in after page refresh.
  const restoreSession = useCallback(async () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (!accessToken && !refreshToken) {
      storeUser(null);
      return null;
    }

    try {
      // A hard refresh can leave only the refresh token available; rotate it
      // before loading /users/me so valid sessions survive page reloads.
      if (!accessToken && refreshToken) {
        await refreshAccessToken();
      }
      return await refreshUser();
    } catch {
      clearTokens();
      storeUser(null);
      return null;
    }
  }, [refreshUser, storeUser]);

  // Restore a persisted session before protected routes decide whether to redirect.
  useEffect(() => {
    let isMounted = true;

    restoreSession().finally(() => {
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [restoreSession]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key && !['accessToken', 'refreshToken', 'user'].includes(event.key)) return;

      if (!getAccessToken() && !getRefreshToken()) {
        setUser(null);
        return;
      }

      const cachedUser = readStoredUser();
      if (cachedUser) setUser(cachedUser);
      restoreSession();
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [restoreSession]);

  // Sends information/credentials to the backend and saves the returned tokens user
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

  // This creates a new account and logs the user in after signup.
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

  // This logs out on the backend and then clears local tokens and user data.
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
