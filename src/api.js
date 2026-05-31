// API utility module for consistent API calls with auth token handling.
// VITE_API_URL may point to either the API origin (http://localhost:4000)
// or the full API base (http://localhost:4000/api), which keeps local and
// production deployments from hardcoding a backend port into the bundle.
const configuredApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
const normalizedApiUrl = configuredApiUrl.replace(/\/$/, '');
export const API_BASE_URL = normalizedApiUrl.endsWith('/api') ? normalizedApiUrl : `${normalizedApiUrl}/api`;
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '');

const normalizeEndpoint = (endpoint) => endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
const normalizeResponse = (payload) => {
  if (payload && typeof payload === 'object' && Object.prototype.hasOwnProperty.call(payload, 'success')) {
    return {
      ...payload,
      data: Object.prototype.hasOwnProperty.call(payload, 'data') ? payload.data : null,
      message: payload.message || payload.error || (payload.success ? 'OK' : 'Request failed'),
    };
  }
  return { success: true, data: payload ?? null, message: 'OK' };
};

// Token management
export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');
export const setTokens = (access, refresh) => {
  if (access) localStorage.setItem('accessToken', access);
  if (refresh) localStorage.setItem('refreshToken', refresh);
};
export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// Refresh access token using refresh token
export const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token');

    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken })
    });

    if (!res.ok) {
      clearTokens();
      throw new Error('Token refresh failed');
    }

    const data = normalizeResponse(await res.json());
    if (data.success && data.data && data.data.access) {
      setTokens(data.data.access, data.data.refresh);
      return data.data.access;
    }
    throw new Error('Invalid refresh response');
  } catch (err) {
    clearTokens();
    throw err;
  }
};

// Main API fetch wrapper with auth and comprehensive error handling
export const apiCall = async (endpoint, options = {}) => {
  const { method = 'GET', body, needsAuth = true, headers: optionHeaders = {}, ...fetchOptions } = options;
  const url = `${API_BASE_URL}${normalizeEndpoint(endpoint)}`;

  const headers = {
    'Content-Type': 'application/json',
    ...optionHeaders
  };

  // Add auth token if needed
  if (needsAuth) {
    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config = {
    method,
    headers,
    ...fetchOptions
  };

  if (body && method !== 'GET') {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(url, config);
  } catch (networkErr) {
    // Network errors are usually backend-down, wrong VITE_API_URL, or CORS.
    const message = `Unable to reach the Blogify API at ${API_BASE_URL}. Check that the backend is running and that VITE_API_URL matches its port.`;
    void networkErr;
    throw new Error(message);
  }

  // If 401, try to refresh token and retry once
  if (res.status === 401 && needsAuth) {
    try {
      const newToken = await refreshAccessToken();
      headers['Authorization'] = `Bearer ${newToken}`;
      config.headers = headers;
      res = await fetch(url, config);
    } catch {
      throw new Error('Authentication failed. Please login again.');
    }
  }

  // Try to parse JSON, handle non-JSON responses
  let data;
  try {
    data = normalizeResponse(await res.json());
  } catch {
    // Response wasn't JSON
    if (!res.ok) {
      throw new Error(`API Error ${res.status}: ${res.statusText}`);
    }
    // If OK but not JSON, return empty success
    data = { success: true, data: {}, message: 'OK' };
  }

  // Check HTTP status
  if (!res.ok) {
    const errorMsg = data.message || data.error || `API Error: ${res.status}`;
    throw new Error(errorMsg);
  }

  return data;
};

// Convenience methods for common HTTP verbs
export const api = {
  get: (endpoint, options = {}) => apiCall(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options = {}) => apiCall(endpoint, { method: 'POST', body, ...options }),
  put: (endpoint, body, options = {}) => apiCall(endpoint, { method: 'PUT', body, ...options }),
  patch: (endpoint, body, options = {}) => apiCall(endpoint, { method: 'PATCH', body, ...options }),
  delete: (endpoint, options = {}) => apiCall(endpoint, { method: 'DELETE', ...options }),

  // Special: multipart form data (for file uploads)
  postForm: async (endpoint, formData, needsAuth = true) => {
    const headers = {};
    const url = `${API_BASE_URL}${normalizeEndpoint(endpoint)}`;
    if (needsAuth) {
      const token = getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers,
        body: formData
      });
    } catch (networkErr) {
      const message = `Unable to upload because the Blogify API at ${API_BASE_URL} is unreachable. Check the backend server and VITE_API_URL.`;
      void networkErr;
      throw new Error(message);
    }

    if (res.status === 401 && needsAuth) {
      try {
        const newToken = await refreshAccessToken();
        headers['Authorization'] = `Bearer ${newToken}`;
        res = await fetch(url, {
          method: 'POST',
          headers,
          body: formData
        });
      } catch {
        throw new Error('Authentication failed. Please login again.');
      }
    }

    let data;
    try {
      data = normalizeResponse(await res.json());
    } catch {
      if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}: ${res.statusText}`);
      }
      data = { success: true, data: {}, message: 'OK' };
    }

    if (!res.ok) {
      throw new Error(data.message || data.error || `Upload failed: ${res.status}`);
    }

    return data;
  }
};

// Helper to check if user is authenticated
export const isAuthenticated = () => !!getAccessToken();

// Export as default for convenience
export default api;
