/**
 * Main JS - Xử lý các chức năng chính cho trang web profile
 */

// Đợi trang web load xong
document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo trang web
    initWebsite();
});

/**
 * Khởi tạo trang web
 */
function initWebsite() {
    // Tải dữ liệu profile
    loadProfileData();

    // Khởi tạo các event listeners
    initEventListeners();

    // Khởi tạo scroll indicator
    initScrollIndicator();

    // Khởi tạo events filter
    initEventsFilter();

    // Khởi tạo modal
    initModal();

    // Khởi tạo form liên hệ
    initContactForm();

    // Cập nhật năm hiện tại trong footer
    updateCurrentYear();
}

/**
 * Tải dữ liệu profile và cập nhật UI
 */
function loadProfileData() {
    // Sử dụng DataManager để tải dữ liệu
    dataManager.loadData()
        .then(data => {
            console.log('Loaded profile data:', data); // Thêm log để debug
            // Cập nhật các phần của trang web với dữ liệu đã tải
            updatePersonalInfo(data.personal);
            updateSkills(data.skills);
            if (data.experience && Array.isArray(data.experience)) {
                updateExperience(data.experience);
            } else {
                console.error('Experience data is missing or not an array');
            }

            if (data.events && Array.isArray(data.events)) {
                updateEvents(data.events);
            } else {
                console.error('Events data is missing or not an array');
            }
        })
        .catch(error => {
            console.error('Error loading profile data:', error);
        });
}

/**
 * Cập nhật thông tin cá nhân trên trang web
 * @param {Object} personal Dữ liệu thông tin cá nhân
 */
function updatePersonalInfo(personal) {
    // Cập nhật tên và tiêu đề
    const nameElement = document.querySelector('.full-name');
    if (nameElement) {
        // Xóa hoàn toàn nội dung cũ trước khi cập nhật
        while (nameElement.firstChild) {
            nameElement.removeChild(nameElement.firstChild);
        }
        nameElement.textContent = personal.name || '';
        nameElement.setAttribute('data-name', personal.name || '');
    }

    const titleElement = document.querySelector('[data-title]');
    if (titleElement) {
        titleElement.textContent = personal.title || 'Chức danh';
    }

    const bioElement = document.querySelector('[data-bio]');
    if (bioElement) {
        bioElement.textContent = personal.bio || 'Mô tả ngắn về bản thân';
    }

    // Cập nhật avatar
    const avatarElement = document.querySelector('.hero-avatar');
    if (avatarElement) {
        if (personal.avatar) {
            avatarElement.innerHTML = `<img src="${personal.avatar}" alt="${personal.name}">`;
        } else {
            avatarElement.innerHTML = `<div class="placeholder-avatar">${getInitials(personal.name)}</div>`;
        }
    }

    // Cập nhật ảnh about
    const aboutImageElement = document.querySelector('[data-about-image]');
    if (aboutImageElement && personal.aboutImage) {
        aboutImageElement.src = personal.aboutImage;
        aboutImageElement.alt = personal.name;
    }

    // Cập nhật mô tả about
    const aboutTextElement = document.querySelector('[data-about-text]');
    if (aboutTextElement) {
        aboutTextElement.textContent = personal.about || 'Thông tin chi tiết về bản thân sẽ xuất hiện ở đây.';
    }

    // Cập nhật thông tin chi tiết
    if (personal.birthday) {
        document.querySelector('[data-birthday]').textContent = personal.birthday;
    }

    if (personal.location) {
        document.querySelector('[data-location]').textContent = personal.location;
    }

    if (personal.email) {
        document.querySelector('[data-email]').textContent = personal.email;
        document.querySelector('[data-contact-email]').textContent = personal.email;
    }

    if (personal.phone) {
        document.querySelector('[data-phone]').textContent = personal.phone;
        document.querySelector('[data-contact-phone]').textContent = personal.phone;
    }

    if (personal.address) {
        document.querySelector('[data-contact-address]').textContent = personal.address;
    }

    // Cập nhật liên kết mạng xã hội
    updateSocialLinks(personal);
}

/**
 * Cập nhật các liên kết mạng xã hội
 * @param {Object} personal Dữ liệu thông tin cá nhân
 */
