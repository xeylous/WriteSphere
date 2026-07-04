import { redis } from '../config/redis';
import { CACHE_TTL } from '../utils/constants';

/**
 * Generic Redis caching service.
 * Provides get/set/delete with TTL and pattern invalidation.
 */
class CacheService {
  /**
   * Get cached value by key. Returns null if not found.
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }

  /**
   * Set value in cache with TTL (in seconds).
   */
  async set(key: string, value: unknown, ttl: number = CACHE_TTL.BLOG_DETAIL): Promise<void> {
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Delete a specific cache key.
   */
  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  /**
   * Delete all keys matching a pattern.
   * Uses SCAN to avoid blocking Redis.
   */
  async invalidatePattern(pattern: string): Promise<void> {
    try {
      let cursor = '0';
      do {
        const [nextCursor, keys] = await redis.scan(
          cursor,
          'MATCH',
          pattern,
          'COUNT',
          100,
        );
        cursor = nextCursor;
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      } while (cursor !== '0');
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  }

  /**
   * Increment a counter in Redis (for view counts, etc.)
   */
  async increment(key: string): Promise<number> {
    return redis.incr(key);
  }
}

export const cacheService = new CacheService();
