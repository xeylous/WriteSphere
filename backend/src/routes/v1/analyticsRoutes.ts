import { Router } from 'express';
import { analyticsController } from '../../controllers/analyticsController';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/overview', analyticsController.getOverview);
router.get('/views', analyticsController.getViewsData);
router.get('/top-blogs', analyticsController.getTopBlogs);

export default router;
