import morgan from 'morgan';
import { env } from '../config/env';

/**
 * Request logging middleware.
 * Uses concise format in production, detailed in development.
 */
export const requestLogger = morgan(
  env.NODE_ENV === 'production'
    ? ':method :url :status :response-time ms'
    : ':method :url :status :response-time ms - :res[content-length]',
);
