import express from 'express';
import { generatePreview } from '../controllers/aiController.js';

const router = express.Router();

router.post('/preview', generatePreview);

export default router;
