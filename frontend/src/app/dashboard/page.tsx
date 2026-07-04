'use client';

import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analyticsService';
import { blogService } from '@/services/blogService';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Eye, Heart, MessageCircle, FileText, ArrowUpRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function DashboardOverview() {
  const { data: statsResponse, isLoading: statsLoading } = useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: () => analyticsService.getOverview(),
  });

  const { data: topBlogsResponse, isLoading: topLoading } = useQuery({
    queryKey: ['analytics', 'top-blogs'],
    queryFn: () => analyticsService.getTopBlogs(),
  });

  const stats = statsResponse?.data;
  const topBlogs = topBlogsResponse?.data || [];

  const statItems = [
    { label: 'Total Views', value: stats?.totalViews || 0, icon: Eye, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Total Likes', value: stats?.totalLikes || 0, icon: Heart, color: 'text-rose-500 bg-rose-500/10' },
    { label: 'Responses', value: stats?.totalComments || 0, icon: MessageCircle, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Published Blogs', value: stats?.totalBlogs || 0, icon: FileText, color: 'text-amber-500 bg-amber-500/10' },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-heading">Overview</h1>
          <p className="text-sm text-muted">Manage your articles and monitor your audience metrics.</p>
        </div>
        <Link href="/dashboard/write">
          <Button icon={<Plus className="w-4 h-4" />}>Write New Story</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      {statsLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rect" height="100px" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <Card key={i} padding="sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted">{item.label}</span>
                  <div className={`p-2 rounded-lg ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold font-heading text-heading mt-2">{item.value}</p>
              </Card>
            );
          })}
        </div>
      )}

      {/* Top Blogs Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-heading font-bold text-heading">Top Performing Stories</h2>
        {topLoading ? (
          <div className="space-y-3">
            <Skeleton variant="text" lines={3} />
          </div>
        ) : topBlogs.length === 0 ? (
          <div className="text-center py-12 text-muted border border-dashed border-border-custom rounded-[var(--radius-lg)]">
            No published articles yet. Publish your first story to view audience analytics!
          </div>
        ) : (
          <div className="bg-surface border border-border-custom rounded-[var(--radius-lg)] overflow-hidden">
            <div className="divide-y divide-border-custom">
              {topBlogs.map((blog) => (
                <div key={blog._id} className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-surface-secondary transition-colors duration-200">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-primary mb-1">{blog.category.name}</p>
                    <h3 className="text-sm font-semibold text-heading truncate max-w-md">{blog.title}</h3>
                    <p className="text-xs text-muted mt-0.5">Published {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div className="flex items-center gap-6 shrink-0 text-sm">
                    <div className="flex items-center gap-1.5 text-muted">
                      <Eye className="w-4 h-4" />
                      <span>{blog.views}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted">
                      <Heart className="w-4 h-4" />
                      <span>{blog.likesCount}</span>
                    </div>
                    <Link href={`/blog/${blog.slug}`} className="text-primary hover:text-primary-hover flex items-center gap-1 font-semibold">
                      <span>View</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
