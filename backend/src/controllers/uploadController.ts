import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../middleware/errorHandler';

export const uploadController = {
  uploadImage: catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }
    
    // Return relative URL for static service mapping
    const fileUrl = `/uploads/${req.file.filename}`;
    ApiResponse.success(res, { url: fileUrl }, 'File uploaded successfully');
  }),
};
