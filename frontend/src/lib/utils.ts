import { clsx, type ClassValue } from 'clsx';

/**
 * Utility to merge class names conditionally.
 * Combines clsx for conditional classes.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
