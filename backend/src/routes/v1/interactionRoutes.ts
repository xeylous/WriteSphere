import { Router } from 'express';
import { interactionController } from '../../controllers/interactionController';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/blogs/:blogId/like', authenticate, interactionController.toggleLike);
router.post('/blogs/:blogId/bookmark', authenticate, interactionController.toggleBookmark);
router.get('/blogs/:blogId/status', authenticate, interactionController.getInteractionStatus);
router.get('/users/me/bookmarks', authenticate, interactionController.getUserBookmarks);
router.get('/users/me/likes', authenticate, interactionController.getUserLikes);

export default router;
