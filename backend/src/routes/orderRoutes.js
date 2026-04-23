import express from 'express';
import { checkoutCart, getUserOrders, getAllOrders, updateOrderStatus, cancelOrder, deleteOrder, cleanupLegacyBase64Data, getDatabaseStats } from '../controllers/orderController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/checkout', protect, checkoutCart);

// User routes
router.get('/my-orders', protect, getUserOrders);
router.put('/:id/cancel', protect, cancelOrder);

// Admin routes
router.get('/all', protect, admin, getAllOrders);
router.post('/admin/cleanup-base64', protect, admin, cleanupLegacyBase64Data);
router.get('/admin/db-stats', protect, admin, getDatabaseStats);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.delete('/:id', protect, admin, deleteOrder);

export default router;
