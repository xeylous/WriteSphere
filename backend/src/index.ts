import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';

import { env } from './config/env';
import { connectDatabase } from './config/database';
import { corsOptions } from './config/cors';
import { requestLogger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';

// Import route modules
import authRoutes from './routes/v1/authRoutes';
import blogRoutes from './routes/v1/blogRoutes';
import commentRoutes from './routes/v1/commentRoutes';
import interactionRoutes from './routes/v1/interactionRoutes';
import categoryRoutes from './routes/v1/categoryRoutes';
import tagRoutes from './routes/v1/tagRoutes';
import userRoutes from './routes/v1/userRoutes';
import draftRoutes from './routes/v1/draftRoutes';
import aiRoutes from './routes/v1/aiRoutes';
import uploadRoutes from './routes/v1/uploadRoutes';
import analyticsRoutes from './routes/v1/analyticsRoutes';

/**
 * WriteSphere API Server
 * Express application with middleware stack, API routes, and error handling.
 */
async function startServer(): Promise<void> {
  const app = express();

  // ─── Security & Parsing ──────────────────────
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // ─── Logging ─────────────────────────────────
  app.use(requestLogger);

  // ─── Rate Limiting ───────────────────────────
  app.use('/api/', apiLimiter);

  // ─── Static Files (uploads) ──────────────────
  app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

  // ─── API Routes (v1) ─────────────────────────
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/blogs', blogRoutes);
  app.use('/api/v1/comments', commentRoutes);
  app.use('/api/v1/interactions', interactionRoutes);
  app.use('/api/v1/categories', categoryRoutes);
  app.use('/api/v1/tags', tagRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/drafts', draftRoutes);
  app.use('/api/v1/ai', aiRoutes);
  app.use('/api/v1/upload', uploadRoutes);
  app.use('/api/v1/analytics', analyticsRoutes);

  // ─── Health Check ────────────────────────────
  app.get('/api/health', (_req, res) => {
    res.json({
      success: true,
      message: 'WriteSphere API is running',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    });
  });

  // ─── 404 Handler ─────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
    });
  });

  // ─── Global Error Handler ────────────────────
  app.use(errorHandler);

  // ─── Connect Database & Start ────────────────
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`\n🚀 WriteSphere API running on port ${env.PORT}`);
    console.log(`📝 Environment: ${env.NODE_ENV}`);
    console.log(`🔗 http://localhost:${env.PORT}/api/health\n`);
  });
}

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
