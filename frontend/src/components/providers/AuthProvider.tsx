'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setUser, clearUser, setAuthLoading, setAuthError } from '@/store/slices/authSlice';
import api from '@/lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Global authentication provider.
 * Automatically fetches the logged-in user profile on load using the stored access token.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        dispatch(clearUser());
        return;
      }

      try {
        dispatch(setAuthLoading(true));
        const { data } = await api.get('/auth/me');
        dispatch(setUser(data.data));
      } catch (err: any) {
        dispatch(setAuthError(err.message || 'Failed to authenticate'));
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }

    loadUser();
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
