/**
 * Admin JS - Xử lý các chức năng quản trị cho trang web profile
 */

// Đợi trang web load xong
document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo trang admin
    initAdminPage();
});

/**
 * Khởi tạo trang admin
 */
function initAdminPage() {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    checkLoginStatus();
    
    // Khởi tạo các event listeners
    initEventListeners();
    
    // Khởi tạo các form quản lý
    initForms();
}

/**
 * Kiểm tra trạng thái đăng nhập
 */
function checkLoginStatus() {
    // Kiểm tra xem có token đăng nhập trong localStorage không
    const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
    
    if (isLoggedIn) {
        // Nếu đã đăng nhập, hiển thị dashboard và tải dữ liệu
        showDashboard();
        loadProfileData();
    } else {
        // Nếu chưa đăng nhập, hiển thị form đăng nhập
        showLoginForm();
    }
}

/**
 * Hiển thị form đăng nhập
 */
function showLoginForm() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-dashboard').style.display = 'none';
    
    // Khởi tạo form đăng nhập
    const loginForm = document.getElementById('login-form');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Lưu trạng thái đăng nhập vào localStorage
                localStorage.setItem('admin_logged_in', 'true');
                
                // Hiển thị dashboard và tải dữ liệu
                showDashboard();
                loadProfileData();
            } else {
                // Hiển thị thông báo lỗi
                document.getElementById('login-error').textContent = 'Mật khẩu không đúng';
            }
        } catch (error) {
            console.error('Login error:', error);
            document.getElementById('login-error').textContent = 'Đã xảy ra lỗi khi đăng nhập';
        }
    });
}

/**
 * Hiển thị dashboard
 */
function showDashboard() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    
    // Hiển thị section đầu tiên
    showSection('personal');
}

/**
 * Tải dữ liệu profile và điền vào các form
 */
function loadProfileData() {
    // Sử dụng DataManager để tải dữ liệu
    window.dataManager.loadData()
        .then(data => {
            // Điền dữ liệu vào các form
            fillPersonalForm(data.personal);
            fillSkillsList(data.skills);
            fillExperienceList(data.experience);
            fillEventsList(data.events);
        })
        .catch(error => {
            console.error('Error loading profile data:', error);
            showNotification('error', 'Không thể tải dữ liệu profile');
        });
}

/**
 * Điền dữ liệu vào form thông tin cá nhân
 * @param {Object} personal Dữ liệu thông tin cá nhân
 */
function fillPersonalForm(personal) {
    // Điền các trường dữ liệu
    document.getElementById('name').value = personal.name || '';
    document.getElementById('title').value = personal.title || '';
    document.getElementById('bio').value = personal.bio || '';
    document.getElementById('about').value = personal.about || '';
    document.getElementById('birthday').value = personal.birthday || '';
    document.getElementById('location').value = personal.location || '';
    document.getElementById('email').value = personal.email || '';
    document.getElementById('phone').value = personal.phone || '';
    document.getElementById('address').value = personal.address || '';
    document.getElementById('facebook').value = personal.facebook || '';
    document.getElementById('twitter').value = personal.twitter || '';
    document.getElementById('instagram').value = personal.instagram || '';
    document.getElementById('linkedin').value = personal.linkedin || '';
    document.getElementById('github').value = personal.github || '';
    
    // Điền ảnh avatar
    if (personal.avatar) {
        document.getElementById('avatar').value = personal.avatar;
        document.getElementById('avatar-preview').src = personal.avatar;
    }
    
    // Điền ảnh giới thiệu
    if (personal.aboutImage) {
        document.getElementById('about-image').value = personal.aboutImage;
        document.getElementById('about-image-preview').src = personal.aboutImage;
    }
}

/**
 * Điền danh sách kỹ năng
 * @param {Array} skills Danh sách kỹ năng
 */
