const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const nodemailer = require('nodemailer');
// Thêm SendGrid
const sgMail = process.env.SENDGRID_API_KEY ? require('@sendgrid/mail') : null;

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
        avatar: "assets/images/default-avatar.jpg",
        adminEmail: "admin@example.com"
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

// API endpoint để gửi email từ form liên hệ
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Kiểm tra dữ liệu
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }
    
    // Đọc file profile.json để lấy email admin
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const adminEmail = data.personal.adminEmail;
    
    if (!adminEmail) {
      return res.status(500).json({ error: 'Chưa cấu hình email admin' });
    }

    // Kiểm tra biến môi trường EMAIL_PROVIDER
    const emailProvider = process.env.EMAIL_PROVIDER || 'gmail';
    
    console.log('Sending email with provider:', emailProvider);
    console.log('Admin email:', adminEmail);
    
    // Nội dung email
    const emailContent = `
      <h3>Thông tin liên hệ mới từ website</h3>
      <p><strong>Tên:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Tiêu đề:</strong> ${subject}</p>
      <p><strong>Nội dung:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;
    
    // Gửi email sử dụng SendGrid nếu được cấu hình
    if (emailProvider === 'sendgrid' && sgMail && process.env.SENDGRID_API_KEY) {
      console.log('Using SendGrid to send email');
      
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      
      const msg = {
        to: adminEmail,
        from: process.env.EMAIL_USER || adminEmail,
        subject: `[Liên hệ từ website] ${subject}`,
        html: emailContent,
        replyTo: email
      };
      
      await sgMail.send(msg);
      console.log('Email sent successfully using SendGrid');
    } 
    // Sử dụng Nodemailer + Gmail
    else {
      console.log('Using Nodemailer with Gmail to send email');
      
      // Kiểm tra biến môi trường EMAIL_USER và EMAIL_PASS
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('EMAIL_USER or EMAIL_PASS environment variables are missing!');
        console.warn('Using fallback: adminEmail and default password');
      }
      
      // Tạo transporter cho nodemailer (sử dụng Gmail)
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || adminEmail,
          pass: process.env.EMAIL_PASS || 'app-password'
        }
      });
      
      // Cấu hình email
      const mailOptions = {
        from: `"Website Contact Form" <${process.env.EMAIL_USER || adminEmail}>`,
        to: adminEmail,
        subject: `[Liên hệ từ website] ${subject}`,
        html: emailContent,
        replyTo: email
      };
      
      // Gửi email
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully using Nodemailer + Gmail');
    }
    
    res.json({ success: true, message: 'Email đã được gửi thành công' });
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    // Thêm thông tin lỗi chi tiết để debug
    const errorDetails = error.response ? 
      `${error.response.body ? JSON.stringify(error.response.body) : error.message}` : 
      error.message;
    
    res.status(500).json({ 
      error: 'Không thể gửi email', 
      details: errorDetails,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
