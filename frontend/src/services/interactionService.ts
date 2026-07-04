import api from '@/lib/api';
import type { ApiResponse } from '@/types';

export const interactionService = {
  /** Toggle like on a blog post. */
  async toggleLike(blogId: string): Promise<ApiResponse<{ liked: boolean }>> {
    const { data } = await api.post(`/interactions/blogs/${blogId}/like`);
    return data;
  },

  /** Toggle bookmark on a blog post. */
  async toggleBookmark(blogId: string): Promise<ApiResponse<{ bookmarked: boolean }>> {
    const { data } = await api.post(`/interactions/blogs/${blogId}/bookmark`);
    return data;
  },

  /** Get user's current status on a blog post (liked/bookmarked). */
  async getStatus(blogId: string): Promise<ApiResponse<{ liked: boolean; bookmarked: boolean }>> {
    const { data } = await api.get(`/interactions/blogs/${blogId}/status`);
    return data;
  },
};
