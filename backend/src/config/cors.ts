import cors from 'cors';
import { env } from './env';

/**
 * CORS configuration allowing the frontend origin.
 * Supports credentials for cookie-based auth flows.
 */
export const corsOptions: cors.CorsOptions = {
  origin: [env.FRONTEND_URL],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Total-Pages'],
  maxAge: 86400, // 24 hours preflight cache
};
