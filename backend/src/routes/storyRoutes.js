import express from 'express';
import {
  createStory,
  deleteStory,
  getAdminStories,
  getStories,
  getStoryBySlug,
  updateStory
} from '../controllers/storyController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getStories);
router.get('/admin/all', protect, admin, getAdminStories);
router.get('/:slug', getStoryBySlug);

router.post('/', protect, admin, createStory);
router.put('/:id', protect, admin, updateStory);
router.delete('/:id', protect, admin, deleteStory);

export default router;
