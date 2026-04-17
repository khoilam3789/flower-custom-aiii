import express from 'express';
import { generatePreview, getAiSettings, updateAiSettings } from '../controllers/aiController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/preview', generatePreview);
router.get('/settings', protect, admin, getAiSettings);
router.put('/settings', protect, admin, updateAiSettings);

export default router;
