import { Request, Response } from 'express';
import { User, Blog } from '../models';
import { ApiResponse } from '../utils/ApiResponse';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../middleware/errorHandler';

export const userController = {
  getById: catchAsync(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id).lean();
    if (!user) throw new AppError('User not found', 404);
    ApiResponse.success(res, user);
  }),

  getUserBlogs: catchAsync(async (req: Request, res: Response) => {
    const { page = 1, limit = 12 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [blogs, total] = await Promise.all([
      Blog.find({ author: req.params.id, status: 'published' })
        .sort('-publishedAt')
        .skip(skip)
        .limit(Number(limit))
        .populate('category', 'name slug icon')
        .populate('tags', 'name slug')
        .lean(),
      Blog.countDocuments({ author: req.params.id, status: 'published' }),
    ]);

    ApiResponse.paginated(res, blogs, total, Number(page), Number(limit));
  }),

  updateProfile: catchAsync(async (req: Request, res: Response) => {
    const { name, bio, avatar, social, themePreference } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { name, bio, avatar, social, themePreference },
      { new: true, runValidators: true },
    );
    ApiResponse.success(res, user, 'Profile updated');
  }),

  getFeaturedAuthors: catchAsync(async (_req: Request, res: Response) => {
    const authors = await User.find({ role: 'author', blogCount: { $gt: 0 } })
      .sort('-blogCount')
      .limit(8)
      .lean();
    ApiResponse.success(res, authors);
  }),
};
