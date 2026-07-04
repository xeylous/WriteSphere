import { Router } from 'express';
import { aiController } from '../../controllers/aiController';
import { authenticate } from '../../middleware/auth';
import { aiLimiter } from '../../middleware/rateLimiter';

const router = Router();

// Apply authentication and rate limits to all AI endpoints
router.use(authenticate);
router.use(aiLimiter);

router.post('/grammar-fix', aiController.grammarFix);
router.post('/rewrite', aiController.rewrite);
router.post('/expand', aiController.expand);
router.post('/shorten', aiController.shorten);
router.post('/continue', aiController.continue);
router.post('/generate-title', aiController.generateTitle);
router.post('/generate-tags', aiController.generateTags);
router.post('/generate-seo', aiController.generateSEO);
router.post('/generate-intro', aiController.generateIntro);
router.post('/generate-conclusion', aiController.generateConclusion);
router.post('/summarize', aiController.summarize);
router.post('/key-takeaways', aiController.keyTakeaways);

export default router;
