import { Request, Response } from 'express';
import { blogService } from '../services/blogService';
import { ApiResponse } from '../utils/ApiResponse';
import { catchAsync } from '../utils/catchAsync';

/**
 * Blog controller — request handlers for blog CRUD operations.
 */
export const blogController = {
  getAll: catchAsync(async (req: Request, res: Response) => {
    const result = await blogService.getAll(req.query);
    const { blogs, total, page, limit } = result as any;
    ApiResponse.paginated(res, blogs, total, page, limit);
  }),

  getFeatured: catchAsync(async (_req: Request, res: Response) => {
    const blogs = await blogService.getFeatured();
    ApiResponse.success(res, blogs);
  }),

  getTrending: catchAsync(async (_req: Request, res: Response) => {
    const blogs = await blogService.getTrending();
    ApiResponse.success(res, blogs);
  }),

  getBySlug: catchAsync(async (req: Request, res: Response) => {
    const blog = await blogService.getBySlug(req.params.slug as string);
    ApiResponse.success(res, blog);
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const blog = await blogService.create(req.body, req.user!._id.toString());
    ApiResponse.created(res, blog, 'Blog created successfully');
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const blog = await blogService.update(req.params.id as string, req.body, req.user!._id.toString());
    ApiResponse.success(res, blog, 'Blog updated successfully');
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    await blogService.delete(req.params.id as string, req.user!._id.toString());
    ApiResponse.noContent(res);
  }),

  search: catchAsync(async (req: Request, res: Response) => {
    const { q, page, limit } = req.query;
    const result = await blogService.search(
      q as string,
      Number(page) || 1,
      Number(limit) || 12,
    );
    const { blogs, total } = result as any;
    ApiResponse.paginated(res, blogs, total, Number(page) || 1, Number(limit) || 12);
  }),
};
