/**
 * Reset Password JS - Xử lý chức năng đặt lại mật khẩu
 */

// Đợi trang web load xong
document.addEventListener('DOMContentLoaded', () => {
    initResetPasswordPage();
});

/**
 * Khởi tạo trang đặt lại mật khẩu
 */
function initResetPasswordPage() {
    // Lấy token từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (!token) {
        // Hiển thị thông báo lỗi nếu không có token
        showTokenExpiredScreen();
        return;
    }
    
    // Lưu token vào form
    document.getElementById('reset-token').value = token;
    
    // Kiểm tra token
    verifyToken(token);
    
    // Khởi tạo form đặt lại mật khẩu
    initResetPasswordForm();
}

/**
 * Kiểm tra token
 * @param {string} token Token đặt lại mật khẩu
 */
async function verifyToken(token) {
    try {
        // Gửi request kiểm tra token đến API
        const response = await fetch('/api/auth/verifyResetToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Token hợp lệ, hiển thị form đặt lại mật khẩu
            document.getElementById('token-loading').style.display = 'none';
            document.getElementById('reset-password-form-container').style.display = 'block';
        } else {
            // Token không hợp lệ hoặc đã hết hạn
            showTokenExpiredScreen();
        }
    } catch (error) {
        console.error('Token verification error:', error);
        showTokenExpiredScreen();
    }
}

/**
 * Hiển thị màn hình token hết hạn
 */
function showTokenExpiredScreen() {
    document.getElementById('token-loading').style.display = 'none';
    document.getElementById('reset-password-form-container').style.display = 'none';
    document.getElementById('token-expired').style.display = 'block';
}

/**
 * Hiển thị màn hình đặt lại mật khẩu thành công
 */
function showResetSuccessScreen() {
    document.getElementById('reset-password-form-container').style.display = 'none';
    document.getElementById('reset-success').style.display = 'block';
    
    // Tự động chuyển hướng sau 3 giây
    setTimeout(() => {
        window.location.href = '/admin.html';
    }, 3000);
}

/**
 * Hiển thị thông báo
 * @param {string} message Nội dung thông báo
 * @param {boolean} isSuccess True nếu là thông báo thành công, false nếu là thông báo lỗi
 */
function showMessage(message, isSuccess = false) {
    const messageElement = document.getElementById('reset-message');
    messageElement.textContent = message;
    messageElement.className = `message ${isSuccess ? 'success-message' : 'error-message'}`;
    messageElement.style.display = 'block';
}

/**
 * Khởi tạo form đặt lại mật khẩu
 */
function initResetPasswordForm() {
    const resetPasswordForm = document.getElementById('reset-password-form');
    
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Lấy dữ liệu từ form
            const token = document.getElementById('reset-token').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Reset thông báo
            const messageElement = document.getElementById('reset-message');
            messageElement.textContent = '';
            messageElement.className = 'message';
            messageElement.style.display = 'none';
            
            // Kiểm tra mật khẩu mới và xác nhận mật khẩu
            if (newPassword !== confirmPassword) {
                showMessage('Mật khẩu mới và xác nhận mật khẩu không khớp');
                return;
            }
            
            try {
                // Gửi yêu cầu đặt lại mật khẩu
                const response = await fetch('/api/auth/resetPassword', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token, newPassword })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Hiển thị màn hình thành công
                    showResetSuccessScreen();
                } else {
                    // Hiển thị thông báo lỗi
                    showMessage(data.error || 'Không thể đặt lại mật khẩu');
                    
                    if (data.error === 'Token không hợp lệ' || data.error === 'Token đã hết hạn') {
                        // Nếu token không hợp lệ hoặc hết hạn, chuyển sang màn hình token hết hạn
                        setTimeout(() => {
                            showTokenExpiredScreen();
                        }, 2000);
                    }
                }
            } catch (error) {
                console.error('Reset password error:', error);
                showMessage('Đã xảy ra lỗi khi đặt lại mật khẩu');
            }
        });
    }
} 