import { Router } from 'express';
import { commentController } from '../../controllers/commentController';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/blogs/:blogId/comments', commentController.getByBlog);
router.post('/blogs/:blogId/comments', authenticate, commentController.create);
router.put('/comments/:id', authenticate, commentController.update);
router.delete('/comments/:id', authenticate, commentController.delete);

export default router;
