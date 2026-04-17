import express from 'express';
import { getCart, addToCart, removeFromCart } from '../controllers/cartController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); // Yêu cầu đăng nhập cho mọi thao tác với giỏ hàng bảo mật

router.route('/').get(getCart);
router.route('/add').post(addToCart);
router.route('/:itemId').delete(removeFromCart);

export default router;
