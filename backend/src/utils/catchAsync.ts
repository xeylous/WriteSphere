import { Request, Response, NextFunction } from 'express';

/**
 * Wraps async route handlers to catch errors and forward to error middleware.
 * Eliminates the need for try/catch in every controller method.
 *
 * @example
 * router.get('/blogs', catchAsync(blogController.getAll));
 */
export function catchAsync(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}
