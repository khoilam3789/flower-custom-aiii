import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./src/models/Product.js";

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB for cards seeding"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const cards = [
  {
    name: "Thiệp Hoa Trắng",
    description: "Hoa tuyết trang nhã",
    price: 30000,
    imageUrl: "/images/customizethiep/source_Untitled design (7).png",
    category: "card",
    stock: 100
  },
  {
    name: "Thiệp Cổ Điển",
    description: "Nhẹ nhàng tinh tế",
    price: 35000,
    imageUrl: "/images/customizethiep/source_Untitled design (5).png",
    category: "card",
    stock: 100
  },
  {
    name: "Thiệp Trái Tim",
    description: "Chứa đựng yêu thương",
    price: 25000,
    imageUrl: "/images/customizethiep/source_Untitled design (6).png",
    category: "card",
    stock: 100
  }
];

const seedCards = async () => {
  try {
    await Product.deleteMany({ category: "card" });
    console.log("Deleted old cards");

    await Product.insertMany(cards);
    console.log("Successfully seeded", cards.length, "cards");

    process.exit();
  } catch (err) {
    console.error("Error seeding cards:", err);
    process.exit(1);
  }
};

seedCards();
