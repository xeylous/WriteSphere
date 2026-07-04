import { Router } from 'express';
import { draftController } from '../../controllers/draftController';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', draftController.getAll);
router.get('/:id', draftController.getById);
router.post('/', draftController.create);
router.put('/:id', draftController.update);
router.delete('/:id', draftController.delete);

export default router;
