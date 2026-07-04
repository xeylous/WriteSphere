'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { setUser, clearUser, setAuthLoading, setAuthError } from '@/store/slices/authSlice';
import { authService } from '@/services/authService';
import type { LoginCredentials, RegisterCredentials } from '@/types';
import { useRouter } from 'next/navigation';

/**
 * Custom React hook for authentication actions.
 * Encapsulates login, registration, and logout operations.
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch(setAuthLoading(true));
      const data = await authService.login(credentials);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      dispatch(setUser(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      dispatch(setAuthError(err.message || 'Login failed'));
      throw err;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      dispatch(setAuthLoading(true));
      const data = await authService.register(credentials);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      dispatch(setUser(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      dispatch(setAuthError(err.message || 'Registration failed'));
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore API logout errors and clear state anyway
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch(clearUser());
      router.push('/');
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
  };
}
