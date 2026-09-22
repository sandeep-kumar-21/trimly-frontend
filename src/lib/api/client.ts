import axios from 'axios';

export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    // If NEXT_PUBLIC_API_URL is unset or uses localhost while accessed via LAN IP/hostname
    if (!envUrl || envUrl.includes('localhost') || envUrl.includes('127.0.0.1')) {
      const protocol = window.location.protocol;
      const hostname = window.location.hostname;
      return `${protocol}//${hostname}:4000/api`;
    }
    return envUrl;
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
};

export const apiClient = axios.create({
  baseURL: typeof window !== 'undefined' ? getApiBaseUrl() : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to set/get token in cookie or memory if returned by login/register
let inMemoryToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  inMemoryToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      document.cookie = `trimly_token=${token}; path=/; max-age=604800; SameSite=Lax`;
    } else {
      document.cookie = 'trimly_token=; path=/; max-age=0';
    }
  }
};

export const getAuthToken = (): string | null => {
  if (inMemoryToken) return inMemoryToken;
  if (typeof window !== 'undefined') {
    const match = document.cookie.match(/(?:^|; )trimly_token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  }
  return null;
};

// Request Interceptor: Attach bearer token if available and sync dynamic baseURL
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      config.baseURL = getApiBaseUrl();
    }
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Redirect on 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setAuthToken(null);
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);
