import { Request, Response } from 'express';
import slugify from 'slugify';
import { Category } from '../models';
import { ApiResponse } from '../utils/ApiResponse';
import { catchAsync } from '../utils/catchAsync';
import { cacheService } from '../services/cacheService';
import { CACHE_KEYS, CACHE_TTL } from '../utils/constants';

export const categoryController = {
  getAll: catchAsync(async (_req: Request, res: Response) => {
    const cached = await cacheService.get(CACHE_KEYS.CATEGORIES);
    if (cached) return ApiResponse.success(res, cached);

    const categories = await Category.find().sort('name').lean();
    await cacheService.set(CACHE_KEYS.CATEGORIES, categories, CACHE_TTL.CATEGORIES);
    ApiResponse.success(res, categories);
  }),

  getBySlug: catchAsync(async (req: Request, res: Response) => {
    const category = await Category.findOne({ slug: req.params.slug }).lean();
    if (!category) {
      return ApiResponse.error(res, 'Category not found', 404);
    }
    ApiResponse.success(res, category);
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const { name, description, icon } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    const category = await Category.create({ name, slug, description, icon });
    await cacheService.del(CACHE_KEYS.CATEGORIES);
    ApiResponse.created(res, category);
  }),
};