function fillSkillsList(skills) {
    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = '';
    
    if (skills.length === 0) {
        skillsList.innerHTML = '<div class="empty-message">Chưa có kỹ năng nào. Hãy thêm kỹ năng mới!</div>';
        return;
    }
    
    skills.forEach((skill, index) => {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        skillItem.innerHTML = `
            <div class="skill-info">
                <span class="skill-name">${skill.name}</span>
                <span class="skill-level">${skill.level}%</span>
            </div>
            <div class="skill-actions">
                <button type="button" class="edit-btn" data-index="${index}" title="Chỉnh sửa">
                    <i class="fa-solid fa-edit"></i>
                </button>
                <button type="button" class="delete-btn" data-index="${index}" title="Xóa">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        
        skillsList.appendChild(skillItem);
    });
    
    // Khởi tạo sự kiện cho các nút chỉnh sửa và xóa
    initSkillItemEvents();
}

/**
 * Điền danh sách kinh nghiệm
 * @param {Array} experiences Danh sách kinh nghiệm
 */
function fillExperienceList(experiences) {
    const experienceList = document.getElementById('experience-list');
    experienceList.innerHTML = '';
    
    experiences.forEach((exp, index) => {
        const expItem = document.createElement('div');
        expItem.className = 'experience-item';
        
        const dateText = exp.endDate ? `${exp.startDate} - ${exp.endDate}` : `${exp.startDate} - Hiện tại`;
        
        expItem.innerHTML = `
            <div class="experience-header">
                <h3 class="experience-title">${exp.title}</h3>
                <div class="experience-actions">
                    <button type="button" class="edit-btn" data-index="${index}">
                        <i class="fa-solid fa-edit"></i>
                    </button>
                    <button type="button" class="delete-btn" data-index="${index}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="experience-company">${exp.company}</div>
            <div class="experience-date">${dateText}</div>
            <p class="experience-description">${exp.description}</p>
        `;
        
        experienceList.appendChild(expItem);
    });
    
    // Khởi tạo sự kiện cho các nút chỉnh sửa và xóa
    initExperienceItemEvents();
}

// fillEventsList function is now in admin_events.js

/**
 * Khởi tạo các event listeners
 */
function initEventListeners() {
    // Sự kiện đăng xuất
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Xóa trạng thái đăng nhập
            localStorage.removeItem('admin_logged_in');
            
            // Hiển thị form đăng nhập
            showLoginForm();
        });
    }
    
    // Sự kiện chuyển tab
    const navLinks = document.querySelectorAll('.admin-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Lấy section cần hiển thị
            const section = link.getAttribute('data-section');
            
            // Hiển thị section
            showSection(section);
        });
    });
    
    // Sự kiện refresh preview
    const refreshPreviewBtn = document.getElementById('refresh-preview');
    if (refreshPreviewBtn) {
        refreshPreviewBtn.addEventListener('click', () => {
            const iframe = document.getElementById('preview-iframe');
            if (iframe) {
                iframe.src = iframe.src;
            }
        });
    }
}

/**
 * Hiển thị section và ẩn các section khác
 * @param {String} sectionId ID của section cần hiển thị
 */
function showSection(sectionId) {
    // Xóa class active khỏi tất cả các link
    document.querySelectorAll('.admin-nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Thêm class active cho link được chọn
    const activeLink = document.querySelector(`.admin-nav a[data-section="${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Ẩn tất cả các section
    document.querySelectorAll('.admin-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Hiển thị section được chọn
    const activeSection = document.getElementById(`${sectionId}-section`);
    if (activeSection) {
        activeSection.style.display = 'block';
    }
}

/**
 * Khởi tạo các form quản lý
 */
function initForms() {
    // Khởi tạo form thông tin cá nhân
    initPersonalForm();
    
    // Khởi tạo form kỹ năng
    initSkillForm();
    
    // Khởi tạo form kinh nghiệm
    initExperienceForm();
    
    // Khởi tạo form portfolio
    initPortfolioForm();
    
    // Khởi tạo sự kiện upload ảnh
    initImageUpload();
}

/**
 * Khởi tạo form thông tin cá nhân
 */
function initPersonalForm() {
    const personalForm = document.getElementById('personal-form');
    
    if (personalForm) {
        personalForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Lấy dữ liệu từ form
            const formData = {
                name: document.getElementById('name').value,
                title: document.getElementById('title').value,
                bio: document.getElementById('bio').value,
                about: document.getElementById('about').value,
                birthday: document.getElementById('birthday').value,
                location: document.getElementById('location').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                facebook: document.getElementById('facebook').value,
                twitter: document.getElementById('twitter').value,
                instagram: document.getElementById('instagram').value,
                linkedin: document.getElementById('linkedin').value,
                github: document.getElementById('github').value,
                avatar: document.getElementById('avatar').value,
                aboutImage: document.getElementById('about-image').value
            };
            
            try {
                // Cập nhật dữ liệu
                await window.dataManager.updateData('personal', formData);
                
                // Hiển thị thông báo thành công
                showNotification('success', 'Đã lưu thông tin cá nhân');
            } catch (error) {
                console.error('Error updating personal info:', error);
                showNotification('error', 'Không thể lưu thông tin cá nhân');
            }
        });
    }
}

/**
 * Khởi tạo form kỹ năng
 */
function initSkillForm() {
    const addSkillBtn = document.getElementById('add-skill');
    const skillForm = document.getElementById('skill-form');
    const cancelSkillBtn = document.getElementById('cancel-skill');
    const saveSkillsBtn = document.getElementById('save-skills');
    const skillRange = document.getElementById('skill-range');
    const skillValue = document.getElementById('skill-value');
    
    // Sự kiện khi thay đổi range slider
    if (skillRange && skillValue) {
        skillRange.addEventListener('input', () => {
            const value = skillRange.value;
            skillValue.textContent = `${value}%`;
            document.getElementById('skill-level').value = value;
        });
        
        document.getElementById('skill-level').addEventListener('input', () => {
            const value = document.getElementById('skill-level').value;
            skillRange.value = value;
            skillValue.textContent = `${value}%`;
        });
    }
    
    // Sự kiện khi click nút "Thêm kỹ năng"
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', () => {
            // Reset form
            document.getElementById('skill-form').reset();
            document.getElementById('skill-index').value = -1;
            document.getElementById('skill-range').value = 0;
            document.getElementById('skill-value').textContent = '0%';
            
            // Hiển thị form
            document.getElementById('skill-form-container').style.display = 'block';
        });
    }
    
    // Sự kiện khi click nút "Huỷ"
    if (cancelSkillBtn) {
        cancelSkillBtn.addEventListener('click', () => {
            document.getElementById('skill-form-container').style.display = 'none';
        });
    }
    
    // Sự kiện khi submit form kỹ năng
    if (skillForm) {
        skillForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Lấy dữ liệu từ form
            const name = document.getElementById('skill-name').value;
            const level = parseInt(document.getElementById('skill-level').value);
            const index = parseInt(document.getElementById('skill-index').value);
            
            // Lấy danh sách kỹ năng hiện tại
            const skills = window.dataManager.getData().skills || [];
            
            if (index === -1) {
                // Thêm kỹ năng mới
                skills.push({ name, level });
            } else {
                // Cập nhật kỹ năng đã có
                skills[index] = { name, level };
            }
            
            // Cập nhật UI
            fillSkillsList(skills);
            
            // Ẩn form
            document.getElementById('skill-form-container').style.display = 'none';
        });
    }
    
    // Sự kiện khi click nút "Lưu tất cả kỹ năng"
    if (saveSkillsBtn) {
        saveSkillsBtn.addEventListener('click', async () => {
            try {
                // Lấy danh sách kỹ năng hiện tại
                const skills = window.dataManager.getData().skills || [];
                
                // Cập nhật dữ liệu
                await window.dataManager.updateData('skills', skills);
                
                // Hiển thị thông báo thành công
                showNotification('success', 'Đã lưu danh sách kỹ năng');
            } catch (error) {
                console.error('Error updating skills:', error);
                showNotification('error', 'Không thể lưu danh sách kỹ năng');
            }
        });
    }
}

