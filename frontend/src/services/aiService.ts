import api from '@/lib/api';
import type { ApiResponse } from '@/types';

export const aiService = {
  /** Grammar fixing action. */
  async grammarFix(text: string): Promise<ApiResponse<{ result: string }>> {
    const { data } = await api.post('/ai/grammar-fix', { text });
    return data;
  },

  /** Rewrite text with custom tone. */
  async rewrite(text: string, tone: string): Promise<ApiResponse<{ result: string }>> {
    const { data } = await api.post('/ai/rewrite', { text, tone });
    return data;
  },

  /** Expand text. */
  async expand(text: string): Promise<ApiResponse<{ result: string }>> {
    const { data } = await api.post('/ai/expand', { text });
    return data;
  },

  /** Shorten text. */
  async shorten(text: string): Promise<ApiResponse<{ result: string }>> {
    const { data } = await api.post('/ai/shorten', { text });
    return data;
  },

  /** Continue writing from current text block. */
  async continue(text: string, context?: string): Promise<ApiResponse<{ result: string }>> {
    const { data } = await api.post('/ai/continue', { text, context });
    return data;
  },

  /** Generate list of title ideas from content. */
  async generateTitle(content: string): Promise<ApiResponse<{ result: string }>> {
    const { data } = await api.post('/ai/generate-title', { content });
    return data;
  },

  /** Generate tag tags list from content. */
  async generateTags(content: string): Promise<ApiResponse<{ result: string }>> {
    const { data } = await api.post('/ai/generate-tags', { content });
    return data;
  },

  /** Generate SEO title/description JSON. */
  async generateSEO(content: string): Promise<ApiResponse<{ result: string }>> {
    const { data } = await api.post('/ai/generate-seo', { content });
    return data;
  },

  /** Summarize content. */
  async summarize(content: string): Promise<ApiResponse<{ result: string }>> {
    const { data } = await api.post('/ai/summarize', { content });
    return data;
  },

  /** Extract key bullet takeaways. */
  async keyTakeaways(content: string): Promise<ApiResponse<{ result: string }>> {
    const { data } = await api.post('/ai/key-takeaways', { content });
    return data;
  },

  /** Generate introductory paragraph. */
  async generateIntro(topic: string): Promise<ApiResponse<{ result: string }>> {
    const { data } = await api.post('/ai/generate-intro', { topic });
    return data;
  },

  /** Generate conclusion paragraph. */
  async generateConclusion(content: string): Promise<ApiResponse<{ result: string }>> {
    const { data } = await api.post('/ai/generate-conclusion', { content });
    return data;
  },
};
