import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  customDetails: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  totalQuantity: {
    type: Number,
    required: true,
    default: 1,
  },
  itemPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  subTotal: {
    type: Number,
    required: true,
    default: 0,
  }
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    status: {
      type: String,
      enum: ['Đang xử lý', 'Đang giao hàng', 'Hoàn thành', 'Đã hủy'],
      default: 'Đang xử lý',
    },
    shippingFee: {
      type: Number,
      default: 30000,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
