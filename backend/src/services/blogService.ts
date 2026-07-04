import slugify from 'slugify';
import readingTime from 'reading-time';
import { blogRepository } from '../repositories/blogRepository';
import { cacheService } from './cacheService';
import { Blog, User, Category, Tag } from '../models';
import { AppError } from '../middleware/errorHandler';
import { CACHE_KEYS, CACHE_TTL } from '../utils/constants';

/**
 * Blog service — business logic for blog operations.
 * Handles slug generation, reading time, cache management.
 */
class BlogService {
  /**
   * Get paginated blog list with caching.
   */
  async getAll(options: Record<string, unknown>) {
    const cacheKey = `${CACHE_KEYS.BLOG_LIST}${JSON.stringify(options)}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const result = await blogRepository.findAll(options as any);
    await cacheService.set(cacheKey, result, CACHE_TTL.BLOG_LIST);
    return result;
  }

  /**
   * Get single blog by slug with caching.
   * Increments view count via Redis counter.
   */
  async getBySlug(slug: string) {
    const cacheKey = `${CACHE_KEYS.BLOG}${slug}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      // Increment view counter asynchronously
      cacheService.increment(`${CACHE_KEYS.VIEW_COUNT}${slug}`);
      return cached;
    }

    const blog = await blogRepository.findBySlug(slug);
    if (!blog) {
      throw new AppError('Blog not found', 404);
    }

    await cacheService.set(cacheKey, blog, CACHE_TTL.BLOG_DETAIL);
    cacheService.increment(`${CACHE_KEYS.VIEW_COUNT}${slug}`);

    return blog;
  }

  /**
   * Get featured blogs with caching.
   */
  async getFeatured() {
    const cacheKey = CACHE_KEYS.FEATURED;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const blogs = await blogRepository.findFeatured();
    await cacheService.set(cacheKey, blogs, CACHE_TTL.FEATURED);
    return blogs;
  }

  /**
   * Get trending blogs with caching.
   */
  async getTrending() {
    const cacheKey = CACHE_KEYS.TRENDING;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const blogs = await blogRepository.findTrending();
    await cacheService.set(cacheKey, blogs, CACHE_TTL.TRENDING);
    return blogs;
  }

  /**
   * Create a new blog post.
   * Generates slug, calculates reading time, updates counters.
   */
  async create(data: {
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    category: string;
    tags?: string[];
    seo?: { metaTitle: string; metaDescription: string; metaKeywords: string[] };
    status?: string;
  }, authorId: string) {
    // Generate unique slug
    let slug = slugify(data.title, { lower: true, strict: true });
    const existingSlug = await Blog.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // Calculate reading time
    const stats = readingTime(data.content);

    const blogData = {
      ...data,
      slug,
      author: authorId,
      readingTime: Math.ceil(stats.minutes),
      excerpt: data.excerpt || data.content.substring(0, 200).replace(/[#*_`]/g, '').trim(),
      publishedAt: data.status === 'published' ? new Date() : undefined,
    };

    const blog = await blogRepository.create(blogData as any);

    // Update category blog count
    if (data.category) {
      await Category.findByIdAndUpdate(data.category, { $inc: { blogCount: 1 } });
    }

    // Update tag blog counts
    if (data.tags?.length) {
      await Tag.updateMany({ _id: { $in: data.tags } }, { $inc: { blogCount: 1 } });
    }

    // Update author blog count
    await User.findByIdAndUpdate(authorId, { $inc: { blogCount: 1 } });

    // Invalidate list caches
    await cacheService.invalidatePattern(`${CACHE_KEYS.BLOG_LIST}*`);

    return blog;
  }

  /**
   * Update an existing blog.
   */
  async update(blogId: string, data: Record<string, unknown>, userId: string) {
    const blog = await blogRepository.findById(blogId);
    if (!blog) throw new AppError('Blog not found', 404);
    if (blog.author._id.toString() !== userId) {
      throw new AppError('Not authorized to edit this blog', 403);
    }

    // Recalculate reading time if content changed
    if (data.content) {
      const stats = readingTime(data.content as string);
      data.readingTime = Math.ceil(stats.minutes);
    }

    // Regenerate slug if title changed
    if (data.title && data.title !== blog.title) {
      let slug = slugify(data.title as string, { lower: true, strict: true });
      const existing = await Blog.findOne({ slug, _id: { $ne: blogId } });
      if (existing) slug = `${slug}-${Date.now().toString(36)}`;
      data.slug = slug;
    }

    const updated = await blogRepository.update(blogId, data as any);

    // Invalidate caches
    await cacheService.del(`${CACHE_KEYS.BLOG}${blog.slug}`);
    await cacheService.invalidatePattern(`${CACHE_KEYS.BLOG_LIST}*`);

    return updated;
  }

  /**
   * Delete a blog.
   */
  async delete(blogId: string, userId: string) {
    const blog = await blogRepository.findById(blogId);
    if (!blog) throw new AppError('Blog not found', 404);
    if (blog.author._id.toString() !== userId) {
      throw new AppError('Not authorized to delete this blog', 403);
    }

    await blogRepository.delete(blogId);

    // Update counters
    await Category.findByIdAndUpdate(blog.category, { $inc: { blogCount: -1 } });
    await User.findByIdAndUpdate(userId, { $inc: { blogCount: -1 } });
    if (blog.tags?.length) {
      await Tag.updateMany({ _id: { $in: blog.tags } }, { $inc: { blogCount: -1 } });
    }

    // Invalidate caches
    await cacheService.del(`${CACHE_KEYS.BLOG}${blog.slug}`);
    await cacheService.invalidatePattern(`${CACHE_KEYS.BLOG_LIST}*`);
  }

  /**
   * Search blogs by query text.
   */
  async search(query: string, page = 1, limit = 12) {
    return blogRepository.findAll({ search: query, page, limit });
  }

  /**
   * Get related blogs for a given blog.
   */
  async getRelated(blogId: string, categoryId: string) {
    return blogRepository.findRelated(blogId, categoryId);
  }
}

export const blogService = new BlogService();
