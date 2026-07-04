import api from '@/lib/api';
import type { Comment, ApiResponse } from '@/types';

export const commentService = {
  /** Get comments for a blog. */
  async getByBlog(blogId: string): Promise<ApiResponse<Comment[]>> {
    const { data } = await api.get(`/comments/blogs/${blogId}/comments`);
    return data;
  },

  /** Add a comment or reply to a blog. */
  async create(blogId: string, content: string, parentComment?: string): Promise<ApiResponse<Comment>> {
    const { data } = await api.post(`/comments/blogs/${blogId}/comments`, { content, parentComment });
    return data;
  },

  /** Update a comment content. */
  async update(id: string, content: string): Promise<ApiResponse<Comment>> {
    const { data } = await api.put(`/comments/comments/${id}`, { content });
    return data;
  },

  /** Delete a comment. */
  async delete(id: string): Promise<void> {
    await api.delete(`/comments/comments/${id}`);
  },
};
