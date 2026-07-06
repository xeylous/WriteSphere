'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LayoutDashboard, PenSquare, FileText, BarChart2, Settings, LogOut, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const sidebarLinks = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/write', label: 'Write Story', icon: PenSquare },
    { href: '/dashboard/drafts', label: 'Drafts', icon: FileText },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <ProtectedRoute allowedRoles={['author', 'admin']}>
      <div className="min-h-screen bg-bg flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-surface border-b md:border-b-0 md:border-r border-border-custom flex flex-col shrink-0">
          {/* Logo / Header */}
          <div className="p-6 border-b border-border-custom flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-heading font-heading font-semibold text-base">
                WriteSphere
              </span>
            </Link>
          </div>

          {/* User Profile Info */}
          <div className="p-6 border-b border-border-custom flex items-center gap-3">
            <Avatar src={user?.avatar} alt={user?.name || 'Author'} size="md" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-heading truncate">{user?.name}</p>
              <p className="text-xs text-muted truncate capitalize">{user?.role}</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex-1 p-4 space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-[var(--radius-md)] transition-colors duration-200',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-body hover:bg-surface-secondary hover:text-heading',
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border-custom space-y-2">
            <div className="flex items-center justify-between px-3 py-1.5 rounded-[var(--radius-md)] bg-surface-secondary/50 border border-border-custom/40">
              <span className="text-xs font-semibold text-muted">Appearance</span>
              <ThemeToggle />
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-[var(--radius-md)] transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        </aside>

        {/* Content container */}
        <main className="flex-1 min-w-0 bg-bg p-6 md:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
