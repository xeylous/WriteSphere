import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack Query client with sensible defaults.
 * - 2 minute stale time (reduces unnecessary refetches)
 * - 5 minute garbage collection
 * - 2 retries with exponential backoff
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,      // 2 minutes
      gcTime: 5 * 60 * 1000,          // 5 minutes
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
