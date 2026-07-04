'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Theme provider using next-themes for flicker-free dark/light mode.
 * Reads from localStorage (guests) or user preferences (authenticated).
 * Applies theme class to <html> element.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
      storageKey="writesphere-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
