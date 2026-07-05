'use client';

import { useQuery } from '@tanstack/react-query';
import { categoryTagService } from '@/services/categoryTagService';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';
import { ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Categories List Page.
 * Displays all available topics with descriptive summaries and live article counts.
 */
export default function CategoriesPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryTagService.getCategories(),
  });

  const categories = response?.data || [];

  return (
    <>
      <Navbar />
      <div className="pt-28 pb-20 min-h-[85vh] relative overflow-hidden">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

        <Container>
          {/* Header Section */}
          <div className="max-w-2xl mx-auto text-center mb-16 space-y-4 relative z-10">
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-heading tracking-tight">
              Browse by Topic
            </h1>
            <p className="text-base text-body max-w-lg mx-auto">
              Find deep dives, expert insights, and clean tutorials categorized across our core engineering and product design topics.
            </p>
          </div>

          {/* Categories Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="rect" height="180px" className="w-full rounded-[var(--radius-lg)]" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16 text-muted border border-dashed border-border-custom rounded-[var(--radius-lg)]">
              No categories have been registered yet.
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {categories.map((category) => (
                <Link href={`/explore?category=${category._id}`} key={category._id} className="group">
                  <Card
                    hover
                    padding="lg"
                    className="h-full flex flex-col justify-between border-border-custom group-hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      {/* Icon & Count indicator */}
                      <div className="flex items-center justify-between">
                        <span className="text-3xl p-2 bg-surface-secondary rounded-[var(--radius-md)] border border-border-custom/50">
                          {category.icon || '📝'}
                        </span>
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          {category.blogCount} {category.blogCount === 1 ? 'Article' : 'Articles'}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h2 className="text-lg font-heading font-bold text-heading group-hover:text-primary transition-colors duration-200 mb-2">
                          {category.name}
                        </h2>
                        <p className="text-sm text-body leading-relaxed line-clamp-3">
                          {category.description || 'Discover stories and tutorials in this category.'}
                        </p>
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="flex items-center gap-1 text-sm font-semibold text-primary pt-6 mt-4 border-t border-border-custom/50 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                      Explore Topic
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </Card>
                </Link>
              ))}
            </motion.div>
          )}
        </Container>
      </div>
      <Footer />
    </>
  );
}
