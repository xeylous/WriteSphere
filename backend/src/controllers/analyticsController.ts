import { Request, Response } from 'express';
import { Blog, Comment, Like } from '../models';
import { ApiResponse } from '../utils/ApiResponse';
import { catchAsync } from '../utils/catchAsync';

export const analyticsController = {
  getOverview: catchAsync(async (req: Request, res: Response) => {
    const authorId = req.user!._id;

    // Get total views, likes, comments across all author blogs
    const stats = await Blog.aggregate([
      { $match: { author: authorId } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: '$likesCount' },
          totalComments: { $sum: '$commentsCount' },
          totalBlogs: { $sum: 1 },
        },
      },
    ]);

    const overview = stats[0] || {
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      totalBlogs: 0,
    };

    ApiResponse.success(res, overview);
  }),

  getViewsData: catchAsync(async (req: Request, res: Response) => {
    const authorId = req.user!._id;

    // Aggregate monthly views or views over time.
    // For demo purposes, we will return daily views for the last 7 days grouped by publication date.
    const blogs = await Blog.find({ author: authorId, status: 'published' })
      .sort('-publishedAt')
      .limit(10)
      .select('title views publishedAt')
      .lean();

    const viewsData = blogs.map((b) => ({
      date: b.publishedAt ? new Date(b.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A',
      views: b.views,
      title: b.title,
    }));

    ApiResponse.success(res, viewsData);
  }),

  getTopBlogs: catchAsync(async (req: Request, res: Response) => {
    const authorId = req.user!._id;

    const blogs = await Blog.find({ author: authorId, status: 'published' })
      .sort('-views')
      .limit(5)
      .populate('category', 'name icon')
      .lean();

    ApiResponse.success(res, blogs);
  }),
};
