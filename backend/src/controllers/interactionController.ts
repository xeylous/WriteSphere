import { Request, Response } from 'express';
import { Like, Bookmark, Blog } from '../models';
import { ApiResponse } from '../utils/ApiResponse';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../middleware/errorHandler';

export const interactionController = {
  /** Toggle like on a blog. */
  toggleLike: catchAsync(async (req: Request, res: Response) => {
    const { blogId } = req.params;
    const userId = req.user!._id;

    const blog = await Blog.findById(blogId);
    if (!blog) throw new AppError('Blog not found', 404);

    const existing = await Like.findOne({ user: userId, blog: blogId });

    if (existing) {
      await existing.deleteOne();
      await Blog.findByIdAndUpdate(blogId, { $inc: { likesCount: -1 } });
      ApiResponse.success(res, { liked: false }, 'Unliked');
    } else {
      await Like.create({ user: userId, blog: blogId });
      await Blog.findByIdAndUpdate(blogId, { $inc: { likesCount: 1 } });
      ApiResponse.success(res, { liked: true }, 'Liked');
    }
  }),

  /** Toggle bookmark on a blog. */
  toggleBookmark: catchAsync(async (req: Request, res: Response) => {
    const { blogId } = req.params;
    const userId = req.user!._id;

    const blog = await Blog.findById(blogId);
    if (!blog) throw new AppError('Blog not found', 404);

    const existing = await Bookmark.findOne({ user: userId, blog: blogId });

    if (existing) {
      await existing.deleteOne();
      await Blog.findByIdAndUpdate(blogId, { $inc: { bookmarksCount: -1 } });
      ApiResponse.success(res, { bookmarked: false }, 'Bookmark removed');
    } else {
      await Bookmark.create({ user: userId, blog: blogId });
      await Blog.findByIdAndUpdate(blogId, { $inc: { bookmarksCount: 1 } });
      ApiResponse.success(res, { bookmarked: true }, 'Bookmarked');
    }
  }),

  /** Get user's bookmarked blogs. */
  getUserBookmarks: catchAsync(async (req: Request, res: Response) => {
    const bookmarks = await Bookmark.find({ user: req.user!._id })
      .sort('-createdAt')
      .populate({
        path: 'blog',
        populate: [
          { path: 'author', select: 'name avatar' },
          { path: 'category', select: 'name slug icon' },
        ],
      })
      .lean();

    const blogs = bookmarks.map((b) => b.blog).filter(Boolean);
    ApiResponse.success(res, blogs);
  }),

  /** Get user's liked blogs. */
  getUserLikes: catchAsync(async (req: Request, res: Response) => {
    const likes = await Like.find({ user: req.user!._id })
      .sort('-createdAt')
      .populate({
        path: 'blog',
        populate: [
          { path: 'author', select: 'name avatar' },
          { path: 'category', select: 'name slug icon' },
        ],
      })
      .lean();

    const blogs = likes.map((l) => l.blog).filter(Boolean);
    ApiResponse.success(res, blogs);
  }),

  /** Check if user has liked/bookmarked a blog. */
  getInteractionStatus: catchAsync(async (req: Request, res: Response) => {
    const { blogId } = req.params;
    const userId = req.user!._id;

    const [liked, bookmarked] = await Promise.all([
      Like.exists({ user: userId, blog: blogId }),
      Bookmark.exists({ user: userId, blog: blogId }),
    ]);

    ApiResponse.success(res, { liked: !!liked, bookmarked: !!bookmarked });
  }),
};
