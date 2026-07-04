import { cn } from '@/lib/utils';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
};

/**
 * User avatar with image or fallback initials.
 * Generates a consistent background color from the name.
 */
export function Avatar({ src, alt, size = 'md', className }: AvatarProps) {
  const initials = alt
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Generate consistent color from name
  const colorIndex =
    alt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 6;
  const bgColors = [
    'bg-emerald-500/20 text-emerald-600',
    'bg-blue-500/20 text-blue-600',
    'bg-amber-500/20 text-amber-600',
    'bg-rose-500/20 text-rose-600',
    'bg-violet-500/20 text-violet-600',
    'bg-cyan-500/20 text-cyan-600',
  ];

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          'rounded-full object-cover shrink-0',
          sizeStyles[size],
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-medium shrink-0',
        sizeStyles[size],
        bgColors[colorIndex],
        className,
      )}
      aria-label={alt}
      role="img"
    >
      {initials}
    </div>
  );
}
