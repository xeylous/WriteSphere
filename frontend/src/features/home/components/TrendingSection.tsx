'use client';

import { useQuery } from '@tanstack/react-query';
import { blogService } from '@/services/blogService';
import { Clock, Heart } from 'lucide-react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion } from 'framer-motion';

/**
 * Trending section fetching popular articles dynamically from the database.
 * Staggered presentation with rank numbering.
 */
export function TrendingSection() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['blogs', 'trending'],
    queryFn: () => blogService.getTrending(),
  });

  const trendingPosts = response?.data || [];

  return (
    <section className="py-16 border-t border-border-custom">
      <Container>
        <div className="flex items-center gap-2 mb-8">
          <h2 className="text-xl font-heading font-semibold text-heading">
            Trending on WriteSphere
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton variant="text" width="30px" height="40px" />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" width="60px" />
                  <Skeleton variant="text" lines={2} />
                </div>
              </div>
            ))}
          </div>
        ) : trendingPosts.length === 0 ? (
          <div className="text-sm text-muted">No trending posts found.</div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {trendingPosts.map((post, index) => (
              <Link href={`/blog/${post.slug}`} key={post._id}>
                <article className="group flex items-start gap-4 py-3">
                  <span className="text-3xl font-heading font-bold text-border-custom/60 leading-none mt-0.5 w-8 shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-primary mb-1">
                      {post.category.name}
                    </p>
                    <h3 className="text-sm font-semibold text-heading line-clamp-2 group-hover:text-primary transition-colors duration-200 mb-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Avatar alt={post.author.name} size="xs" src={post.author.avatar} />
                      <span className="text-xs text-muted">{post.author.name}</span>
                      <span className="text-xs text-muted">·</span>
                      <span className="text-xs text-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readingTime} min
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </motion.div>
        )}
      </Container>
    </section>
  );
}