/**
 * Khởi tạo sự kiện cho các item kỹ năng
 */
function initSkillItemEvents() {
    // Sự kiện khi click nút "Chỉnh sửa"
    const editButtons = document.querySelectorAll('#skills-list .edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'));
            const skills = window.dataManager.getData().skills || [];
            const skill = skills[index];
            
            // Điền dữ liệu vào form
            document.getElementById('skill-name').value = skill.name;
            document.getElementById('skill-level').value = skill.level;
            document.getElementById('skill-range').value = skill.level;
            document.getElementById('skill-value').textContent = `${skill.level}%`;
            document.getElementById('skill-index').value = index;
            
            // Hiển thị form
            document.getElementById('skill-form-container').style.display = 'block';
        });
    });
    
    // Sự kiện khi click nút "Xóa"
    const deleteButtons = document.querySelectorAll('#skills-list .delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (confirm('Bạn có chắc chắn muốn xóa kỹ năng này không?')) {
                const index = parseInt(button.getAttribute('data-index'));
                const skills = window.dataManager.getData().skills || [];
                
                // Xóa kỹ năng
                skills.splice(index, 1);
                
                // Cập nhật UI
                fillSkillsList(skills);
                
                // Hiển thị thông báo
                showNotification('success', 'Đã xóa kỹ năng thành công');
            }
        });
    });
}
