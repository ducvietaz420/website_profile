/**
 * Admin Events - Phần quản lý events cho admin
 */

/**
 * Khởi tạo form events
 */
function initEventsForm() {
    const addEventBtn = document.getElementById('add-event');
    const eventsForm = document.getElementById('events-form');
    const cancelEventBtn = document.getElementById('cancel-event');
    const saveEventsBtn = document.getElementById('save-events');
    
    // Sự kiện khi click nút "Thêm sự kiện"
    if (addEventBtn) {
        addEventBtn.addEventListener('click', () => {
            // Hiển thị modal thêm sự kiện
            window.ModalManager.showEventForm();
        });
    }
    
    // Sự kiện khi click nút "Lưu tất cả sự kiện"
    if (saveEventsBtn) {
        saveEventsBtn.addEventListener('click', async () => {
            try {
                // Lấy danh sách events hiện tại
                const eventsItems = window.dataManager.getData().events || [];
                
                // Cập nhật dữ liệu
                await window.dataManager.updateData('events', eventsItems);
                
                // Hiển thị thông báo thành công
                showNotification('success', 'Đã lưu danh sách sự kiện');
            } catch (error) {
                console.error('Error updating events:', error);
                showNotification('error', 'Không thể lưu danh sách sự kiện');
            }
        });
    }
}

/**
 * Khởi tạo sự kiện cho các item events
 */
function initEventsItemEvents() {
    // Sự kiện khi click nút "Chỉnh sửa"
    const editButtons = document.querySelectorAll('#events-list .edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'));
            const eventsItems = window.dataManager.getData().events || [];
            const item = eventsItems[index];
            
            // Hiển thị modal chỉnh sửa sự kiện
            window.ModalManager.showEventForm(item, index);
        });
    });
    
    // Sự kiện khi click nút "Xóa"
    const deleteButtons = document.querySelectorAll('#events-list .delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (confirm('Bạn có chắc chắn muốn xóa sự kiện này không?')) {
                const index = parseInt(button.getAttribute('data-index'));
                const eventsItems = window.dataManager.getData().events || [];
                
                // Xóa sự kiện
                eventsItems.splice(index, 1);
                
                // Cập nhật UI
                fillEventsList(eventsItems);
                
                // Hiển thị thông báo
                showNotification('success', 'Đã xóa sự kiện thành công');
            }
        });
    });
}

/**
 * Điền danh sách events vào UI
 * @param {Array} eventsItems Danh sách sự kiện
 */
function fillEventsList(eventsItems) {
    const eventsList = document.getElementById('events-list');
    if (!eventsList) return;
    
    eventsList.innerHTML = '';
    
    eventsItems.forEach((item, index) => {
        const eventItem = document.createElement('div');
        eventItem.className = 'admin-item';
        
        eventItem.innerHTML = `
            <div class="item-info">
                <h4>${item.title}</h4>
                <p><strong>Loại:</strong> ${getEventCategoryLabel(item.category)}</p>
                <p><strong>Ngân sách:</strong> ${item.budget || 'Chưa cập nhật'}</p>
                <p><strong>Thời gian chuẩn bị:</strong> ${item.duration || 'Chưa cập nhật'}</p>
                <p class="description">${item.description}</p>
            </div>
            <div class="item-actions">
                <button type="button" class="btn btn-sm btn-outline edit-btn" data-index="${index}"><i class="fas fa-edit"></i> Chỉnh sửa</button>
                <button type="button" class="btn btn-sm btn-danger delete-btn" data-index="${index}"><i class="fas fa-trash-alt"></i> Xóa</button>
            </div>
        `;
        
        eventsList.appendChild(eventItem);
    });
    
    // Khởi tạo lại sự kiện cho các nút
    initEventsItemEvents();
}

/**
 * Lấy nhãn hiển thị cho category
 * @param {String} category Mã category
 * @returns {String} Nhãn hiển thị
 */
function getEventCategoryLabel(category) {
    const categoryMap = {
        'wedding': 'Đám cưới',
        'corporate': 'Doanh nghiệp',
        'entertainment': 'Giải trí',
        'private': 'Riêng tư',
        'fashion': 'Thời trang',
        'other': 'Khác'
    };
    
    return categoryMap[category] || 'Khác';
}

// Add to global scope
window.initEventsForm = initEventsForm;
window.initEventsItemEvents = initEventsItemEvents;
window.fillEventsList = fillEventsList;
window.getEventCategoryLabel = getEventCategoryLabel;
