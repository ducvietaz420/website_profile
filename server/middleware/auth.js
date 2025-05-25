// Middleware đơn giản để xác thực admin
// Trong thực tế, nên sử dụng JWT hoặc session-based authentication

const authMiddleware = (req, res, next) => {
  // Kiểm tra token hoặc session ở đây
  // Đây chỉ là ví dụ đơn giản, không nên sử dụng trong môi trường sản xuất
  
  const apiKey = req.headers['x-api-key'];
  
  if (apiKey === 'admin-secret-key') {
    next();
  } else {
    res.status(401).json({ error: 'Không có quyền truy cập' });
  }
};

module.exports = authMiddleware;
