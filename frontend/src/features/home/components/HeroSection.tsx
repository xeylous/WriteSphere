'use client';

import { useQuery } from '@tanstack/react-query';
import { blogService } from '@/services/blogService';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion } from 'framer-motion';

/**
 * Editorial Hero Section.
 * Pulls the featured article dynamically from the backend list.
 */
export function HeroSection() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['blogs', 'featured'],
    queryFn: () => blogService.getFeatured(),
  });

  const featuredBlogs = response?.data || [];
  const featured = featuredBlogs[0]; // Take the latest featured blog post

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.04] pointer-events-none" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left — Intro branding */}
          <motion.div
            className="lg:col-span-5 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="primary" size="md" icon={<Sparkles className="w-3 h-3" />}>
              AI-Powered Platform
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-heading leading-[1.1] tracking-tight">
              Where ideas
              <br />
              <span className="text-primary">take shape.</span>
            </h1>

            <p className="text-lg text-body max-w-md leading-relaxed">
              A premium blogging platform for creators who care about craft.
              Write beautifully, read intelligently, powered by AI that stays
              out of your way.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link href="/register">
                <Button
                  size="lg"
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Start Writing
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="outline" size="lg">
                  Explore
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right — Dynamically loaded featured card */}
          <div className="lg:col-span-7">
            {isLoading ? (
              <Skeleton variant="rect" height="350px" className="w-full rounded-[var(--radius-lg)]" />
            ) : featured ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Link href={`/blog/${featured.slug}`} className="group block">
                  <div className="relative bg-surface border border-border-custom rounded-[var(--radius-lg)] overflow-hidden shadow-card transition-all duration-300 group-hover:shadow-card-hover group-hover:-translate-y-1">
                    {/* Cover image area */}
                    <div className="aspect-[16/9] bg-gradient-to-br from-accent-surface to-surface-secondary relative overflow-hidden">
                      {featured.coverImage ? (
                        <img
                          src={featured.coverImage}
                          alt={featured.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-grid-pattern opacity-[0.06]" />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                        <Badge variant="primary" size="md" className="mb-3 text-white">
                          🔥 Featured
                        </Badge>
                        <h2 className="text-xl md:text-3xl font-heading font-bold leading-tight mb-2 text-white">
                          {featured.title}
                        </h2>
                        <p className="text-gray-300 text-sm max-w-lg line-clamp-2">
                          {featured.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Author block */}
                    <div className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar alt={featured.author.name} size="sm" src={featured.author.avatar} />
                        <div>
                          <p className="text-sm font-medium text-heading">{featured.author.name}</p>
                          <p className="text-xs text-muted">
                            {featured.publishedAt
                              ? new Date(featured.publishedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : 'Just now'}{' '}
                            · {featured.readingTime} min read
                          </p>
                        </div>
                      </div>
                      <span className="text-primary text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Read article
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ) : (
              <div className="aspect-[16/9] bg-surface-secondary border border-border-custom rounded-[var(--radius-lg)] flex items-center justify-center text-muted">
                No featured posts found.
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
