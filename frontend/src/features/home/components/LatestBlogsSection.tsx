'use client';

import { useQuery } from '@tanstack/react-query';
import { blogService } from '@/services/blogService';
import { BlogCardLarge } from '@/components/blog/BlogCardLarge';
import { BlogCardMedium } from '@/components/blog/BlogCardMedium';
import { BlogCardSmall } from '@/components/blog/BlogCardSmall';
import { BlogCardSkeleton } from '@/components/ui/Skeleton';
import { Container } from '@/components/layout/Container';
import { motion } from 'framer-motion';

/**
 * Editorial list section fetching published articles dynamically from backend.
 * Gracefully displays skeletons on loading states.
 */
export function LatestBlogsSection() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['blogs', 'list'],
    queryFn: () => blogService.getAll({ limit: 6 }),
  });

  const blogs = response?.data || [];

  return (
    <section className="py-16 border-t border-border-custom">
      <Container>
        <div className="mb-8">
          <h2 className="text-xl font-heading font-semibold text-heading mb-1">
            Latest Stories
          </h2>
          <p className="text-sm text-muted">
            Fresh perspectives from our community of writers
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <BlogCardSkeleton />
            <BlogCardSkeleton />
            <BlogCardSkeleton />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12 text-muted border border-dashed border-border-custom rounded-[var(--radius-lg)]">
            No stories published yet.
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {blogs.map((blog) => (
              <BlogCardMedium key={blog._id} blog={blog} />
            ))}
          </motion.div>
        )}
      </Container>
    </section>
  );
}
