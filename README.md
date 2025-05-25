# Website Profile Cá Nhân

Website giới thiệu profile cá nhân với giao diện hiện đại, nhiều hiệu ứng 3D và trang quản trị.

## Tổng quan

Đây là một website profile cá nhân đơn trang (single page) với các hiệu ứng animation mượt mà sử dụng GSAP và các hiệu ứng 3D. Website cũng có trang quản trị để dễ dàng cập nhật thông tin.

## Tính năng

### Trang chủ
- Layout responsive, tương thích với mọi thiết bị
- Hiệu ứng animation mượt mà khi cuộn trang
- Hiệu ứng particle và 3D cho phần Hero
- Các section: Giới thiệu, Kỹ năng, Kinh nghiệm, Dự án, Liên hệ
- Bộ lọc portfolio theo danh mục
- Modal chi tiết dự án
- Form liên hệ

### Trang Admin
- Đăng nhập bảo mật
- Quản lý thông tin cá nhân
- Quản lý danh sách kỹ năng
- Quản lý kinh nghiệm làm việc
- Quản lý các dự án
- Upload hình ảnh
- Xem trước trang web

## Công nghệ sử dụng

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- GSAP (GreenSock Animation Platform) cho animation
- Kết hợp CSS 3D Transform và Three.js cho hiệu ứng 3D
- CSS Grid và Flexbox cho layout

### Backend
- Node.js với Express.js
- Multer cho upload file
- Lưu trữ dữ liệu dạng JSON

## Cấu trúc thư mục

```
profile-website/
├── public/                # Các file static
│   ├── index.html         # Trang chủ
│   ├── admin.html         # Trang quản trị
│   ├── css/               # Style sheets
│   │   ├── main.css       # CSS cho trang chủ
│   │   ├── admin.css      # CSS cho trang admin
│   │   └── animations.css # CSS cho các animation
│   ├── js/                # JavaScript files
│   │   ├── main.js        # JS cho trang chủ
│   │   ├── animations.js  # JS cho các animation
│   │   ├── data-manager.js # Quản lý dữ liệu
│   │   ├── admin.js       # JS cho trang admin
│   │   ├── admin_experience.js # JS quản lý kinh nghiệm
│   │   ├── admin_portfolio.js  # JS quản lý portfolio
│   │   └── admin_upload.js     # JS xử lý upload ảnh
│   ├── assets/            # Tài nguyên (hình ảnh, icons, 3D models)
│   │   ├── images/        # Hình ảnh
│   │   ├── icons/         # Icons
│   │   └── 3d-models/     # 3D models
│   └── data/              # Dữ liệu
│       └── profile.json   # Dữ liệu profile
├── server/                # Backend
│   ├── server.js          # Server chính
│   ├── routes/            # API routes
│   │   └── api.js         # API endpoints
│   └── middleware/        # Middleware
│       └── auth.js        # Xác thực
└── package.json           # Cấu hình npm và dependencies
```

## Cài đặt và chạy dự án

1. Clone repository

```bash
git clone https://github.com/your-username/profile-website.git
cd profile-website
```

2. Cài đặt các dependencies

```bash
npm install
```

3. Chạy server trong môi trường phát triển

```bash
npm run dev
```

4. Truy cập website

- Trang chủ: http://localhost:3000
- Trang admin: http://localhost:3000/admin

## Đăng nhập trang Admin

- URL: http://localhost:3000/admin
- Mật khẩu mặc định: admin123

## Triển khai (Deployment)

Để triển khai website lên môi trường sản xuất:

1. Xây dựng phiên bản sản xuất

```bash
npm run build # (nếu có)
```

2. Khởi động server

```bash
npm start
```

## Bảo mật

- Đảm bảo thay đổi mật khẩu mặc định của trang admin trong file `server/routes/api.js`
- Sử dụng HTTPS khi triển khai lên môi trường sản xuất
- Giới hạn kích thước và loại file khi upload

## Tùy chỉnh

- Màu sắc: Thay đổi các biến CSS trong file `public/css/main.css` và `public/css/admin.css`
- Logo: Thay thế trong thẻ logo trong file HTML
- Thông tin: Cập nhật thông qua trang admin

## License

Dự án được phát hành theo giấy phép MIT.
