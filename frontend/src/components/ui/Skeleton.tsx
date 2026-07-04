import { cn } from '@/lib/utils';

type SkeletonVariant = 'text' | 'circle' | 'rect' | 'card';

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string;
  height?: string;
  className?: string;
  lines?: number;
}

/**
 * Shimmer skeleton loader with multiple variants.
 * Used for content loading states throughout the app.
 */
export function Skeleton({
  variant = 'text',
  width,
  height,
  className,
  lines = 1,
}: SkeletonProps) {
  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-4 rounded-[var(--radius-sm)] animate-shimmer',
              i === lines - 1 ? 'w-3/4' : 'w-full',
            )}
            style={{ width: i === lines - 1 ? '75%' : width }}
          />
        ))}
      </div>
    );
  }

  const variantStyles = {
    text: 'h-4 rounded-[var(--radius-sm)]',
    circle: 'rounded-full',
    rect: 'rounded-[var(--radius-md)]',
    card: 'rounded-[var(--radius-lg)] h-48',
  };

  return (
    <div
      className={cn(
        'animate-shimmer',
        variantStyles[variant],
        className,
      )}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

/**
 * Pre-composed blog card skeleton for loading states.
 */
export function BlogCardSkeleton() {
  return (
    <div className="bg-surface border border-border-custom rounded-[var(--radius-lg)] overflow-hidden">
      <Skeleton variant="rect" className="w-full h-48" />
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton variant="circle" width="20px" height="20px" />
          <Skeleton variant="text" width="80px" />
        </div>
        <Skeleton variant="text" width="90%" height="20px" />
        <Skeleton variant="text" lines={2} />
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Skeleton variant="circle" width="24px" height="24px" />
            <Skeleton variant="text" width="100px" />
          </div>
          <Skeleton variant="text" width="60px" />
        </div>
      </div>
    </div>
  );
}