function updateSocialLinks(personal) {
    const socialPlatforms = ['facebook', 'twitter', 'instagram', 'linkedin', 'github'];

    socialPlatforms.forEach(platform => {
        // Cập nhật cho các liên kết ở phần About
        const linkElement = document.querySelector(`[data-${platform}]`);
        if (linkElement && personal[platform]) {
            linkElement.href = personal[platform];
            linkElement.setAttribute('target', '_blank'); // Mở trong tab mới
            linkElement.style.display = 'flex'; // Đảm bảo hiển thị
            
            // Xóa tất cả các sự kiện click cũ (nếu có)
            const newLink = linkElement.cloneNode(true);
            linkElement.parentNode.replaceChild(newLink, linkElement);
            
            // Thêm sự kiện click mới để đảm bảo liên kết hoạt động
            newLink.addEventListener('click', function(e) {
                // Không ngăn chặn hành vi mặc định, cho phép liên kết hoạt động bình thường
                // window.open(this.href, '_blank');
            });
        } else if (linkElement) {
            linkElement.style.display = 'none';
        }

        // Cập nhật cho các liên kết ở phần Footer
        const footerLinkElement = document.querySelector(`[data-${platform}-footer]`);
        if (footerLinkElement && personal[platform]) {
            footerLinkElement.href = personal[platform];
            footerLinkElement.setAttribute('target', '_blank'); // Mở trong tab mới
            footerLinkElement.style.display = 'flex'; // Đảm bảo hiển thị
            
            // Xóa tất cả các sự kiện click cũ (nếu có)
            const newFooterLink = footerLinkElement.cloneNode(true);
            footerLinkElement.parentNode.replaceChild(newFooterLink, footerLinkElement);
            
            // Thêm sự kiện click mới để đảm bảo liên kết hoạt động
            newFooterLink.addEventListener('click', function(e) {
                // Không ngăn chặn hành vi mặc định, cho phép liên kết hoạt động bình thường
                // window.open(this.href, '_blank');
            });
        } else if (footerLinkElement) {
            footerLinkElement.style.display = 'none';
        }
    });
}

/**
 * Cập nhật phần kỹ năng
 * @param {Array} skills Danh sách kỹ năng
 */
function updateSkills(skills) {
    const skillsContainer = document.getElementById('skills-container');
    if (!skillsContainer) return;

    // Xóa nội dung cũ
    skillsContainer.innerHTML = '';

    // Thêm các kỹ năng mới
    skills.forEach(skill => {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item reveal reveal-bottom';

        skillItem.innerHTML = `
            <div class="skill-info">
                <h4>${skill.name}</h4>
                <span>${skill.level}%</span>
            </div>
            <div class="skill-bar">
                <div class="skill-progress" data-width="${skill.level}" style="width: 0"></div>
            </div>
        `;

        skillsContainer.appendChild(skillItem);
    });

    // Kích hoạt animation cho thanh tiến trình sau khi DOM được cập nhật
    setTimeout(() => {
        animateSkillBars();
    }, 100);
}

/**
 * Kích hoạt animation cho thanh tiến trình kỹ năng
 */
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    skillBars.forEach((bar, index) => {
        const level = parseInt(bar.getAttribute('data-width'));

        if (level) {
            // Sử dụng setTimeout để tạo hiệu ứng stagger
            setTimeout(() => {
                bar.style.transition = 'width 1.5s ease-out';
                bar.style.width = `${level}%`;
            }, index * 200); // Delay 200ms cho mỗi thanh
        }
    });
}

/**
 * Cập nhật phần kinh nghiệm
 * @param {Array} experiences Danh sách kinh nghiệm
 */
