import mongoose from "mongoose";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import { Generation } from "../models/Generation.js";

const defaultUsers = [
  {
    name: "Quan tri vien",
    email: "admin@flowerbooth.com",
    password: "admin123",
    role: "admin"
  },
  {
    name: "Khach hang",
    email: "khach@gmail.com",
    password: "khach123",
    role: "customer"
  }
];

const defaultProducts = [
  {
    name: "Huong Duong",
    category: "flower",
    price: 19000,
    imageUrl: "/images/CustomizeHoa/huongduong.png",
    description: "Su trung thanh, kien dinh va suc song manh liet"
  },
  {
    name: "Cuc Dong Tien / Tulip",
    category: "flower",
    price: 19000,
    imageUrl: "/images/CustomizeHoa/tulip.png",
    description: "Su khoi dau moi"
  },
  {
    name: "Linh Lan",
    category: "flower",
    price: 89000,
    imageUrl: "/images/CustomizeHoa/linhlan.png",
    description: "Su tro lai cua hanh phuc, may man"
  },
  {
    name: "Hoa Hong Do",
    category: "flower",
    price: 29000,
    imageUrl: "/images/CustomizeHoa/hoahong.png",
    description: "Tinh yeu manh liet, xinh dep va sac sao"
  },
  {
    name: "La Nang",
    category: "leaf",
    price: 15000,
    imageUrl: "/images/Customizela/lanang.png",
    description: "La mem mai, tuoi sang, tao diem nhan diu dang"
  },
  {
    name: "Hoa Sao",
    category: "leaf",
    price: 12000,
    imageUrl: "/images/Customizela/hoasao.png",
    description: "Nu hoa nho xinh, bung toa nhe nhang"
  },
  {
    name: "Tung Thien Mon Dong",
    category: "leaf",
    price: 18000,
    imageUrl: "/images/Customizela/tungthienmondong.png",
    description: "La xanh muot, thanh thoat va sang trong"
  },
  {
    name: "Duong Xi",
    category: "leaf",
    price: 10000,
    imageUrl: "/images/Customizela/duongxi.png",
    description: "La xanh mat, tu nhien va tuoi moi"
  },
  {
    name: "Tim Hong Pastel",
    category: "bag",
    price: 39000,
    imageUrl: "/images/customtui/source_6.png",
    description: "Hop hinh trai tim mau hong pastel, day ngoc trai"
  },
  {
    name: "Tim Xanh Pastel",
    category: "bag",
    price: 39000,
    imageUrl: "/images/customtui/source_2.png",
    description: "Hop hinh trai tim mau xanh mint, day ngoc trai"
  },
  {
    name: "Tim Vang Pastel",
    category: "bag",
    price: 39000,
    imageUrl: "/images/customtui/source_5.png",
    description: "Hop hinh trai tim mau vang pastel, day ngoc trai"
  },
  {
    name: "Hong Bi Hoa",
    category: "bag",
    price: 59000,
    imageUrl: "/images/customtui/source_1.png",
    description: "Tui giay cham bi hong, quai thung trang tri hoa"
  },
  {
    name: "Thiep Hoa Trang",
    category: "card",
    price: 30000,
    imageUrl: "/images/customizethiep/source_Untitled design (7).png",
    description: "Hoa tuyet trang nha"
  },
  {
    name: "Thiep Co Dien",
    category: "card",
    price: 35000,
    imageUrl: "/images/customizethiep/source_Untitled design (5).png",
    description: "Nhe nhang tinh te"
  },
  {
    name: "Thiep Trai Tim",
    category: "card",
    price: 25000,
    imageUrl: "/images/customizethiep/source_Untitled design (6).png",
    description: "Chua dung yeu thuong"
  }
];

const ensureCollections = async () => {
  const models = [User, Product, Cart, Order, Generation];
  for (const model of models) {
    try {
      await model.createCollection();
    } catch (error) {
      if (error?.codeName !== "NamespaceExists") {
        throw error;
      }
    }
  }
};

const seedUsersIfEmpty = async () => {
  const count = await User.estimatedDocumentCount();
  if (count > 0) return;

  for (const user of defaultUsers) {
    await User.create(user);
  }
  console.log("[bootstrap] Seeded default users");
};

const seedProductsIfEmpty = async () => {
  const count = await Product.estimatedDocumentCount();
  if (count > 0) return;

  await Product.insertMany(defaultProducts);
  console.log("[bootstrap] Seeded default products");
};

export const bootstrapDatabase = async () => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error("MongoDB is not connected");
  }

  await ensureCollections();
  await seedUsersIfEmpty();
  await seedProductsIfEmpty();
};
