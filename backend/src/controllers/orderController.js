import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import { sanitizeCustomDetails, sanitizeCustomDetailsWithStats } from '../utils/sanitizeCustomDetails.js';

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

    const normalizedItems = cart.items.map((item) => ({
      customDetails: sanitizeCustomDetails(item.customDetails),
      totalQuantity: item.totalQuantity,
      itemPrice: item.itemPrice,
      subTotal: item.subTotal
    }));

    const newOrder = await Order.create({
      userId: req.user._id,
      items: normalizedItems,
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

// @desc    Get user's own orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('userId', 'id name email')
      .sort({ createdAt: -1 });
    res.json(orders);
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

// @desc    Cancel order (User can cancel their own order)
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    // Check if user owns this order
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Không có quyền hủy đơn hàng này' });
    }

    // Only allow cancellation for "Đang xử lý" status
    if (order.status !== 'Đang xử lý') {
      return res.status(400).json({ 
        message: 'Chỉ có thể hủy đơn hàng ở trạng thái "Đang xử lý"' 
      });
    }

    order.status = 'Đã hủy';
    const updatedOrder = await order.save();
    
    res.json({ message: 'Đơn hàng đã được hủy', order: updatedOrder });
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

// @desc    Admin cleanup old Base64 blobs in Cart + Order customDetails
// @route   POST /api/orders/admin/cleanup-base64
// @access  Private/Admin
export const cleanupLegacyBase64Data = async (_req, res) => {
  try {
    const [carts, orders] = await Promise.all([
      Cart.find({}, { items: 1 }),
      Order.find({}, { items: 1 })
    ]);

    let cartsUpdated = 0;
    let ordersUpdated = 0;
    let cleanedFields = 0;
    let cartItemsScanned = 0;
    let orderItemsScanned = 0;
    let cartItemsWithCustomDetails = 0;
    let orderItemsWithCustomDetails = 0;
    const reasonTotals = {
      dataImage: 0,
      genericDataBase64: 0,
      rawBase64Blob: 0,
      legacyImageKeyLargeValue: 0
    };

    for (const cart of carts) {
      let changed = false;
      const nextItems = (cart.items || []).map((item) => {
        cartItemsScanned += 1;
        if (item.customDetails && typeof item.customDetails === 'object') {
          cartItemsWithCustomDetails += 1;
        }

        const { sanitized, cleanedFields: itemCleaned, reasonStats } = sanitizeCustomDetailsWithStats(item.customDetails);
        if (itemCleaned > 0) {
          changed = true;
          cleanedFields += itemCleaned;
        }

        reasonTotals.dataImage += reasonStats.dataImage;
        reasonTotals.genericDataBase64 += reasonStats.genericDataBase64;
        reasonTotals.rawBase64Blob += reasonStats.rawBase64Blob;
        reasonTotals.legacyImageKeyLargeValue += reasonStats.legacyImageKeyLargeValue;

        return {
          customDetails: sanitized,
          totalQuantity: item.totalQuantity,
          itemPrice: item.itemPrice,
          subTotal: item.subTotal
        };
      });

      if (changed) {
        cart.items = nextItems;
        await cart.save();
        cartsUpdated += 1;
      }
    }

    for (const order of orders) {
      let changed = false;
      const nextItems = (order.items || []).map((item) => {
        orderItemsScanned += 1;
        if (item.customDetails && typeof item.customDetails === 'object') {
          orderItemsWithCustomDetails += 1;
        }

        const { sanitized, cleanedFields: itemCleaned, reasonStats } = sanitizeCustomDetailsWithStats(item.customDetails);
        if (itemCleaned > 0) {
          changed = true;
          cleanedFields += itemCleaned;
        }

        reasonTotals.dataImage += reasonStats.dataImage;
        reasonTotals.genericDataBase64 += reasonStats.genericDataBase64;
        reasonTotals.rawBase64Blob += reasonStats.rawBase64Blob;
        reasonTotals.legacyImageKeyLargeValue += reasonStats.legacyImageKeyLargeValue;

        return {
          customDetails: sanitized,
          totalQuantity: item.totalQuantity,
          itemPrice: item.itemPrice,
          subTotal: item.subTotal
        };
      });

      if (changed) {
        order.items = nextItems;
        await order.save();
        ordersUpdated += 1;
      }
    }

    res.json({
      message: 'Da cleanup Base64 cu trong Cart va Order',
      cartsScanned: carts.length,
      ordersScanned: orders.length,
      cartsUpdated,
      ordersUpdated,
      cleanedFields,
      debug: {
        cartItemsScanned,
        orderItemsScanned,
        cartItemsWithCustomDetails,
        orderItemsWithCustomDetails,
        reasonTotals
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
