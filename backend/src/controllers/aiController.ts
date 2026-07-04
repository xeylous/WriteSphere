import { Request, Response } from 'express';
import { aiService } from '../services/aiService';
import { ApiResponse } from '../utils/ApiResponse';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../middleware/errorHandler';

export const aiController = {
  grammarFix: catchAsync(async (req: Request, res: Response) => {
    const { text } = req.body;
    if (!text) throw new AppError('Text is required', 400);
    const result = await aiService.grammarFix(text, req.user!._id.toString());
    ApiResponse.success(res, result);
  }),

  rewrite: catchAsync(async (req: Request, res: Response) => {
    const { text, tone } = req.body;
    if (!text || !tone) throw new AppError('Text and tone are required', 400);
    const result = await aiService.rewrite(text, tone, req.user!._id.toString());
    ApiResponse.success(res, result);
  }),

  expand: catchAsync(async (req: Request, res: Response) => {
    const { text } = req.body;
    if (!text) throw new AppError('Text is required', 400);
    const result = await aiService.expand(text, req.user!._id.toString());
    ApiResponse.success(res, result);
  }),

  shorten: catchAsync(async (req: Request, res: Response) => {
    const { text } = req.body;
    if (!text) throw new AppError('Text is required', 400);
    const result = await aiService.shorten(text, req.user!._id.toString());
    ApiResponse.success(res, result);
  }),

  continue: catchAsync(async (req: Request, res: Response) => {
    const { text, context } = req.body;
    if (!text) throw new AppError('Text is required', 400);
    const result = await aiService.continueWriting(text, context, req.user!._id.toString());
    ApiResponse.success(res, result);
  }),

  generateTitle: catchAsync(async (req: Request, res: Response) => {
    const { content } = req.body;
    if (!content) throw new AppError('Content is required', 400);
    const result = await aiService.generateTitle(content, req.user!._id.toString());
    ApiResponse.success(res, result);
  }),

  generateTags: catchAsync(async (req: Request, res: Response) => {
    const { content } = req.body;
    if (!content) throw new AppError('Content is required', 400);
    const result = await aiService.generateTags(content, req.user!._id.toString());
    ApiResponse.success(res, result);
  }),

  generateSEO: catchAsync(async (req: Request, res: Response) => {
    const { content } = req.body;
    if (!content) throw new AppError('Content is required', 400);
    const result = await aiService.generateSEO(content, req.user!._id.toString());
    ApiResponse.success(res, result);
  }),

  generateIntro: catchAsync(async (req: Request, res: Response) => {
    const { topic } = req.body;
    if (!topic) throw new AppError('Topic is required', 400);
    const result = await aiService.generateIntro(topic, req.user!._id.toString());
    ApiResponse.success(res, result);
  }),

  generateConclusion: catchAsync(async (req: Request, res: Response) => {
    const { content } = req.body;
    if (!content) throw new AppError('Content is required', 400);
    const result = await aiService.generateConclusion(content, req.user!._id.toString());
    ApiResponse.success(res, result);
  }),

  summarize: catchAsync(async (req: Request, res: Response) => {
    const { content } = req.body;
    if (!content) throw new AppError('Content is required', 400);
    const result = await aiService.summarize(content, req.user!._id.toString());
    ApiResponse.success(res, result);
  }),

  keyTakeaways: catchAsync(async (req: Request, res: Response) => {
    const { content } = req.body;
    if (!content) throw new AppError('Content is required', 400);
    const result = await aiService.keyTakeaways(content, req.user!._id.toString());
    ApiResponse.success(res, result);
  }),
};
