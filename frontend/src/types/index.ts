/**
 * WriteSphere — Shared TypeScript Interfaces
 * Single source of truth for all data types used across the frontend.
 */

// ─── User ────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  role: 'user' | 'author' | 'admin';
  provider: 'local' | 'google';
  themePreference: 'light' | 'dark' | 'system';
  social: {
    website?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  blogCount: number;
  followerCount: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Blog ────────────────────────────────────────
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: User;
  category: Category;
  tags: Tag[];
  status: 'draft' | 'published' | 'archived';
  readingTime: number;
  views: number;
  likesCount: number;
  commentsCount: number;
  bookmarksCount: number;
  seo: SEO;
  aiSummary: string;
  aiKeyTakeaways: string[];
  isFeatured: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogListItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  author: Pick<User, '_id' | 'name' | 'avatar'>;
  category: Pick<Category, '_id' | 'name' | 'slug' | 'icon'>;
  tags: Pick<Tag, '_id' | 'name' | 'slug'>[];
  readingTime: number;
  views: number;
  likesCount: number;
  commentsCount: number;
  publishedAt?: string;
}

// ─── Comment ─────────────────────────────────────
export interface Comment {
  _id: string;
  content: string;
  author: Pick<User, '_id' | 'name' | 'avatar'>;
  blog: string;
  parentComment?: string;
  likesCount: number;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

// ─── Category ────────────────────────────────────
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  blogCount: number;
}

// ─── Tag ─────────────────────────────────────────
export interface Tag {
  _id: string;
  name: string;
  slug: string;
  blogCount: number;
}

// ─── Draft ───────────────────────────────────────
export interface Draft {
  _id: string;
  author: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category?: string;
  tags: string[];
  seo: SEO;
  lastSavedAt: string;
  createdAt: string;
  updatedAt: string;
}

// ─── SEO ─────────────────────────────────────────
export interface SEO {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
}

// ─── Notification ────────────────────────────────
export interface Notification {
  _id: string;
  recipient: string;
  sender: Pick<User, '_id' | 'name' | 'avatar'>;
  type: 'like' | 'comment' | 'follow' | 'mention';
  blog?: Pick<Blog, '_id' | 'title' | 'slug'>;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ─── API Response Types ──────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    pagination?: Pagination;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    pagination: Pagination;
  };
}

// ─── Auth Types ──────────────────────────────────
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// ─── AI Types ────────────────────────────────────
export interface AIRequest {
  text: string;
  context?: string;
  blogId?: string;
}

export interface AIResponse {
  result: string;
  tokens?: number;
}

// ─── Analytics ───────────────────────────────────
export interface AnalyticsOverview {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalBlogs: number;
  viewsChange: number;
  likesChange: number;
}

export interface ViewsData {
  date: string;
  views: number;
}

// ─── Query Params ────────────────────────────────
export interface BlogQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  status?: string;
  sort?: string;
  search?: string;
}
