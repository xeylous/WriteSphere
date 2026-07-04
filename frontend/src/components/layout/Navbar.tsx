'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, PenSquare } from 'lucide-react';
import { Container } from './Container';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/categories', label: 'Categories' },
];

/**
 * Sticky navbar with scroll shadow, mobile menu, and auth-aware actions.
 * Shrinks slightly on scroll for a premium feel.
 */
export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 10);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40',
        'transition-all duration-300 ease-out',
        isScrolled
          ? 'bg-surface/80 backdrop-blur-lg border-b border-border-custom shadow-sm'
          : 'bg-transparent',
      )}
    >
      <Container>
        <nav className={cn(
          'flex items-center justify-between',
          'transition-all duration-300',
          isScrolled ? 'h-14' : 'h-16',
        )}>
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="WriteSphere home"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <span className="text-white font-bold text-sm font-heading">W</span>
            </div>
            <span className="text-heading font-heading font-semibold text-lg hidden sm:block">
              WriteSphere
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-[var(--radius-md)]',
                  'transition-colors duration-200',
                  pathname === link.href
                    ? 'text-primary bg-primary/10'
                    : 'text-muted hover:text-heading hover:bg-surface-secondary',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <Link href="/search">
              <button
                className={cn(
                  'w-9 h-9 flex items-center justify-center rounded-[var(--radius-md)]',
                  'text-muted hover:text-heading hover:bg-surface-secondary',
                  'transition-colors duration-200',
                )}
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </Link>

            <ThemeToggle />

            {isAuthenticated && user ? (
              <>
                {/* Write button */}
                <Link href="/dashboard/write">
                  <Button
                    size="sm"
                    variant="primary"
                    icon={<PenSquare className="w-3.5 h-3.5" />}
                    className="hidden sm:inline-flex"
                  >
                    Write
                  </Button>
                </Link>

                {/* User avatar */}
                <Link href="/dashboard" className="ml-1">
                  <Avatar
                    src={user.avatar}
                    alt={user.name}
                    size="sm"
                  />
                </Link>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'md:hidden w-9 h-9 flex items-center justify-center rounded-[var(--radius-md)]',
                'text-muted hover:text-heading hover:bg-surface-secondary',
                'transition-colors duration-200',
              )}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>
      </Container>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-out',
          'bg-surface/95 backdrop-blur-lg border-b border-border-custom',
          isMobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <Container>
          <div className="py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block px-3 py-2 text-sm font-medium rounded-[var(--radius-md)]',
                  'transition-colors duration-200',
                  pathname === link.href
                    ? 'text-primary bg-primary/10'
                    : 'text-muted hover:text-heading hover:bg-surface-secondary',
                )}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="flex gap-2 pt-3 border-t border-border-custom mt-3">
                <Link href="/login" className="flex-1">
                  <Button variant="outline" size="sm" fullWidth>
                    Sign in
                  </Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button variant="primary" size="sm" fullWidth>
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Container>
      </div>
    </header>
  );
}
