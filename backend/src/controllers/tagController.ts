import { Request, Response } from 'express';
import slugify from 'slugify';
import { Tag } from '../models';
import { ApiResponse } from '../utils/ApiResponse';
import { catchAsync } from '../utils/catchAsync';
import { cacheService } from '../services/cacheService';
import { CACHE_KEYS, CACHE_TTL } from '../utils/constants';

export const tagController = {
  getAll: catchAsync(async (_req: Request, res: Response) => {
    const cached = await cacheService.get(CACHE_KEYS.TAGS);
    if (cached) return ApiResponse.success(res, cached);

    const tags = await Tag.find().sort('-blogCount').lean();
    await cacheService.set(CACHE_KEYS.TAGS, tags, CACHE_TTL.TAGS);
    ApiResponse.success(res, tags);
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const { name } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    const tag = await Tag.create({ name, slug });
    await cacheService.del(CACHE_KEYS.TAGS);
    ApiResponse.created(res, tag);
  }),
};
