import { Router } from 'express';
import { categoryController } from '../../controllers/categoryController';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/', categoryController.getAll);
router.get('/:slug', categoryController.getBySlug);
router.post('/', authenticate, categoryController.create);

export default router;
