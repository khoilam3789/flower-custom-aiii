import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product.js';

dotenv.config();

const bags = [
  {
    name: "Tim Hồng Pastel",
    category: "bag",
    price: 39000,
    imageUrl: "/images/customtui/source_6.png",
    description: "Hộp hình trái tim màu hồng pastel, dây ngọc trai"
  },
  {
    name: "Tim Xanh Pastel",
    category: "bag",
    price: 39000,
    imageUrl: "/images/customtui/source_2.png",
    description: "Hộp hình trái tim màu xanh mint, dây ngọc trai"
  },
  {
    name: "Tim Vàng Pastel",
    category: "bag",
    price: 39000,
    imageUrl: "/images/customtui/source_5.png",
    description: "Hộp hình trái tim màu vàng pastel, dây ngọc trai"
  },
  {
    name: "Hồng Bi Hoa",
    category: "bag",
    price: 59000,
    imageUrl: "/images/customtui/source_1.png",
    description: "Túi giấy chấm bi hồng, quai thừng trang trí hoa"
  },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB.");

    // Xóa hết túi cũ trước khi seed lại
    await Product.deleteMany({ category: 'bag' });
    console.log("🗑️  Đã xóa túi cũ.");

    for (const b of bags) {
      await Product.create(b);
      console.log(`✅ Created: ${b.name}`);
    }
    console.log("🎉 Hoàn tất nạp dữ liệu data cho TÚI!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Lỗi:", err);
    process.exit(1);
  });
