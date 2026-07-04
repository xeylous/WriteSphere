import api from '@/lib/api';
import type { Draft, ApiResponse } from '@/types';

export const draftService = {
  /** List all drafts for the writer. */
  async getAll(): Promise<ApiResponse<Draft[]>> {
    const { data } = await api.get('/drafts');
    return data;
  },

  /** Get detailed draft content. */
  async getById(id: string): Promise<ApiResponse<Draft>> {
    const { data } = await api.get(`/drafts/${id}`);
    return data;
  },

  /** Create a new draft. */
  async create(draft: Partial<Draft>): Promise<ApiResponse<Draft>> {
    const { data } = await api.post('/drafts', draft);
    return data;
  },

  /** Autosave/Update draft. */
  async update(id: string, draft: Partial<Draft>): Promise<ApiResponse<Draft>> {
    const { data } = await api.put(`/drafts/${id}`, draft);
    return data;
  },

  /** Delete draft. */
  async delete(id: string): Promise<void> {
    await api.delete(`/drafts/${id}`);
  },
};
