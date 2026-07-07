'use client';

import { useQuery } from '@tanstack/react-query';
import { blogService } from '@/services/blogService';
import { ArrowRight, Sparkles, BookOpen, Clock, Heart } from 'lucide-react';
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
    <section className="relative overflow-hidden py-20 lg:py-28 bg-bg border-b border-border-custom/30">
      {/* Decorative premium background blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
      
      {/* Custom grid lines to evoke a high-end editorial desk */}
      <div className="absolute inset-y-0 left-12 w-px bg-border-custom/20 pointer-events-none hidden xl:block" />
      <div className="absolute inset-y-0 right-12 w-px bg-border-custom/20 pointer-events-none hidden xl:block" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Text Content Area */}
          <div className="lg:col-span-6 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <Badge variant="primary" size="md" icon={<Sparkles className="w-3 h-3 text-primary" />} className="bg-primary/10 border border-primary/20">
                AI-Powered Creator Platform
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-heading leading-[1.08] tracking-tight">
                Where intelligence
                <br />
                meets <span className="text-primary bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">expression.</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-body leading-relaxed max-w-lg"
            >
              A clean, distraction-free environment for writers and creators. Compose beautifully with slash commands, optimize content on-the-fly, and leverage Llama-3.3 AI suggestions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link href="/register">
                <Button
                  size="lg"
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                  className="shadow-md hover:shadow-lg transition-all"
                >
                  Start Writing
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="outline" size="lg" className="bg-surface hover:bg-surface-secondary">
                  Explore Stories
                </Button>
              </Link>
            </motion.div>

            {/* Micro stats banner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-border-custom/50 max-w-md"
            >
              <div>
                <p className="text-2xl font-heading font-extrabold text-heading">15k+</p>
                <p className="text-xs text-muted">Active Authors</p>
              </div>
              <div>
                <p className="text-2xl font-heading font-extrabold text-heading">98%</p>
                <p className="text-xs text-muted">Satisfaction</p>
              </div>
              <div>
                <p className="text-2xl font-heading font-extrabold text-heading">Groq</p>
                <p className="text-xs text-muted">Powered AI</p>
              </div>
            </motion.div>
          </div>

          {/* Right: Premium Overlapping Feature Cards */}
          <div className="lg:col-span-6 relative">
            {isLoading ? (
              <Skeleton variant="rect" height="420px" className="w-full rounded-2xl" />
            ) : featured ? (
              <div className="relative w-full h-[450px] flex items-center justify-center">
                {/* Secondary Decorative Card Background */}
                <div className="absolute w-[92%] h-[90%] -bottom-4 bg-surface-secondary/40 border border-border-custom/40 rounded-2xl rotate-[-2deg] scale-[0.98] pointer-events-none" />

                {/* Primary Card */}
                <motion.div
                  className="absolute w-full bg-surface border border-border-custom rounded-2xl overflow-hidden shadow-2xl relative z-10"
                  initial={{ opacity: 0, scale: 0.96, rotate: 0 }}
                  animate={{ opacity: 1, scale: 1, rotate: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  whileHover={{ rotate: 0, scale: 1.01, translateY: -4 }}
                >
                  <Link href={`/blog/${featured.slug}`} className="block group">
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-secondary">
                      {featured.coverImage ? (
                        <img
                          src={featured.coverImage}
                          alt={featured.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-grid-pattern opacity-[0.06]" />
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-sm">
                          Featured Story
                        </span>
                      </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-4">
                      <h2 className="text-xl md:text-2xl font-heading font-extrabold text-heading leading-snug group-hover:text-primary transition-colors">
                        {featured.title}
                      </h2>
                      <p className="text-sm text-body line-clamp-2 leading-relaxed">
                        {featured.excerpt}
                      </p>

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
                          Read Now
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>
            ) : (
              <div className="w-full h-[400px] border border-border-custom border-dashed rounded-2xl flex items-center justify-center text-muted">
                No featured articles present.
              </div>
            )}
          </div>

        </div>
      </Container>
    </section>
  );
}
