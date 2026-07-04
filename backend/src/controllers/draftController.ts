import { Request, Response } from 'express';
import { Draft } from '../models';
import { ApiResponse } from '../utils/ApiResponse';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../middleware/errorHandler';

export const draftController = {
  getAll: catchAsync(async (req: Request, res: Response) => {
    const drafts = await Draft.find({ author: req.user!._id })
      .sort('-lastSavedAt')
      .populate('category', 'name slug icon')
      .lean();
    ApiResponse.success(res, drafts);
  }),

  getById: catchAsync(async (req: Request, res: Response) => {
    const draft = await Draft.findOne({ _id: req.params.id, author: req.user!._id })
      .populate('category', 'name slug icon')
      .populate('tags', 'name slug');
    if (!draft) throw new AppError('Draft not found', 404);
    ApiResponse.success(res, draft);
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const draft = await Draft.create({ ...req.body, author: req.user!._id });
    ApiResponse.created(res, draft);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const draft = await Draft.findOneAndUpdate(
      { _id: req.params.id, author: req.user!._id },
      { ...req.body, lastSavedAt: new Date() },
      { new: true },
    );
    if (!draft) throw new AppError('Draft not found', 404);
    ApiResponse.success(res, draft, 'Draft saved');
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    const draft = await Draft.findOneAndDelete({
      _id: req.params.id,
      author: req.user!._id,
    });
    if (!draft) throw new AppError('Draft not found', 404);
    ApiResponse.noContent(res);
  }),
};
