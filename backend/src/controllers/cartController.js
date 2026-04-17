import Cart from '../models/Cart.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
// Body: { customDetails, totalQuantity, itemPrice }
export const addToCart = async (req, res) => {
  try {
    const { customDetails, totalQuantity, itemPrice } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    const subTotal = totalQuantity * itemPrice;
    cart.items.push({ customDetails, totalQuantity, itemPrice, subTotal });

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    let cart = await Cart.findOne({ userId: req.user._id });

    if (cart) {
      cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
