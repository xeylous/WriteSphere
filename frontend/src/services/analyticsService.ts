import api from '@/lib/api';
import type { AnalyticsOverview, ViewsData, BlogListItem, ApiResponse } from '@/types';

export const analyticsService = {
  /** Get overview statistics counts. */
  async getOverview(): Promise<ApiResponse<AnalyticsOverview>> {
    const { data } = await api.get('/analytics/overview');
    return data;
  },

  /** Get views over time chart data. */
  async getViewsData(): Promise<ApiResponse<ViewsData[]>> {
    const { data } = await api.get('/analytics/views');
    return data;
  },

  /** Get top performing articles. */
  async getTopBlogs(): Promise<ApiResponse<BlogListItem[]>> {
    const { data } = await api.get('/analytics/top-blogs');
    return data;
  },
};
