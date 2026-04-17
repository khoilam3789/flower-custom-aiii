import express from 'express';
import { checkoutCart, getAllOrders, updateOrderStatus, deleteOrder } from '../controllers/orderController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/checkout', protect, checkoutCart);

// Admin routes
router.get('/all', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.delete('/:id', protect, admin, deleteOrder);

export default router;
