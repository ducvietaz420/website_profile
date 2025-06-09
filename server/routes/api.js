const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Cấu hình multer cho việc upload files
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../../public/assets/images'));
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    // Chỉ cho phép upload hình ảnh
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ cho phép upload file hình ảnh!'), false);
    }
  }
});

// Đường dẫn tới file profile.json
const dataPath = path.join(__dirname, '../../public/data/profile.json');

// Middleware để đảm bảo file profile.json tồn tại
const ensureDataFile = (req, res, next) => {
  if (!fs.existsSync(dataPath)) {
    const initialData = {
      personal: {
        name: "Tên của bạn",
        title: "Chức danh",
        bio: "Mô tả ngắn",
        avatar: "assets/images/default-avatar.jpg"
      },
      skills: [
        { name: "JavaScript", level: 90 },
        { name: "HTML/CSS", level: 85 }
      ],
      experience: [],
      portfolio: [],
      events: []
    };
    
    fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2), 'utf8');
  }
  next();
};

router.use(ensureDataFile);

// Lấy tất cả dữ liệu profile
router.get('/profile', (req, res) => {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Không thể đọc dữ liệu profile' });
  }
});

// Cập nhật thông tin cá nhân
router.put('/profile/personal', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    data.personal = { ...data.personal, ...req.body };
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    res.json(data.personal);
  } catch (error) {
    res.status(500).json({ error: 'Không thể cập nhật thông tin cá nhân' });
  }
});

// Quản lý kỹ năng
router.put('/profile/skills', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    data.skills = req.body;
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    res.json(data.skills);
  } catch (error) {
    res.status(500).json({ error: 'Không thể cập nhật kỹ năng' });
  }
});

// Quản lý kinh nghiệm
router.put('/profile/experience', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    data.experience = req.body;
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    res.json(data.experience);
  } catch (error) {
    res.status(500).json({ error: 'Không thể cập nhật kinh nghiệm' });
  }
});

// Quản lý portfolio
router.put('/profile/portfolio', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    data.portfolio = req.body;
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    res.json(data.portfolio);
  } catch (error) {
    res.status(500).json({ error: 'Không thể cập nhật portfolio' });
  }
});

// Quản lý sự kiện
router.put('/profile/events', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    data.events = req.body;
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    res.json(data.events);
  } catch (error) {
    res.status(500).json({ error: 'Không thể cập nhật sự kiện' });
  }
});

// Upload hình ảnh
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file được upload' });
    }
    
    // Trả về đường dẫn tương đối tới file đã upload
    const relativePath = `assets/images/${req.file.filename}`;
    res.json({ path: relativePath });
  } catch (error) {
    res.status(500).json({ error: 'Không thể upload file' });
  }
});

// Xác thực admin đơn giản (chỉ là ví dụ, trong thực tế nên sử dụng phương pháp bảo mật hơn)
router.post('/auth', (req, res) => {
  const { password } = req.body;
  
  // Mật khẩu mặc định, trong thực tế nên được lưu trữ an toàn hơn
  if (password === 'admin123') {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Mật khẩu không đúng' });
  }
});

module.exports = router;
