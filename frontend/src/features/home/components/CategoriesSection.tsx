'use client';

import { useQuery } from '@tanstack/react-query';
import { categoryTagService } from '@/services/categoryTagService';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

/**
 * Explore Topics section fetching Categories dynamically from DB.
 */
export function CategoriesSection() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryTagService.getCategories(),
  });

  const categories = response?.data || [];

  return (
    <section className="py-16 border-t border-border-custom">
      <Container>
        <div className="mb-8">
          <h2 className="text-xl font-heading font-semibold text-heading mb-1">
            Explore Topics
          </h2>
          <p className="text-sm text-muted">
            Discover stories across categories that interest you
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rect" height="120px" />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {categories.map((category, index) => (
              <Link href={`/categories/${category.slug}`} key={category._id}>
                <div
                  className={cn(
                    'group relative p-5 bg-surface border border-border-custom rounded-[var(--radius-lg)]',
                    'transition-all duration-300 hover:border-primary/30 hover:shadow-card-hover',
                    index < 2 && 'md:row-span-2 md:p-6',
                  )}
                >
                  <span className="text-2xl mb-3 block">{category.icon}</span>
                  <h3 className="text-sm font-heading font-semibold text-heading mb-1 group-hover:text-primary transition-colors duration-200">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted mb-2 line-clamp-2">
                    {category.description}
                  </p>
                  <span className="text-xs text-primary font-medium">
                    {category.blogCount} articles
                  </span>
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </Container>
    </section>
  );
}
