import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Attach JWT access token to outbound requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('waynex_access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry & gracefully handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('waynex_refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          if (res.data?.access) {
            localStorage.setItem('waynex_access_token', res.data.access);
            if (error.config && error.config.headers) {
              error.config.headers.Authorization = `Bearer ${res.data.access}`;
              return apiClient.request(error.config);
            }
          }
        } catch {
          // If refresh fails, clear tokens
          localStorage.removeItem('waynex_access_token');
          localStorage.removeItem('waynex_refresh_token');
          localStorage.removeItem('waynex_user');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
