import { Request, Response } from 'express';
import { Comment, Blog } from '../models';
import { ApiResponse } from '../utils/ApiResponse';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../middleware/errorHandler';

export const commentController = {
  getByBlog: catchAsync(async (req: Request, res: Response) => {
    const { blogId } = req.params;
    const comments = await Comment.find({ blog: blogId, parentComment: null })
      .sort('-createdAt')
      .populate('author', 'name avatar')
      .lean();

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentComment: comment._id })
          .sort('createdAt')
          .populate('author', 'name avatar')
          .lean();
        return { ...comment, replies };
      }),
    );

    ApiResponse.success(res, commentsWithReplies);
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const { blogId } = req.params;
    const { content, parentComment } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) throw new AppError('Blog not found', 404);

    const comment = await Comment.create({
      content,
      author: req.user!._id,
      blog: blogId,
      parentComment: parentComment || null,
    });

    await Blog.findByIdAndUpdate(blogId, { $inc: { commentsCount: 1 } });

    const populated = await comment.populate('author', 'name avatar');
    ApiResponse.created(res, populated);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) throw new AppError('Comment not found', 404);
    if (comment.author.toString() !== req.user!._id.toString()) {
      throw new AppError('Not authorized', 403);
    }

    comment.content = req.body.content;
    comment.isEdited = true;
    await comment.save();

    ApiResponse.success(res, comment, 'Comment updated');
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) throw new AppError('Comment not found', 404);
    if (comment.author.toString() !== req.user!._id.toString()) {
      throw new AppError('Not authorized', 403);
    }

    // Delete replies too
    await Comment.deleteMany({ parentComment: comment._id });
    await comment.deleteOne();
    await Blog.findByIdAndUpdate(comment.blog, { $inc: { commentsCount: -1 } });

    ApiResponse.noContent(res);
  }),
};
