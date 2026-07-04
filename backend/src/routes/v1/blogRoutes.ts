import { Router } from 'express';
import { blogController } from '../../controllers/blogController';
import { authenticate, optionalAuth } from '../../middleware/auth';

const router = Router();

router.get('/', blogController.getAll);
router.get('/featured', blogController.getFeatured);
router.get('/trending', blogController.getTrending);
router.get('/search', blogController.search);
router.get('/:slug', blogController.getBySlug);

router.post('/', authenticate, blogController.create);
router.put('/:id', authenticate, blogController.update);
router.delete('/:id', authenticate, blogController.delete);

export default router;
