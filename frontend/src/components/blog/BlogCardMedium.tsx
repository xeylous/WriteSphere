import Link from 'next/link';
import { Clock, Heart } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { cn } from '@/lib/utils';
import type { BlogListItem } from '@/types';

interface BlogCardMediumProps {
  blog: BlogListItem;
  className?: string;
}

/**
 * Medium blog card for grid layouts.
 * Consistent aspect ratio cover image with content below.
 */
export function BlogCardMedium({ blog, className }: BlogCardMediumProps) {
  return (
    <Link href={`/blog/${blog.slug}`}>
      <article
        className={cn(
          'group bg-surface border border-border-custom rounded-[var(--radius-lg)] overflow-hidden',
          'transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5',
          className,
        )}
      >
        {/* Cover Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {blog.coverImage ? (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-accent-surface flex items-center justify-center">
              <span className="text-3xl">✍️</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="default" size="sm">
              {blog.category.icon} {blog.category.name}
            </Badge>
            <span className="text-xs text-muted flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {blog.readingTime} min
            </span>
          </div>

          <h3 className="text-base font-heading font-semibold text-heading mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {blog.title}
          </h3>
          <p className="text-sm text-body line-clamp-2 mb-4">
            {blog.excerpt}
          </p>

          {/* Author & Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-border-custom">
            <div className="flex items-center gap-2">
              <Avatar src={blog.author.avatar} alt={blog.author.name} size="xs" />
              <span className="text-xs text-muted font-medium">{blog.author.name}</span>
            </div>
            <span className="flex items-center gap-1 text-xs text-muted">
              <Heart className="w-3 h-3" />
              {blog.likesCount}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
