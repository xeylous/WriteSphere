/**
 * Application-wide constants.
 * Single source of truth for magic numbers and repeated values.
 */

/** Pagination defaults */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50,
} as const;

/** Cache TTL values in seconds */
export const CACHE_TTL = {
  BLOG_DETAIL: 300,       // 5 minutes
  BLOG_LIST: 120,         // 2 minutes
  TRENDING: 600,          // 10 minutes
  USER_PROFILE: 300,      // 5 minutes
  CATEGORIES: 1800,       // 30 minutes
  TAGS: 1800,             // 30 minutes
  THEME: 3600,            // 1 hour
  AI_SUMMARY: 86400,      // 24 hours
  FEATURED: 600,          // 10 minutes
  SEARCH: 300,            // 5 minutes
} as const;

/** Cache key prefixes */
export const CACHE_KEYS = {
  BLOG: 'blog:',
  BLOG_LIST: 'blogs:',
  TRENDING: 'trending:',
  FEATURED: 'featured:',
  USER: 'user:',
  CATEGORIES: 'categories',
  TAGS: 'tags',
  THEME: 'theme:',
  AI: 'ai:',
  SEARCH: 'search:',
  VIEW_COUNT: 'views:',
} as const;

/** Blog status */
export const BLOG_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

/** User roles */
export const USER_ROLES = {
  USER: 'user',
  AUTHOR: 'author',
  ADMIN: 'admin',
} as const;

/** Auth providers */
export const AUTH_PROVIDERS = {
  LOCAL: 'local',
  GOOGLE: 'google',
} as const;

/** Notification types */
export const NOTIFICATION_TYPES = {
  LIKE: 'like',
  COMMENT: 'comment',
  FOLLOW: 'follow',
  MENTION: 'mention',
} as const;

/** AI action types */
export const AI_ACTIONS = {
  GRAMMAR_FIX: 'grammar_fix',
  REWRITE: 'rewrite',
  EXPAND: 'expand',
  SHORTEN: 'shorten',
  CONTINUE: 'continue',
  GENERATE_TITLE: 'generate_title',
  GENERATE_TAGS: 'generate_tags',
  GENERATE_SEO: 'generate_seo',
  GENERATE_INTRO: 'generate_intro',
  GENERATE_CONCLUSION: 'generate_conclusion',
  SUMMARIZE: 'summarize',
  KEY_TAKEAWAYS: 'key_takeaways',
} as const;
