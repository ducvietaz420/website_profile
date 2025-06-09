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
        adminEmail: "admin@example.com",
        adminPassword: "$2a$10$jTN1hhVLVCR1Qr1MKVrZEet8T0JLWOznD0EVjjYsZa.9/W5.X4XUu", // Mật khẩu mặc định: admin123
        resetToken: null,
        resetTokenExpires: null
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

// Xác thực admin sử dụng bcrypt
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Xác thực admin
router.post('/auth', (req, res) => {
  try {
    const { password } = req.body;
    
    // Đọc dữ liệu từ file profile.json
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const storedHashedPassword = data.personal.adminPassword;
    const adminEmail = data.personal.adminEmail;
    
    if (!storedHashedPassword) {
      return res.status(500).json({ error: 'Chưa cấu hình mật khẩu admin' });
    }
    
    // So sánh mật khẩu nhập vào với mật khẩu đã hash
    bcrypt.compare(password, storedHashedPassword, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Lỗi xác thực' });
      }
      
      if (isMatch) {
        // Tạo JWT token nếu xác thực thành công
        const token = jwt.sign({ email: adminEmail }, process.env.JWT_SECRET || 'your-secret-key', {
          expiresIn: '24h' // Token có hiệu lực trong 24 giờ
        });
        
        res.json({ 
          success: true,
          token,
          email: adminEmail
        });
      } else {
        res.status(401).json({ error: 'Mật khẩu không đúng' });
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Đổi mật khẩu admin
router.post('/auth/changePassword', (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin' });
    }
    
    // Đọc dữ liệu từ file profile.json
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const storedHashedPassword = data.personal.adminPassword;
    
    if (!storedHashedPassword) {
      return res.status(500).json({ error: 'Chưa cấu hình mật khẩu admin' });
    }
    
    // Xác thực mật khẩu hiện tại
    bcrypt.compare(currentPassword, storedHashedPassword, async (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Lỗi xác thực' });
      }
      
      if (!isMatch) {
        return res.status(401).json({ error: 'Mật khẩu hiện tại không đúng' });
      }
      
      try {
        // Hash mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Cập nhật mật khẩu mới
        data.personal.adminPassword = hashedPassword;
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
        
        res.json({ success: true, message: 'Đổi mật khẩu thành công' });
      } catch (hashError) {
        console.error('Password hashing error:', hashError);
        res.status(500).json({ error: 'Lỗi khi mã hóa mật khẩu' });
      }
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Quên mật khẩu admin
router.post('/auth/forgotPassword', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Vui lòng nhập email' });
    }
    
    // Đọc dữ liệu từ file profile.json
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const adminEmail = data.personal.adminEmail;
    
    if (!adminEmail) {
      return res.status(500).json({ error: 'Chưa cấu hình email admin' });
    }
    
    // Kiểm tra email nhập vào có phải email admin không
    if (email !== adminEmail) {
      // Không thông báo lỗi cụ thể để tránh leak thông tin
      return res.json({ success: true, message: 'Nếu email tồn tại, hướng dẫn đặt lại mật khẩu sẽ được gửi.' });
    }
    
    // Tạo token đặt lại mật khẩu
    const resetToken = jwt.sign(
      { email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '15m' }
    );
    
    // Lưu token và thời gian hết hạn
    const resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 phút
    
    // Cập nhật thông tin trong profile.json
    data.personal.resetToken = resetToken;
    data.personal.resetTokenExpires = resetTokenExpires;
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    
    // Tạo đường dẫn đặt lại mật khẩu
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password.html?token=${resetToken}`;
    
    // Nội dung email
    const emailContent = `
      <h3>Đặt lại mật khẩu admin</h3>
      <p>Bạn đã yêu cầu đặt lại mật khẩu admin.</p>
      <p>Vui lòng nhấp vào đường dẫn dưới đây để đặt lại mật khẩu:</p>
      <p><a href="${resetUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Đặt lại mật khẩu</a></p>
      <p>Hoặc copy đường dẫn này vào trình duyệt: <br>${resetUrl}</p>
      <p>Đường dẫn này sẽ hết hạn sau 15 phút.</p>
      <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
    `;
    
    // Kiểm tra biến môi trường EMAIL_PROVIDER
    const emailProvider = process.env.EMAIL_PROVIDER || 'gmail';
    
    // Gửi email sử dụng SendGrid nếu được cấu hình
    if (emailProvider === 'sendgrid' && sgMail && process.env.SENDGRID_API_KEY) {
      console.log('Using SendGrid to send password reset email');
      
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      
      const msg = {
        to: adminEmail,
        from: process.env.EMAIL_USER || adminEmail,
        subject: 'Đặt lại mật khẩu admin',
        html: emailContent,
      };
      
      await sgMail.send(msg);
    } 
    // Sử dụng Nodemailer + Gmail
    else {
      console.log('Using Nodemailer with Gmail to send password reset email');
      
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
        from: `"Admin System" <${process.env.EMAIL_USER || adminEmail}>`,
        to: adminEmail,
        subject: 'Đặt lại mật khẩu admin',
        html: emailContent
      };
      
      // Gửi email
      await transporter.sendMail(mailOptions);
    }
    
    res.json({ success: true, message: 'Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Đặt lại mật khẩu admin với token
router.post('/auth/resetPassword', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin' });
    }
    
    // Đọc dữ liệu từ file profile.json
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Kiểm tra token có hợp lệ không
    if (data.personal.resetToken !== token) {
      return res.status(400).json({ error: 'Token không hợp lệ' });
    }
    
    // Kiểm tra token còn hiệu lực không
    if (Date.now() > data.personal.resetTokenExpires) {
      return res.status(400).json({ error: 'Token đã hết hạn' });
    }
    
    try {
      // Xác thực token
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Hash mật khẩu mới
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      // Cập nhật mật khẩu mới
      data.personal.adminPassword = hashedPassword;
      
      // Xóa token đặt lại mật khẩu
      data.personal.resetToken = null;
      data.personal.resetTokenExpires = null;
      
      // Lưu lại file profile.json
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
      
      res.json({ success: true, message: 'Đặt lại mật khẩu thành công' });
    } catch (tokenError) {
      console.error('Token verification error:', tokenError);
      res.status(400).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
    }
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Xác thực token đặt lại mật khẩu
router.post('/auth/verifyResetToken', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Vui lòng cung cấp token' });
    }
    
    // Đọc dữ liệu từ file profile.json
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Kiểm tra token có hợp lệ không
    if (data.personal.resetToken !== token) {
      return res.status(400).json({ error: 'Token không hợp lệ', success: false });
    }
    
    // Kiểm tra token còn hiệu lực không
    if (Date.now() > data.personal.resetTokenExpires) {
      return res.status(400).json({ error: 'Token đã hết hạn', success: false });
    }
    
    // Xác thực JWT token
    try {
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      res.json({ success: true, message: 'Token hợp lệ' });
    } catch (tokenError) {
      console.error('Token verification error:', tokenError);
      res.status(400).json({ error: 'Token không hợp lệ hoặc đã hết hạn', success: false });
    }
  } catch (error) {
    console.error('Verify reset token error:', error);
    res.status(500).json({ error: 'Lỗi server', success: false });
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
