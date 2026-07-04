import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { ApiResponse } from '../utils/ApiResponse';
import { catchAsync } from '../utils/catchAsync';

/**
 * Auth controller — thin handlers that delegate to authService.
 */
export const authController = {
  /**
   * POST /api/v1/auth/register
   */
  register: catchAsync(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    ApiResponse.created(res, result, 'Registration successful');
  }),

  /**
   * POST /api/v1/auth/login
   */
  login: catchAsync(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    ApiResponse.success(res, result, 'Login successful');
  }),

  /**
   * POST /api/v1/auth/google
   */
  googleAuth: catchAsync(async (req: Request, res: Response) => {
    const { credential } = req.body;
    const result = await authService.googleAuth(credential);
    ApiResponse.success(res, result, 'Google authentication successful');
  }),

  /**
   * POST /api/v1/auth/refresh
   */
  refreshToken: catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshAccessToken(refreshToken);
    ApiResponse.success(res, tokens, 'Token refreshed');
  }),

  /**
   * POST /api/v1/auth/logout
   */
  logout: catchAsync(async (req: Request, res: Response) => {
    await authService.logout(req.user!._id.toString());
    ApiResponse.success(res, null, 'Logged out successfully');
  }),

  /**
   * GET /api/v1/auth/me
   */
  getMe: catchAsync(async (req: Request, res: Response) => {
    const user = await authService.getCurrentUser(req.user!._id.toString());
    ApiResponse.success(res, user, 'User retrieved');
  }),
};
