import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product.js';

dotenv.config();

const leaves = [
  {
    name: "Lá Nắng",
    category: "leaf",
    price: 15000,
    imageUrl: "/images/Customizela/lanang.png",
    description: "Lá mềm mại, tươi sáng, tạo điểm nhấn dịu dàng"
  },
  {
    name: "Hoa Sao",
    category: "leaf",
    price: 12000,
    imageUrl: "/images/Customizela/hoasao.png",
    description: "Nụ hoa nhỏ xinh, bung tỏa nhẹ nhàng"
  },
  {
    name: "Tùng Thiên Môn Đông",
    category: "leaf",
    price: 18000,
    imageUrl: "/images/Customizela/tungthienmondong.png",
    description: "Lá xanh mướt, thanh thoát và sang trọng"
  },
  {
    name: "Dương Xỉ",
    category: "leaf",
    price: 10000,
    imageUrl: "/images/Customizela/duongxi.png",
    description: "Lá xanh mát, tự nhiên và tươi mới"
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB.");
    for (const l of leaves) {
      const existing = await Product.findOne({ name: l.name });
      if (!existing) {
        await Product.create(l);
        console.log(`✅ Created: ${l.name}`);
      } else {
        await Product.updateOne({ _id: existing._id }, l);
        console.log(`🔄 Updated: ${l.name}`);
      }
    }
    console.log("🎉 Hoàn tất nạp dữ liệu data cho LÁ!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Lỗi:", err);
    process.exit(1);
  });
