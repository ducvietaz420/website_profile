/**
 * Admin Portfolio - Phần quản lý portfolio cho admin
 */

/**
 * Khởi tạo form portfolio
 */
function initPortfolioForm() {
    const addPortfolioBtn = document.getElementById('add-portfolio');
    const portfolioForm = document.getElementById('portfolio-form');
    const cancelPortfolioBtn = document.getElementById('cancel-portfolio');
    const savePortfoliosBtn = document.getElementById('save-portfolios');
    
    // Sự kiện khi click nút "Thêm dự án"
    if (addPortfolioBtn) {
        addPortfolioBtn.addEventListener('click', () => {
            // Reset form
            document.getElementById('portfolio-form').reset();
            document.getElementById('portfolio-index').value = -1;
            document.getElementById('portfolio-image-preview').src = '';
            
            // Hiển thị form
            document.getElementById('portfolio-form-container').style.display = 'block';
        });
    }
    
    // Sự kiện khi click nút "Huỷ"
    if (cancelPortfolioBtn) {
        cancelPortfolioBtn.addEventListener('click', () => {
            document.getElementById('portfolio-form-container').style.display = 'none';
        });
    }
    
    // Sự kiện khi submit form portfolio
    if (portfolioForm) {
        portfolioForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Lấy dữ liệu từ form
            const title = document.getElementById('portfolio-title').value;
            const category = document.getElementById('portfolio-category').value;
            const description = document.getElementById('portfolio-description').value;
            const image = document.getElementById('portfolio-image').value;
            const technologies = document.getElementById('portfolio-technologies').value;
            const demoLink = document.getElementById('portfolio-demo').value;
            const githubLink = document.getElementById('portfolio-github').value;
            const index = parseInt(document.getElementById('portfolio-index').value);
            
            // Lấy danh sách portfolio hiện tại
            const portfolioItems = window.dataManager.getData().portfolio || [];
            
            if (index === -1) {
                // Thêm dự án mới
                portfolioItems.push({ 
                    title, 
                    category, 
                    description, 
                    image, 
                    technologies, 
                    demoLink, 
                    githubLink 
                });
            } else {
                // Cập nhật dự án đã có
                portfolioItems[index] = { 
                    title, 
                    category, 
                    description, 
                    image, 
                    technologies, 
                    demoLink, 
                    githubLink 
                };
            }
            
            // Cập nhật UI
            fillPortfolioList(portfolioItems);
            
            // Ẩn form
            document.getElementById('portfolio-form-container').style.display = 'none';
        });
    }
    
    // Sự kiện khi click nút "Lưu tất cả dự án"
    if (savePortfoliosBtn) {
        savePortfoliosBtn.addEventListener('click', async () => {
            try {
                // Lấy danh sách portfolio hiện tại
                const portfolioItems = window.dataManager.getData().portfolio || [];
                
                // Cập nhật dữ liệu
                await window.dataManager.updateData('portfolio', portfolioItems);
                
                // Hiển thị thông báo thành công
                showNotification('success', 'Đã lưu danh sách dự án');
            } catch (error) {
                console.error('Error updating portfolio:', error);
                showNotification('error', 'Không thể lưu danh sách dự án');
            }
        });
    }
}

/**
 * Khởi tạo sự kiện cho các item portfolio
 */
function initPortfolioItemEvents() {
    // Sự kiện khi click nút "Chỉnh sửa"
    const editButtons = document.querySelectorAll('#portfolio-list .edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'));
            const portfolioItems = window.dataManager.getData().portfolio || [];
            const item = portfolioItems[index];
            
            // Điền dữ liệu vào form
            document.getElementById('portfolio-title').value = item.title;
            document.getElementById('portfolio-category').value = item.category;
            document.getElementById('portfolio-description').value = item.description;
            document.getElementById('portfolio-image').value = item.image || '';
            document.getElementById('portfolio-technologies').value = item.technologies || '';
            document.getElementById('portfolio-demo').value = item.demoLink || '';
            document.getElementById('portfolio-github').value = item.githubLink || '';
            document.getElementById('portfolio-index').value = index;
            
            // Cập nhật preview
            if (item.image) {
                document.getElementById('portfolio-image-preview').src = item.image;
            } else {
                document.getElementById('portfolio-image-preview').src = '';
            }
            
            // Hiển thị form
            document.getElementById('portfolio-form-container').style.display = 'block';
        });
    });
    
    // Sự kiện khi click nút "Xóa"
    const deleteButtons = document.querySelectorAll('#portfolio-list .delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (confirm('Bạn có chắc chắn muốn xóa dự án này không?')) {
                const index = parseInt(button.getAttribute('data-index'));
                const portfolioItems = window.dataManager.getData().portfolio || [];
                
                // Xóa dự án
                portfolioItems.splice(index, 1);
                
                // Cập nhật UI
                fillPortfolioList(portfolioItems);
                
                // Hiển thị thông báo
                showNotification('success', 'Đã xóa dự án thành công');
            }
        });
    });
}

/**
 * Lấy nhãn hiển thị cho category
 * @param {String} category Mã category
 * @returns {String} Nhãn hiển thị
 */
function getCategoryLabel(category) {
    const categoryMap = {
        'web': 'Web',
        'mobile': 'Mobile',
        'design': 'Design',
        'other': 'Khác'
    };
    
    return categoryMap[category] || 'Khác';
}

// Add to global scope
window.initPortfolioForm = initPortfolioForm;
window.initPortfolioItemEvents = initPortfolioItemEvents;
window.getCategoryLabel = getCategoryLabel;
