import Link from 'next/link';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BlogListItem } from '@/types';

interface BlogCardSmallProps {
  blog: BlogListItem;
  index?: number;
  className?: string;
}

/**
 * Compact blog card for sidebar/trending lists.
 * Horizontal layout with optional rank number.
 */
export function BlogCardSmall({ blog, index, className }: BlogCardSmallProps) {
  return (
    <Link href={`/blog/${blog.slug}`}>
      <article
        className={cn(
          'group flex items-start gap-4 p-3 rounded-[var(--radius-md)]',
          'transition-colors duration-200 hover:bg-surface-secondary',
          className,
        )}
      >
        {/* Rank Number */}
        {index !== undefined && (
          <span className="text-3xl font-heading font-bold text-border-custom shrink-0 w-8 text-center leading-none mt-1">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}

        {/* Thumbnail */}
        {blog.coverImage && !index && (
          <div className="w-20 h-20 rounded-[var(--radius-md)] overflow-hidden shrink-0">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-heading line-clamp-2 group-hover:text-primary transition-colors duration-200 mb-1">
            {blog.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span>{blog.author.name}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {blog.readingTime} min
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
