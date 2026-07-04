import { Router } from 'express';
import { tagController } from '../../controllers/tagController';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/', tagController.getAll);
router.post('/', authenticate, tagController.create);

export default router;
