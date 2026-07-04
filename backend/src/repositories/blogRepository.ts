import { Blog, IBlog } from '../models';
import { PAGINATION } from '../utils/constants';

interface BlogQueryOptions {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  status?: string;
  author?: string;
  sort?: string;
  search?: string;
}

/**
 * Blog repository — data access layer for blog queries.
 * Handles pagination, filtering, population, and text search.
 */
class BlogRepository {
  /**
   * Find blogs with pagination and filtering.
   */
  async findAll(options: BlogQueryOptions) {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      category,
      tag,
      status = 'published',
      author,
      sort = '-publishedAt',
      search,
    } = options;

    const query: Record<string, unknown> = { status };

    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (author) query.author = author;
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('author', 'name avatar')
        .populate('category', 'name slug icon')
        .populate('tags', 'name slug')
        .lean(),
      Blog.countDocuments(query),
    ]);

    return { blogs, total, page, limit };
  }

  /**
   * Find a single blog by slug with full population.
   */
  async findBySlug(slug: string) {
    return Blog.findOne({ slug, status: 'published' })
      .populate('author', 'name email avatar bio social blogCount')
      .populate('category', 'name slug icon description')
      .populate('tags', 'name slug')
      .lean();
  }

  /**
   * Find a blog by ID (for editing).
   */
  async findById(id: string) {
    return Blog.findById(id)
      .populate('author', 'name avatar')
      .populate('category', 'name slug icon')
      .populate('tags', 'name slug');
  }

  /**
   * Get featured blogs.
   */
  async findFeatured(limit = 5) {
    return Blog.find({ status: 'published', isFeatured: true })
      .sort('-publishedAt')
      .limit(limit)
      .populate('author', 'name avatar')
      .populate('category', 'name slug icon')
      .lean();
  }

  /**
   * Get trending blogs by views.
   */
  async findTrending(limit = 6) {
    return Blog.find({ status: 'published' })
      .sort('-views')
      .limit(limit)
      .populate('author', 'name avatar')
      .populate('category', 'name slug icon')
      .lean();
  }

  /**
   * Create a new blog.
   */
  async create(data: Partial<IBlog>) {
    const blog = await Blog.create(data);
    return blog.populate([
      { path: 'author', select: 'name avatar' },
      { path: 'category', select: 'name slug icon' },
      { path: 'tags', select: 'name slug' },
    ]);
  }

  /**
   * Update a blog by ID.
   */
  async update(id: string, data: Partial<IBlog>) {
    return Blog.findByIdAndUpdate(id, data, { new: true })
      .populate('author', 'name avatar')
      .populate('category', 'name slug icon')
      .populate('tags', 'name slug');
  }

  /**
   * Delete a blog by ID.
   */
  async delete(id: string) {
    return Blog.findByIdAndDelete(id);
  }

  /**
   * Find related blogs by category (excluding current blog).
   */
  async findRelated(blogId: string, categoryId: string, limit = 4) {
    return Blog.find({
      _id: { $ne: blogId },
      category: categoryId,
      status: 'published',
    })
      .sort('-publishedAt')
      .limit(limit)
      .populate('author', 'name avatar')
      .populate('category', 'name slug icon')
      .lean();
  }
}

export const blogRepository = new BlogRepository();
