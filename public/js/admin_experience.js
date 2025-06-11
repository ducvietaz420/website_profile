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
            // Hiển thị modal thêm kinh nghiệm
            window.ModalManager.showExperienceForm();
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
            
            // Hiển thị modal chỉnh sửa kinh nghiệm
            window.ModalManager.showExperienceForm(exp, index);
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
