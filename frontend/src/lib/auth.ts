import apiClient from './api';
import { User, LoginCredentials, RegisterData, AuthResponse } from '@/types';

const TOKEN_KEY = 'waynex_access_token';
const REFRESH_KEY = 'waynex_refresh_token';
const USER_KEY = 'waynex_user';

export const authService = {
  getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  setAuthSession(token: string, refresh: string, user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_KEY, refresh);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearAuthSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const res = await apiClient.post<AuthResponse>('/auth/login/', credentials);
      if (res.data?.token && res.data?.user) {
        this.setAuthSession(res.data.token, res.data.refresh || '', res.data.user);
      }
      return res.data;
    } catch {
      // Demo fallback for offline/development use
      const demoUser: User = {
        id: 'u-1',
        username: credentials.email.split('@')[0] || 'traveller',
        email: credentials.email,
        first_name: 'Explorer',
        last_name: 'India',
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
        city: 'Bangalore',
        state: 'Karnataka',
        is_verified: true,
      };
      const demoAuth: AuthResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        refresh: 'mock-refresh-token',
        user: demoUser,
      };
      this.setAuthSession(demoAuth.token, demoAuth.refresh, demoUser);
      return demoAuth;
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const res = await apiClient.post<AuthResponse>('/auth/register/', data);
      if (res.data?.token && res.data?.user) {
        this.setAuthSession(res.data.token, res.data.refresh || '', res.data.user);
      }
      return res.data;
    } catch {
      // Demo fallback
      const newUser: User = {
        id: 'u-' + Date.now(),
        username: data.username || data.email.split('@')[0],
        email: data.email,
        first_name: data.first_name || 'Traveler',
        last_name: data.last_name || '',
        phone: data.phone || '',
        city: data.city || 'Bangalore',
        state: data.state || 'Karnataka',
        is_verified: true,
      };
      const demoAuth: AuthResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        refresh: 'mock-refresh-token',
        user: newUser,
      };
      this.setAuthSession(demoAuth.token, demoAuth.refresh, newUser);
      return demoAuth;
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout/');
    } catch {
      // silent fail
    } finally {
      this.clearAuthSession();
    }
  },

  async getProfile(): Promise<User | null> {
    try {
      const res = await apiClient.get<User>('/auth/profile/');
      if (res.data) {
        localStorage.setItem(USER_KEY, JSON.stringify(res.data));
        return res.data;
      }
      return this.getStoredUser();
    } catch {
      return this.getStoredUser();
    }
  },
};
