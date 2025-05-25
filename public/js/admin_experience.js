/**
 * Admin Experience - Phần quản lý kinh nghiệm cho admin
 */

/**
 * Khởi tạo form kinh nghiệm
 */
function initExperienceForm() {
    const addExperienceBtn = document.getElementById('add-experience');
    const experienceForm = document.getElementById('experience-form');
    const cancelExperienceBtn = document.getElementById('cancel-experience');
    const saveExperiencesBtn = document.getElementById('save-experiences');
    
    // Sự kiện khi click nút "Thêm kinh nghiệm"
    if (addExperienceBtn) {
        addExperienceBtn.addEventListener('click', () => {
            // Reset form
            document.getElementById('experience-form').reset();
            document.getElementById('experience-index').value = -1;
            
            // Hiển thị form
            document.getElementById('experience-form-container').style.display = 'block';
        });
    }
    
    // Sự kiện khi click nút "Huỷ"
    if (cancelExperienceBtn) {
        cancelExperienceBtn.addEventListener('click', () => {
            document.getElementById('experience-form-container').style.display = 'none';
        });
    }
    
    // Sự kiện khi submit form kinh nghiệm
    if (experienceForm) {
        experienceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Lấy dữ liệu từ form
            const title = document.getElementById('experience-title').value;
            const company = document.getElementById('experience-company').value;
            const startDate = document.getElementById('experience-start').value;
            const endDate = document.getElementById('experience-end').value;
            const description = document.getElementById('experience-description').value;
            const index = parseInt(document.getElementById('experience-index').value);
            
            // Lấy danh sách kinh nghiệm hiện tại
            const experiences = window.dataManager.getData().experience || [];
            
            if (index === -1) {
                // Thêm kinh nghiệm mới
                experiences.push({ title, company, startDate, endDate, description });
            } else {
                // Cập nhật kinh nghiệm đã có
                experiences[index] = { title, company, startDate, endDate, description };
            }
            
            // Cập nhật UI
            fillExperienceList(experiences);
            
            // Ẩn form
            document.getElementById('experience-form-container').style.display = 'none';
        });
    }
    
    // Sự kiện khi click nút "Lưu tất cả kinh nghiệm"
    if (saveExperiencesBtn) {
        saveExperiencesBtn.addEventListener('click', async () => {
            try {
                // Lấy danh sách kinh nghiệm hiện tại
                const experiences = window.dataManager.getData().experience || [];
                
                // Cập nhật dữ liệu
                await window.dataManager.updateData('experience', experiences);
                
                // Hiển thị thông báo thành công
                showNotification('success', 'Đã lưu danh sách kinh nghiệm');
            } catch (error) {
                console.error('Error updating experiences:', error);
                showNotification('error', 'Không thể lưu danh sách kinh nghiệm');
            }
        });
    }
}

/**
 * Khởi tạo sự kiện cho các item kinh nghiệm
 */
function initExperienceItemEvents() {
    // Sự kiện khi click nút "Chỉnh sửa"
    const editButtons = document.querySelectorAll('#experience-list .edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'));
            const experiences = window.dataManager.getData().experience || [];
            const exp = experiences[index];
            
            // Điền dữ liệu vào form
            document.getElementById('experience-title').value = exp.title;
            document.getElementById('experience-company').value = exp.company;
            document.getElementById('experience-start').value = exp.startDate;
            document.getElementById('experience-end').value = exp.endDate || '';
            document.getElementById('experience-description').value = exp.description;
            document.getElementById('experience-index').value = index;
            
            // Hiển thị form
            document.getElementById('experience-form-container').style.display = 'block';
        });
    });
    
    // Sự kiện khi click nút "Xóa"
    const deleteButtons = document.querySelectorAll('#experience-list .delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (confirm('Bạn có chắc chắn muốn xóa kinh nghiệm này không?')) {
                const index = parseInt(button.getAttribute('data-index'));
                const experiences = window.dataManager.getData().experience || [];
                
                // Xóa kinh nghiệm
                experiences.splice(index, 1);
                
                // Cập nhật UI
                fillExperienceList(experiences);
                
                // Hiển thị thông báo
                showNotification('success', 'Đã xóa kinh nghiệm thành công');
            }
        });
    });
}

// Add to global scope
window.initExperienceForm = initExperienceForm;
window.initExperienceItemEvents = initExperienceItemEvents;
