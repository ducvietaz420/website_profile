// Middleware đơn giản để xác thực admin
// Trong thực tế, nên sử dụng JWT hoặc session-based authentication

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Đường dẫn tới file profile.json
const dataPath = path.join(__dirname, '../../public/data/profile.json');

// Khóa bí mật để ký JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-should-be-in-env';

// Thời gian hết hạn token (15 phút)
const TOKEN_EXPIRY = '15m';

/**
 * Mã hóa mật khẩu
 * @param {string} password Mật khẩu cần mã hóa
 * @returns {string} Mật khẩu đã mã hóa
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * So sánh mật khẩu với mật khẩu đã mã hóa
 * @param {string} password Mật khẩu người dùng nhập
 * @param {string} hashedPassword Mật khẩu đã mã hóa từ database
 * @returns {boolean} true nếu khớp, false nếu không khớp
 */
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Tạo token JWT
 * @param {string} email Email của người dùng
 * @returns {string} Token JWT
 */
const generateToken = (email) => {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
};

/**
 * Xác minh token JWT
 * @param {string} token Token cần xác minh
 * @returns {object|null} Payload của token hoặc null nếu token không hợp lệ
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Middleware xác thực admin qua token (cho các API yêu cầu xác thực)
 */
const authMiddleware = (req, res, next) => {
  // Lấy token từ header Authorization
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Không có token xác thực' });
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
  
  // Lưu thông tin user vào request để sử dụng ở middleware tiếp theo
  req.user = decoded;
  next();
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  authMiddleware
};