function updateExperience(experiences) {
    console.log('updateExperience được gọi với:', experiences);

    const timelineContainer = document.getElementById('experience-timeline');
    console.log('Timeline container:', timelineContainer);

    if (!timelineContainer) {
        console.error('Không tìm thấy element experience-timeline');
        return;
    }

    // Xóa nội dung cũ
    timelineContainer.innerHTML = '';
    console.log('Đã xóa nội dung cũ');

    // Thêm các mục kinh nghiệm mới
    experiences.forEach((exp, index) => {
        console.log(`Đang thêm kinh nghiệm ${index + 1}:`, exp);

        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';

        const dateText = exp.endDate ? `${exp.startDate} - ${exp.endDate}` : `${exp.startDate} - Hiện tại`;

        timelineItem.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-content shine-effect">
                <span class="timeline-date">${dateText}</span>
                <h3>${exp.title}</h3>
                <h4>${exp.company}</h4>
                <p>${exp.description}</p>
            </div>
        `;

        timelineContainer.appendChild(timelineItem);
        console.log(`Đã thêm timeline item ${index + 1}`);
    });

    // Nếu không có kinh nghiệm nào, hiển thị thông báo
    if (experiences.length === 0) {
        console.log('Không có kinh nghiệm, hiển thị thông báo');
        timelineContainer.innerHTML = `
            <div class="no-items-message">
                <p>Chưa có thông tin kinh nghiệm.</p>
            </div>
        `;
    }

    console.log('Hoàn thành cập nhật kinh nghiệm. Số lượng items:', experiences.length);
    console.log('Timeline container sau khi cập nhật:', timelineContainer.innerHTML);
}

/**
 * Cập nhật phần events
 * @param {Array} eventsItems Danh sách sự kiện
 */
function updateEvents(eventsItems) {
    const eventsContainer = document.getElementById('events-container');
    if (!eventsContainer) return;

    // Xóa nội dung cũ
    eventsContainer.innerHTML = '';

    console.log('Cập nhật events:', eventsItems); // Log để debug

    // Thêm các sự kiện mới
    eventsItems.forEach(item => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item shine-effect';
        eventItem.setAttribute('data-category', item.category);

        // Chuẩn bị danh sách dịch vụ
        const servicesList = item.services ? item.services.split(',').map(service => service.trim()) : [];

        eventItem.innerHTML = `
            <div class="event-image">
                <img src="${item.image || 'assets/images/placeholder.jpg'}" alt="${item.title}">
            </div>
            <div class="event-info">
                <span class="event-category">${getCategoryLabel(item.category)}</span>
                <h3>${item.title}</h3>
                <p class="event-description">${truncateText(item.description, 120)}</p>
                <div class="event-meta">
                    <span class="event-budget">${item.budget}</span>
                    <span class="event-duration">${item.duration}</span>
                </div>
            </div>
        `;

        // Thêm event listener cho click vào card
        eventItem.addEventListener('click', () => {
            const eventsData = dataManager.getData().events;
            const event = eventsData[eventsItems.indexOf(item)];
            if (event) {
                openEventModal(event);
            }
        });

        eventsContainer.appendChild(eventItem);
    });

    // Nếu không có sự kiện nào, hiển thị thông báo
    if (eventsItems.length === 0) {
        eventsContainer.innerHTML = `
            <div class="no-items-message">
                <p>Chưa có sự kiện nào được thêm vào.</p>
            </div>
        `;
    }
}

/**
 * Mở modal chi tiết sự kiện
 * @param {Object} event Thông tin sự kiện
 */
function openEventModal(event) {
    const modal = document.getElementById('event-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const modalServices = document.getElementById('modal-services');
    const modalBudget = document.getElementById('modal-budget');
    const modalDuration = document.getElementById('modal-duration');

    // Cập nhật nội dung modal
    modalTitle.textContent = event.title;
    modalImage.src = event.image || 'assets/images/placeholder.jpg';
    modalImage.alt = event.title;
    modalDescription.textContent = event.description;

    // Cập nhật danh sách dịch vụ
    modalServices.innerHTML = '';
    if (event.services) {
        const servicesList = event.services.split(',');
        servicesList.forEach(service => {
            const li = document.createElement('li');
            li.textContent = service.trim();
            modalServices.appendChild(li);
        });
    }

    // Cập nhật thông tin chi tiết
    if (modalBudget) {
        modalBudget.textContent = event.budget || 'Liên hệ để biết thêm chi tiết';
    }

    if (modalDuration) {
        modalDuration.textContent = event.duration || 'Tùy thuộc vào quy mô sự kiện';
    }

    // Hiển thị modal
    modal.style.display = 'block';
}

/**
 * Khởi tạo các event listeners
 */
function initEventListeners() {
    // Toggle menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Smooth scroll cho các liên kết anchor
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        // Không thêm event listener cho các liên kết mạng xã hội
        if (link.classList.contains('social-link')) {
            return;
        }
        
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Đóng menu mobile nếu đang mở
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    menuToggle.classList.remove('active');
                }

                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Trừ đi chiều cao của header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active nav link khi scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

/**
 * Cập nhật active link trong navigation khi scroll
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav a');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

/**
 * Khởi tạo scroll indicator
 */
function initScrollIndicator() {
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-progress';
    document.body.appendChild(scrollIndicator);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollIndicator.style.width = scrolled + '%';
    });
}

/**
 * Khởi tạo events filter
 */
function initEventsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Xóa class active khỏi tất cả các nút
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Thêm class active cho nút được click
            button.classList.add('active');

            // Lấy category được chọn
            const filterValue = button.getAttribute('data-filter');
            
            // Lấy tất cả các event items
            const eventItems = document.querySelectorAll('.event-item');
            
            // Lọc các event items
            eventItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Khởi tạo modal
 */
function initModal() {
    const modal = document.getElementById('event-modal');
    const closeModal = document.querySelector('.close-modal');

    if (closeModal && modal) {
        // Đóng modal khi click vào nút đóng
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Đóng modal khi click bên ngoài
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

/**
 * Khởi tạo form liên hệ
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Trong ví dụ này, chúng ta chỉ giả lập việc gửi form thành công
            alert('Cảm ơn bạn đã liên hệ! Tin nhắn của bạn đã được gửi thành công.');
            contactForm.reset();
        });
    }
}

/**
 * Cập nhật năm hiện tại trong footer
 */
function updateCurrentYear() {
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Lấy chữ cái đầu của tên để tạo placeholder avatar
 * @param {String} name Tên đầy đủ
 * @returns {String} Chữ cái đầu
 */
function getInitials(name) {
    if (!name) return '';

    return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase();
}

/**
 * Rút gọn văn bản nếu quá dài
 * @param {String} text Văn bản cần rút gọn
 * @param {Number} maxLength Độ dài tối đa
 * @returns {String} Văn bản đã rút gọn
 */
function truncateText(text, maxLength) {
    if (!text) return '';

    if (text.length <= maxLength) return text;

    return text.substring(0, maxLength) + '...';
}

/**
 * Lấy nhãn hiển thị cho category
 * @param {String} category Mã category
 * @returns {String} Nhãn hiển thị
 */
function getCategoryLabel(category) {
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
