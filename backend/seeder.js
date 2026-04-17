import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDb } from './src/config/db.js';
import User from './src/models/User.js';

dotenv.config();

const importData = async () => {
  try {
    await connectDb();

    // Bạn có thể mở comment đoạn xoá tất cả người dùng nếu muốn dọn dẹp trước
    // await User.deleteMany();

    const sampleUsers = [
      {
        name: 'Quản trị viên',
        email: 'admin@flowerbooth.com',
        password: 'admin123',
        role: 'admin',
      },
      {
        name: 'Khách hàng',
        email: 'khach@gmail.com',
        password: 'khach123',
        role: 'customer',
      },
    ];

    // Kiểm tra xem đã có user nào tồn tại với email này chưa, nếu chưa thì tạo
    for (let u of sampleUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create(u);
        console.log(`Đã tạo: ${u.email}`);
      } else {
        console.log(`Đã tồn tại: ${u.email}`);
      }
    }

    console.log('Seed dữ liệu tài khoản thành công!');
    process.exit();
  } catch (error) {
    console.error(`Lỗi: ${error.message}`);
    process.exit(1);
  }
};

importData();
