import { Response } from 'express';

/**
 * Standardized API response helper.
 * Ensures consistent response shape across all endpoints.
 */
export class ApiResponse {
  /**
   * Send a success response.
   */
  static success<T>(
    res: Response,
    data: T,
    message = 'Success',
    statusCode = 200,
    meta?: Record<string, unknown>,
  ): void {
    res.status(statusCode).json({
      success: true,
      message,
      data,
      ...(meta && { meta }),
    });
  }

  /**
   * Send a created response (201).
   */
  static created<T>(res: Response, data: T, message = 'Created'): void {
    ApiResponse.success(res, data, message, 201);
  }

  /**
   * Send a paginated response with metadata.
   */
  static paginated<T>(
    res: Response,
    data: T[],
    total: number,
    page: number,
    limit: number,
    message = 'Success',
  ): void {
    const totalPages = Math.ceil(total / limit);

    res.setHeader('X-Total-Count', total.toString());
    res.setHeader('X-Total-Pages', totalPages.toString());

    ApiResponse.success(res, data, message, 200, {
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  }

  /**
   * Send an error response.
   */
  static error(res: Response, message: string, statusCode = 500): void {
    res.status(statusCode).json({
      success: false,
      message,
    });
  }

  /**
   * Send a no-content response (204).
   */
  static noContent(res: Response): void {
    res.status(204).send();
  }
}
