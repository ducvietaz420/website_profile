/**
 * Admin Upload - Phần xử lý upload ảnh cho admin
 */

/**
 * Khởi tạo chức năng upload ảnh
 */
function initImageUpload() {
    // Avatar upload
    initImageSelector('avatar', 'select-avatar', 'avatar-upload', 'avatar-preview');
    
    // About image upload
    initImageSelector('about-image', 'select-about-image', 'about-image-upload', 'about-image-preview');
    
    // Portfolio image upload
    initImageSelector('portfolio-image', 'select-portfolio-image', 'portfolio-image-upload', 'portfolio-image-preview');
    
    // Event image upload
    initImageSelector('event-image', 'select-event-image', 'event-image-upload', 'event-image-preview');
}

/**
 * Khởi tạo bộ chọn ảnh
 * @param {String} hiddenInputId ID của input ẩn chứa đường dẫn ảnh
 * @param {String} selectBtnId ID của nút chọn ảnh
 * @param {String} fileInputId ID của input file
 * @param {String} previewImgId ID của thẻ img để preview
 */
function initImageSelector(hiddenInputId, selectBtnId, fileInputId, previewImgId) {
    const hiddenInput = document.getElementById(hiddenInputId);
    const selectBtn = document.getElementById(selectBtnId);
    const fileInput = document.getElementById(fileInputId);
    const previewImg = document.getElementById(previewImgId);
    
    if (!hiddenInput || !selectBtn || !fileInput || !previewImg) return;
    
    // Click vào nút chọn sẽ mở hộp thoại chọn file
    selectBtn.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Khi chọn file, upload lên server và cập nhật preview
    fileInput.addEventListener('change', async () => {
        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            
            // Kiểm tra xem file có phải là hình ảnh không
            if (!file.type.startsWith('image/')) {
                showNotification('error', 'Vui lòng chọn file hình ảnh');
                return;
            }
            
            // Kiểm tra kích thước file (tối đa 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showNotification('error', 'Kích thước file không được vượt quá 5MB');
                return;
            }
            
            try {
                // Hiển thị thông báo đang upload
                showNotification('info', 'Đang tải ảnh lên...');
                
                // Upload file lên server
                const imagePath = await window.dataManager.uploadImage(file);
                
                // Cập nhật đường dẫn và preview
                hiddenInput.value = imagePath;
                previewImg.src = imagePath;
                
                // Hiển thị thông báo thành công
                showNotification('success', 'Tải ảnh lên thành công');
            } catch (error) {
                console.error('Error uploading image:', error);
                showNotification('error', 'Không thể tải ảnh lên');
            }
        }
    });
}

/**
 * Hiển thị thông báo
 * @param {String} type Loại thông báo (success, error, info)
 * @param {String} message Nội dung thông báo
 */
function showNotification(type, message) {
    const notification = document.getElementById('notification');
    const notificationIcon = notification.querySelector('.notification-icon');
    const notificationMessage = notification.querySelector('.notification-message');
    
    // Đặt kiểu và biểu tượng thông báo
    notification.className = 'notification';
    notification.classList.add(type);
    
    // Đặt biểu tượng thông báo
    if (type === 'success') {
        notificationIcon.className = 'notification-icon fa-solid fa-check';
    } else if (type === 'error') {
        notificationIcon.className = 'notification-icon fa-solid fa-times';
    } else if (type === 'info') {
        notificationIcon.className = 'notification-icon fa-solid fa-info';
    }
    
    // Đặt nội dung thông báo
    notificationMessage.textContent = message;
    
    // Hiển thị thông báo
    notification.classList.add('show');
    
    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Add to global scope
window.initImageUpload = initImageUpload;
window.showNotification = showNotification;
