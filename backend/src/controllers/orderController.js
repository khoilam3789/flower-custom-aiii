import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

// @desc    Checkout and create Order from Cart
// @route   POST /api/orders/checkout
// @access  Private
export const checkoutCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng đang trống' });
    }

    const subTotal = cart.items.reduce((acc, item) => acc + item.subTotal, 0);
    const shippingFee = 30000;
    const totalPrice = subTotal + shippingFee;

    const newOrder = await Order.create({
      userId: req.user._id,
      items: cart.items,
      shippingFee,
      totalPrice,
      status: 'Đang xử lý',
    });

    // Clear cart after successful checkout
    cart.items = [];
    await cart.save();

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/all
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('userId', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    order.status = status;
    const updatedOrder = await order.save();
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete order (Admin)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      await order.deleteOne();
      res.json({ message: 'Xóa đơn hàng thành công' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
