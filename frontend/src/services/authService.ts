import api from '@/lib/api';
import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from '@/types';

export const authService = {
  /**
   * Register a new user account.
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { data } = await api.post('/auth/register', credentials);
    return data.data;
  },

  /**
   * Login with email and password.
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post('/auth/login', credentials);
    return data.data;
  },

  /**
   * Login/Register with Google OAuth credential.
   */
  async googleLogin(credential: string): Promise<AuthResponse> {
    const { data } = await api.post('/auth/google', { credential });
    return data.data;
  },

  /**
   * Log out of the current session.
   */
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  /**
   * Get current authenticated user profile.
   */
  async getMe(): Promise<User> {
    const { data } = await api.get('/auth/me');
    return data.data;
  },
};
