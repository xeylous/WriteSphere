import { Router } from 'express';
import { uploadController } from '../../controllers/uploadController';
import { uploadMiddleware } from '../../middleware/upload';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/image', authenticate, uploadMiddleware.single('image'), uploadController.uploadImage);

export default router;
