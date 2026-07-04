import api from '@/lib/api';
import type { Category, Tag, ApiResponse } from '@/types';

export const categoryTagService = {
  /** Get all categories. */
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const { data } = await api.get('/categories');
    return data;
  },

  /** Get all tags. */
  async getTags(): Promise<ApiResponse<Tag[]>> {
    const { data } = await api.get('/tags');
    return data;
  },
};
