'use client';

import { useQuery } from '@tanstack/react-query';
import { blogService } from '@/services/blogService';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion } from 'framer-motion';

export function HeroSection() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['blogs', 'featured'],
    queryFn: () => blogService.getFeatured(),
  });

  const featuredBlogs = response?.data || [];
  const featured = featuredBlogs[0]; // Primary featured blog post

  return (
    <section className="relative overflow-hidden py-24 md:py-32 bg-bg border-b border-border-custom/30 flex flex-col items-center justify-center text-center">
      {/* Premium background mesh gradients */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute top-20 left-1/3 w-[300px] h-[300px] rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
      
      {/* SVG Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      <Container className="relative z-10 flex flex-col items-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Badge variant="primary" size="md" icon={<Sparkles className="w-3.5 h-3.5 text-primary" />} className="bg-primary/10 border border-primary/20 text-primary">
            AI-Powered Creator Space
          </Badge>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold text-heading leading-[1.08] tracking-tight max-w-4xl"
        >
          Where intelligence meets <br className="hidden sm:inline" />
          <span className="text-primary bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
            beautiful expression.
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-base sm:text-lg md:text-xl text-body leading-relaxed max-w-2xl mt-6"
        >
          A minimalist editorial publishing platform for writers, developers, and creators. Compose natively with slash commands, optimize layout, and leverage context-aware AI assists.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-8"
        >
          <Link href="/register">
            <Button
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              Start Writing
            </Button>
          </Link>
          <Link href="/explore">
            <Button variant="outline" size="lg" className="bg-surface hover:bg-surface-secondary shadow-sm hover:-translate-y-0.5 transition-all duration-200">
              Explore Stories
            </Button>
          </Link>
        </motion.div>

        {/* Centered Featured Story Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="w-full max-w-3xl mt-16"
        >
          {isLoading ? (
            <Skeleton variant="rect" height="300px" className="w-full rounded-2xl" />
          ) : featured ? (
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div className="bg-surface/50 backdrop-blur-md border border-border-custom rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 group-hover:shadow-card-hover group-hover:-translate-y-1 group-hover:border-primary/20">
                <div className="grid grid-cols-1 md:grid-cols-12">
                  
                  {/* Left: Cover Image */}
                  <div className="md:col-span-5 relative aspect-[16/10] md:aspect-auto min-h-[220px] bg-surface-secondary overflow-hidden">
                    {featured.coverImage ? (
                      <img
                        src={featured.coverImage}
                        alt={featured.title}
                        className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-103"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-grid-pattern opacity-[0.06]" />
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                        Featured
                      </span>
                    </div>
                  </div>

                  {/* Right: Info */}
                  <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between text-left space-y-4">
                    <div className="space-y-2">
                      <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-heading group-hover:text-primary transition-colors leading-snug">
                        {featured.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-body line-clamp-2 leading-relaxed">
                        {featured.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border-custom/40">
                      <div className="flex items-center gap-3">
                        <Avatar src={featured.author.avatar} alt={featured.author.name} size="sm" />
                        <div>
                          <p className="text-xs font-semibold text-heading">{featured.author.name}</p>
                          <p className="text-[10px] text-muted">
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

                      <span className="text-primary text-xs font-bold inline-flex items-center gap-1 group-hover:underline">
                        Read Story
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </Link>
          ) : null}
        </motion.div>
      </Container>
    </section>
  );
}
