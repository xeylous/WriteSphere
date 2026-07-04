'use client';

import { useQuery } from '@tanstack/react-query';
import { blogService } from '@/services/blogService';
import { categoryTagService } from '@/services/categoryTagService';
import { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { BlogCardMedium } from '@/components/blog/BlogCardMedium';
import { BlogCardSkeleton } from '@/components/ui/Skeleton';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Queries
  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryTagService.getCategories(),
  });

  const { data: blogsResponse, isLoading } = useQuery({
    queryKey: ['blogs', 'list', activeCategory, search],
    queryFn: () =>
      blogService.getAll({
        category: activeCategory || undefined,
        search: search || undefined,
      }),
  });

  const categories = categoriesResponse?.data || [];
  const blogs = blogsResponse?.data || [];

  return (
    <>
      <Navbar />
      <div className="pt-24 pb-20 min-h-[80vh]">
        <Container>
          {/* Header */}
          <div className="mb-10 text-center max-w-xl mx-auto space-y-4">
            <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-heading">
              Explore Stories
            </h1>
            <p className="text-sm text-body">
              Search and discover articles on development, software engineering, UI/UX, startups, and design.
            </p>
          </div>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto mb-10">
            <Input
              type="text"
              placeholder="Search topics, headlines, or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-5 h-5" />}
            />
          </div>

          {/* Categories bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 ${
                activeCategory === null
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface border-border-custom text-body hover:bg-surface-secondary'
              }`}
            >
              All Topics
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat._id)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 ${
                  activeCategory === cat._id
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface border-border-custom text-body hover:bg-surface-secondary'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {/* Blogs Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <BlogCardSkeleton />
              <BlogCardSkeleton />
              <BlogCardSkeleton />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16 text-muted border border-dashed border-border-custom rounded-[var(--radius-lg)]">
              No stories match your query. Try something else!
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {blogs.map((blog) => (
                <BlogCardMedium key={blog._id} blog={blog} />
              ))}
            </motion.div>
          )}
        </Container>
      </div>
      <Footer />
    </>
  );
}
