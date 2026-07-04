'use client';

import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { useAppSelector } from '@/store';
import { Skeleton } from '../ui/Skeleton';
import { Container } from '../layout/Container';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('user' | 'author' | 'admin')[];
}

/**
 * Route guard component.
 * Blocks rendering for unauthenticated users and redirects to login.
 * Optionally validates user role restrictions.
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <Container className="py-20 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Skeleton variant="circle" width="60px" height="60px" />
        <Skeleton variant="text" width="200px" height="24px" />
        <Skeleton variant="text" lines={2} width="300px" />
      </Container>
    );
  }

  if (!isAuthenticated || (allowedRoles && user && !allowedRoles.includes(user.role))) {
    return null; // Redirect is handled by useEffect
  }

  return <>{children}</>;
}
