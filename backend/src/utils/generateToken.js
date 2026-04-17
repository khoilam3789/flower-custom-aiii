import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  // Bỏ đi thời gian hết hạn (expiresIn) theo yêu cầu đơn giản hoá
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_fallback');
};

export default generateToken;
