import Link from 'next/link';
import { Clock, Heart, MessageCircle } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { cn } from '@/lib/utils';
import type { BlogListItem } from '@/types';

interface BlogCardLargeProps {
  blog: BlogListItem;
  className?: string;
}

/**
 * Large featured blog card with full-width cover image.
 * Used for hero section and featured blog highlights.
 */
export function BlogCardLarge({ blog, className }: BlogCardLargeProps) {
  return (
    <Link href={`/blog/${blog.slug}`}>
      <article
        className={cn(
          'group relative bg-surface border border-border-custom rounded-[var(--radius-lg)] overflow-hidden',
          'transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1',
          className,
        )}
      >
        {/* Cover Image */}
        <div className="relative aspect-[16/9] overflow-hidden">
          {blog.coverImage ? (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-accent-surface flex items-center justify-center">
              <span className="text-4xl">✍️</span>
            </div>
          )}
          {/* Category Badge overlay */}
          <div className="absolute top-4 left-4">
            <Badge variant="primary" size="md">
              {blog.category.icon} {blog.category.name}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl md:text-2xl font-heading font-semibold text-heading mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {blog.title}
          </h2>
          <p className="text-body text-sm leading-relaxed mb-4 line-clamp-2">
            {blog.excerpt}
          </p>

          {/* Author & Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar src={blog.author.avatar} alt={blog.author.name} size="sm" />
              <div>
                <p className="text-sm font-medium text-heading">{blog.author.name}</p>
                <p className="text-xs text-muted">
                  {blog.publishedAt
                    ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Draft'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted text-xs">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {blog.readingTime} min
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                {blog.likesCount}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" />
                {blog.commentsCount}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
