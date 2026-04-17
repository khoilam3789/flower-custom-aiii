import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product.js';

dotenv.config();

const flowers = [
  {
    name: "Hướng Dương",
    category: "flower",
    price: 19000,
    imageUrl: "/images/CustomizeHoa/huongduong.png",
    description: "Sự trung thành, kiên định và sức sống mãnh liệt"
  },
  {
    name: "Cúc Đồng Tiền / Tulip",
    category: "flower",
    price: 19000,
    imageUrl: "/images/CustomizeHoa/tulip.png",
    description: "Sự khởi đầu mới"
  },
  {
    name: "Linh Lan",
    category: "flower",
    price: 89000,
    imageUrl: "/images/CustomizeHoa/linhlan.png",
    description: "Sự trở lại của hạnh phúc, may mắn"
  },
  {
    name: "Hoa Hồng Đỏ",
    category: "flower",
    price: 29000,
    imageUrl: "/images/CustomizeHoa/hoahong.png",
    description: "Tình yêu mãnh liệt, xinh đẹp và sắc sảo"
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB.");
    for (const f of flowers) {
      const existing = await Product.findOne({ name: f.name });
      if (!existing) {
        await Product.create(f);
        console.log(`✅ Created: ${f.name}`);
      } else {
        await Product.updateOne({ _id: existing._id }, f);
        console.log(`🔄 Updated: ${f.name}`);
      }
    }
    console.log("🎉 Hoàn tất nạp dữ liệu data cho HOA!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Lỗi:", err);
    process.exit(1);
  });
