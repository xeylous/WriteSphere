import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: 'div' | 'article' | 'section';
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

/**
 * Flexible card component with header/body/footer slots.
 * Optional hover lift animation for interactive cards.
 */
export function Card({
  children,
  className,
  hover = false,
  padding = 'md',
  as: Component = 'div',
}: CardProps) {
  return (
    <Component
      className={cn(
        'bg-surface border border-border-custom rounded-[var(--radius-lg)]',
        'shadow-card',
        hover && [
          'transition-all duration-300 ease-out',
          'hover:shadow-card-hover hover:-translate-y-0.5',
          'cursor-pointer',
        ],
        paddingStyles[padding],
        className,
      )}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

export function CardBody({ children, className }: CardBodyProps) {
  return (
    <div className={cn(className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-border-custom', className)}>
      {children}
    </div>
  );
}
