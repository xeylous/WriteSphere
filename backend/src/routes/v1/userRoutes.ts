import { Router } from 'express';
import { userController } from '../../controllers/userController';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/featured', userController.getFeaturedAuthors);
router.get('/:id', userController.getById);
router.get('/:id/blogs', userController.getUserBlogs);
router.put('/me', authenticate, userController.updateProfile);

export default router;
