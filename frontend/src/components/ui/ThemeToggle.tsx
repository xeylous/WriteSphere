'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

/**
 * Theme toggle button with smooth sun/moon icon transition.
 * Uses next-themes for actual theme switching.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        className={cn(
          'w-9 h-9 flex items-center justify-center rounded-[var(--radius-md)]',
          'bg-surface-secondary border border-border-custom',
          className,
        )}
        aria-label="Toggle theme"
      >
        <div className="w-4 h-4" />
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'w-9 h-9 flex items-center justify-center rounded-[var(--radius-md)]',
        'bg-surface-secondary border border-border-custom',
        'transition-all duration-200 hover:bg-accent-surface',
        'focus-visible:outline-2 focus-visible:outline-primary',
        className,
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      <div className="relative w-4 h-4">
        <Sun
          className={cn(
            'absolute inset-0 w-4 h-4 transition-all duration-300',
            isDark
              ? 'rotate-90 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100',
          )}
        />
        <Moon
          className={cn(
            'absolute inset-0 w-4 h-4 transition-all duration-300',
            isDark
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0',
          )}
        />
      </div>
    </button>
  );
}
