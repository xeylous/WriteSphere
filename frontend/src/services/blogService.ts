import api from '@/lib/api';
import type { BlogListItem, Blog, BlogQueryParams, PaginatedResponse, ApiResponse } from '@/types';

export const blogService = {
  /** Get paginated published blogs with filters. */
  async getAll(params: BlogQueryParams = {}): Promise<PaginatedResponse<BlogListItem>> {
    const { data } = await api.get('/blogs', { params });
    return data;
  },

  /** Get featured blogs. */
  async getFeatured(): Promise<ApiResponse<BlogListItem[]>> {
    const { data } = await api.get('/blogs/featured');
    return data;
  },

  /** Get trending blogs. */
  async getTrending(): Promise<ApiResponse<BlogListItem[]>> {
    const { data } = await api.get('/blogs/trending');
    return data;
  },

  /** Get a single blog by its slug. */
  async getBySlug(slug: string): Promise<ApiResponse<Blog>> {
    const { data } = await api.get(`/blogs/${slug}`);
    return data;
  },

  /** Create a new blog post. */
  async create(blogData: Partial<Blog>): Promise<ApiResponse<Blog>> {
    const { data } = await api.post('/blogs', blogData);
    return data;
  },

  /** Update an existing blog. */
  async update(id: string, blogData: Partial<Blog>): Promise<ApiResponse<Blog>> {
    const { data } = await api.put(`/blogs/${id}`, blogData);
    return data;
  },

  /** Delete a blog post. */
  async delete(id: string): Promise<void> {
    await api.delete(`/blogs/${id}`);
  },

  /** Search blogs by query string. */
  async search(q: string, page = 1): Promise<PaginatedResponse<BlogListItem>> {
    const { data } = await api.get('/blogs/search', { params: { q, page } });
    return data;
  },
};
