/**
 * Admin Modal - Xử lý chức năng modal cho trang admin
 */

// Các phần tử DOM
const modalOverlay = document.getElementById('modal-overlay');
const modalContainer = document.querySelector('.modal-container');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalFooter = document.getElementById('modal-footer');
const modalClose = document.getElementById('modal-close');

// Đối tượng quản lý modal
const ModalManager = {
    // Hiển thị modal với tiêu đề, nội dung và các nút
    show: function(title, content, actions) {
        // Cập nhật tiêu đề
        if (title) {
            modalTitle.innerHTML = title;
        }
        
        // Cập nhật nội dung
        modalBody.innerHTML = '';
        if (typeof content === 'string') {
            modalBody.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            modalBody.appendChild(content);
        }
        
        // Cập nhật các nút hành động
        modalFooter.innerHTML = '';
        if (Array.isArray(actions)) {
            actions.forEach(action => {
                const button = document.createElement('button');
                button.className = `btn ${action.className || 'btn-outline'}`;
                button.innerHTML = action.text || 'OK';
                
                if (action.callback) {
                    button.addEventListener('click', action.callback);
                }
                
                modalFooter.appendChild(button);
            });
        }
        
        // Hiển thị modal
        modalOverlay.classList.add('active');
        
        // Focus vào modal container để bắt sự kiện keyboard
        modalContainer.focus();
    },
    
    // Ẩn modal
    hide: function() {
        modalOverlay.classList.remove('active');
    },
    
    // Hiển thị form skill trong modal
    showSkillForm: function(skill, index = -1) {
        // Tạo bản sao của form kỹ năng
        const skillFormTemplate = document.getElementById('skill-form');
        const skillForm = skillFormTemplate.cloneNode(true);
        skillForm.id = 'modal-skill-form';
        
        // Cập nhật dữ liệu nếu là chỉnh sửa
        if (skill) {
            skillForm.querySelector('#skill-name').value = skill.name;
            skillForm.querySelector('#skill-level').value = skill.level;
            skillForm.querySelector('#skill-range').value = skill.level;
            skillForm.querySelector('#skill-value').textContent = `${skill.level}%`;
            
            // Lưu index để cập nhật
            const indexInput = document.createElement('input');
            indexInput.type = 'hidden';
            indexInput.id = 'modal-skill-index';
            indexInput.value = index;
            skillForm.appendChild(indexInput);
        }
        
        // Cập nhật sự kiện range slider
        const skillRange = skillForm.querySelector('#skill-range');
        const skillValue = skillForm.querySelector('#skill-value');
        const skillLevel = skillForm.querySelector('#skill-level');
        
        if (skillRange && skillValue) {
            skillRange.addEventListener('input', () => {
                const value = skillRange.value;
                skillValue.textContent = `${value}%`;
                skillLevel.value = value;
            });
            
            skillLevel.addEventListener('input', () => {
                const value = skillLevel.value;
                skillRange.value = value;
                skillValue.textContent = `${value}%`;
            });
        }
        
        // Loại bỏ các nút submit và cancel trong form gốc để tránh hiển thị lặp
        const formButtons = skillForm.querySelectorAll('button[type="submit"], button[type="button"]');
        formButtons.forEach(button => {
            button.remove();
        });
        
        // Hiển thị modal với form
        this.show(
            `<i class="fas fa-chart-bar"></i> ${index !== -1 ? 'Chỉnh sửa' : 'Thêm'} kỹ năng`,
            skillForm,
            [
                {
                    text: '<i class="fas fa-save"></i> Lưu kỹ năng',
                    className: 'btn-primary',
                    callback: () => {
                        // Xử lý lưu kỹ năng
                        const name = skillForm.querySelector('#skill-name').value;
                        const level = parseInt(skillForm.querySelector('#skill-level').value);
                        const modalIndex = index !== -1 ? index : -1;
                        
                        // Lấy danh sách kỹ năng hiện tại
                        const skills = window.dataManager.getData().skills || [];
                        
                        if (modalIndex === -1) {
                            // Thêm kỹ năng mới
                            skills.push({ name, level });
                        } else {
                            // Cập nhật kỹ năng đã có
                            skills[modalIndex] = { name, level };
                        }
                        
                        // Cập nhật UI
                        fillSkillsList(skills);
                        
                        // Ẩn modal
                        this.hide();
                    }
                },
                {
                    text: '<i class="fas fa-times"></i> Huỷ',
                    className: 'btn-outline',
                    callback: () => this.hide()
                }
            ]
        );
    },
    
    // Hiển thị form kinh nghiệm trong modal
    showExperienceForm: function(experience, index = -1) {
        // Tạo bản sao của form kinh nghiệm
        const expFormTemplate = document.getElementById('experience-form');
        const expForm = expFormTemplate.cloneNode(true);
        expForm.id = 'modal-experience-form';
        
        // Cập nhật dữ liệu nếu là chỉnh sửa
        if (experience) {
            expForm.querySelector('#experience-title').value = experience.title;
            expForm.querySelector('#experience-company').value = experience.company;
            expForm.querySelector('#experience-start').value = experience.startDate;
            expForm.querySelector('#experience-end').value = experience.endDate || '';
            expForm.querySelector('#experience-description').value = experience.description;
            
            // Lưu index để cập nhật
            const indexInput = document.createElement('input');
            indexInput.type = 'hidden';
            indexInput.id = 'modal-experience-index';
            indexInput.value = index;
            expForm.appendChild(indexInput);
        }
        
        // Loại bỏ các nút submit và cancel trong form gốc để tránh hiển thị lặp
        const formButtons = expForm.querySelectorAll('button[type="submit"], button[type="button"]');
        formButtons.forEach(button => {
            button.remove();
        });
        
        // Hiển thị modal với form
        this.show(
            `<i class="fas fa-briefcase"></i> ${index !== -1 ? 'Chỉnh sửa' : 'Thêm'} kinh nghiệm`,
            expForm,
            [
                {
                    text: '<i class="fas fa-save"></i> Lưu kinh nghiệm',
                    className: 'btn-primary',
                    callback: () => {
                        // Xử lý lưu kinh nghiệm
                        const title = expForm.querySelector('#experience-title').value;
                        const company = expForm.querySelector('#experience-company').value;
                        const startDate = expForm.querySelector('#experience-start').value;
                        const endDate = expForm.querySelector('#experience-end').value;
                        const description = expForm.querySelector('#experience-description').value;
                        const modalIndex = index !== -1 ? index : -1;
                        
                        // Lấy danh sách kinh nghiệm hiện tại
                        const experiences = window.dataManager.getData().experience || [];
                        
                        if (modalIndex === -1) {
                            // Thêm kinh nghiệm mới
                            experiences.push({ title, company, startDate, endDate, description });
                        } else {
                            // Cập nhật kinh nghiệm đã có
                            experiences[modalIndex] = { title, company, startDate, endDate, description };
                        }
                        
                        // Cập nhật UI
                        fillExperienceList(experiences);
                        
                        // Ẩn modal
                        this.hide();
                    }
                },
                {
                    text: '<i class="fas fa-times"></i> Huỷ',
                    className: 'btn-outline',
                    callback: () => this.hide()
                }
            ]
        );
    },
    
    // Hiển thị form sự kiện trong modal
    showEventForm: function(event, index = -1) {
        // Tạo bản sao của form sự kiện
        const eventFormTemplate = document.getElementById('events-form');
        const eventForm = eventFormTemplate.cloneNode(true);
        eventForm.id = 'modal-event-form';
        
        // Cập nhật dữ liệu nếu là chỉnh sửa
        if (event) {
            eventForm.querySelector('#event-title').value = event.title;
            eventForm.querySelector('#event-category').value = event.category;
            eventForm.querySelector('#event-description').value = event.description;
            eventForm.querySelector('#event-services').value = event.services || '';
            eventForm.querySelector('#event-budget').value = event.budget || '';
            eventForm.querySelector('#event-duration').value = event.duration || '';
            
            // Cập nhật ảnh
            if (event.image) {
                eventForm.querySelector('#event-image').value = event.image;
                eventForm.querySelector('#event-image-preview').src = event.image;
            }
            
            // Lưu index để cập nhật
            const indexInput = document.createElement('input');
            indexInput.type = 'hidden';
            indexInput.id = 'modal-event-index';
            indexInput.value = index;
            eventForm.appendChild(indexInput);
        }
        
        // Cập nhật sự kiện cho upload ảnh
        const eventImageUpload = eventForm.querySelector('#event-image-upload');
        const selectEventImageBtn = eventForm.querySelector('#select-event-image');
        
        if (selectEventImageBtn && eventImageUpload) {
            selectEventImageBtn.addEventListener('click', () => {
                eventImageUpload.click();
            });
            
            // Thêm lại sự kiện upload ảnh
            eventImageUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    uploadImage(file, 'event', (imageUrl) => {
                        eventForm.querySelector('#event-image').value = imageUrl;
                        eventForm.querySelector('#event-image-preview').src = imageUrl;
                    });
                }
            });
        }
        
        // Loại bỏ các nút submit và cancel trong form gốc để tránh hiển thị lặp
        const formButtons = eventForm.querySelectorAll('button[type="submit"], button[type="button"]');
        formButtons.forEach(button => {
            if (button.id === 'select-event-image') return; // Giữ lại nút chọn ảnh
            button.remove();
        });
        
        // Hiển thị modal với form
        this.show(
            `<i class="fas fa-calendar-alt"></i> ${index !== -1 ? 'Chỉnh sửa' : 'Thêm'} sự kiện`,
            eventForm,
            [
                {
                    text: '<i class="fas fa-save"></i> Lưu sự kiện',
                    className: 'btn-primary',
                    callback: async () => {
                        // Xử lý lưu sự kiện
                        const title = eventForm.querySelector('#event-title').value;
                        const category = eventForm.querySelector('#event-category').value;
                        const description = eventForm.querySelector('#event-description').value;
                        const image = eventForm.querySelector('#event-image').value;
                        const services = eventForm.querySelector('#event-services').value;
                        const budget = eventForm.querySelector('#event-budget').value;
                        const duration = eventForm.querySelector('#event-duration').value;
                        const modalIndex = index !== -1 ? index : -1;
                        
                        // Lấy danh sách sự kiện hiện tại
                        const eventsItems = window.dataManager.getData().events || [];
                        
                        if (modalIndex === -1) {
                            // Thêm sự kiện mới
                            eventsItems.push({
                                title,
                                category,
                                description,
                                image,
                                services,
                                budget,
                                duration
                            });
                        } else {
                            // Cập nhật sự kiện đã có
                            eventsItems[modalIndex] = {
                                title,
                                category,
                                description,
                                image,
                                services,
                                budget,
                                duration
                            };
                        }
                        
                        try {
                            // Cập nhật dữ liệu vào cơ sở dữ liệu
                            await window.dataManager.updateData('events', eventsItems);
                            
                            // Cập nhật UI
                            fillEventsList(eventsItems);
                            
                            // Hiển thị thông báo thành công
                            showNotification('success', 'Đã lưu sự kiện thành công');
                            
                            // Ẩn modal
                            this.hide();
                        } catch (error) {
                            console.error('Error updating event:', error);
                            showNotification('error', 'Không thể lưu sự kiện');
                        }
                    }
                },
                {
                    text: '<i class="fas fa-times"></i> Huỷ',
                    className: 'btn-outline',
                    callback: () => this.hide()
                }
            ]
        );
    }
};

// Thêm sự kiện đóng modal
if (modalClose) {
    modalClose.addEventListener('click', () => {
        ModalManager.hide();
    });
}

// Thêm sự kiện đóng khi click vào overlay
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            ModalManager.hide();
        }
    });
}

// Thêm sự kiện đóng khi nhấn ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        ModalManager.hide();
    }
});

// Thêm vào global scope
window.ModalManager = ModalManager;
