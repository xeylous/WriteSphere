'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion } from 'framer-motion';

/**
 * Featured authors section displaying active creators from the database.
 */
export function FeaturedAuthorsSection() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['authors', 'featured'],
    queryFn: async () => {
      const { data } = await api.get('/users/featured');
      return data;
    },
  });

  const featuredAuthors = response?.data || [];

  return (
    <section className="py-16 border-t border-border-custom">
      <Container>
        <div className="mb-8">
          <h2 className="text-xl font-heading font-semibold text-heading mb-1">
            Featured Writers
          </h2>
          <p className="text-sm text-muted">
            Voices shaping the conversation on WriteSphere
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rect" height="130px" />
            ))}
          </div>
        ) : featuredAuthors.length === 0 ? (
          <div className="text-sm text-muted">No featured authors found.</div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {featuredAuthors.map((author: any) => (
              <Link href={`/author/${author._id}`} key={author._id}>
                <div className="group p-5 bg-surface border border-border-custom rounded-[var(--radius-lg)] transition-all duration-300 hover:border-primary/30 hover:shadow-card-hover h-full flex flex-col justify-between">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar alt={author.name} size="lg" src={author.avatar} />
                    <div>
                      <h3 className="text-sm font-semibold text-heading group-hover:text-primary transition-colors duration-200">
                        {author.name}
                      </h3>
                      <p className="text-xs text-muted">
                        {author.blogCount} articles
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-body leading-relaxed line-clamp-3">
                    {author.bio || 'Co-writing and sharing technical thoughts on WriteSphere.'}
                  </p>
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </Container>
    </section>
  );
}
