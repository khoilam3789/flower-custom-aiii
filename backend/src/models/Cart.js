import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  customDetails: {
    // Lưu thẳng một object lồng nhau chứa cấu trúc tuỳ chọn của giỏ hàng linh hoạt (hoa, lá, túi, thiệp)
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  totalQuantity: {
    type: Number,
    required: true,
    default: 1,
  },
  itemPrice: {
    type: Number, // Giá của 1 "bó hoa" theo thiết kế này
    required: true,
    default: 0,
  },
  subTotal: {
    type: Number, // itemPrice * totalQuantity
    required: true,
    default: 0,
  }
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
