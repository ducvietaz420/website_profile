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

    // Khởi tạo portfolio filter
    initPortfolioFilter();

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

            if (data.portfolio && Array.isArray(data.portfolio)) {
                updatePortfolio(data.portfolio);
            } else {
                console.error('Portfolio data is missing or not an array');
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
        nameElement.textContent = personal.name;
        nameElement.setAttribute('data-name', personal.name);
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
        } else if (linkElement) {
            linkElement.style.display = 'none';
        }

        // Cập nhật cho các liên kết ở phần Footer
        const footerLinkElement = document.querySelector(`[data-${platform}-footer]`);
        if (footerLinkElement && personal[platform]) {
            footerLinkElement.href = personal[platform];
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
 * Cập nhật phần portfolio
 * @param {Array} portfolioItems Danh sách dự án
 */
function updatePortfolio(portfolioItems) {
    const portfolioContainer = document.getElementById('portfolio-container');
    if (!portfolioContainer) return;

    // Xóa nội dung cũ
    portfolioContainer.innerHTML = '';

    console.log('Cập nhật portfolio:', portfolioItems); // Log để debug

    // Thêm các dự án mới
    portfolioItems.forEach(item => {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = 'portfolio-item shine-effect';
        portfolioItem.setAttribute('data-category', item.category);

        // Chuẩn bị danh sách công nghệ
        const techList = item.technologies ? item.technologies.split(',').map(tech => tech.trim()) : [];

        portfolioItem.innerHTML = `
            <div class="portfolio-image">
                <img src="${item.image || 'assets/images/placeholder.jpg'}" alt="${item.title}">
                <div class="portfolio-overlay">
                    <div class="overlay-content">
                        <h4>${item.title}</h4>
                        <p>${getCategoryLabel(item.category)}</p>
                    </div>
                </div>
            </div>
            <div class="portfolio-info">
                <span class="portfolio-category">${getCategoryLabel(item.category)}</span>
                <h3>${item.title}</h3>
                <p>${truncateText(item.description, 100)}</p>
                <div class="portfolio-buttons">
                    <button class="btn btn-primary view-project" data-id="${portfolioItems.indexOf(item)}">Chi tiết</button>
                </div>
            </div>
        `;

        portfolioContainer.appendChild(portfolioItem);
    });

    // Nếu không có dự án nào, hiển thị thông báo
    if (portfolioItems.length === 0) {
        portfolioContainer.innerHTML = `
            <div class="no-items-message">
                <p>Chưa có dự án nào được thêm vào.</p>
            </div>
        `;
    }

    // Thêm wave divider
    const waveDiv = document.createElement('div');
    waveDiv.className = 'wave-divider';
    waveDiv.innerHTML = `
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" class="shape-fill"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" class="shape-fill"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" class="shape-fill"></path>
        </svg>
    `;
    portfolioContainer.parentNode.appendChild(waveDiv);

    // Khởi tạo lại sự kiện cho các nút "Chi tiết"
    initViewProjectButtons();
}

/**
 * Khởi tạo các sự kiện click cho các nút "Chi tiết" trong portfolio
 */
function initViewProjectButtons() {
    const viewButtons = document.querySelectorAll('.view-project');

    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const projectId = button.getAttribute('data-id');
            const portfolioData = dataManager.getData().portfolio;
            const project = portfolioData[projectId];

            if (project) {
                openProjectModal(project);
            }
        });
    });
}

/**
 * Mở modal chi tiết dự án
 * @param {Object} project Thông tin dự án
 */
function openProjectModal(project) {
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const modalTechnologies = document.getElementById('modal-technologies');
    const modalDemo = document.getElementById('modal-demo');
    const modalGithub = document.getElementById('modal-github');

    // Cập nhật nội dung modal
    modalTitle.textContent = project.title;
    modalImage.src = project.image || 'assets/images/placeholder.jpg';
    modalImage.alt = project.title;
    modalDescription.textContent = project.description;

    // Cập nhật danh sách công nghệ
    modalTechnologies.innerHTML = '';
    if (project.technologies) {
        const techList = project.technologies.split(',');
        techList.forEach(tech => {
            const li = document.createElement('li');
            li.textContent = tech.trim();
            modalTechnologies.appendChild(li);
        });
    }

    // Cập nhật các liên kết
    if (project.demoLink) {
        modalDemo.href = project.demoLink;
        modalDemo.style.display = 'inline-block';
    } else {
        modalDemo.style.display = 'none';
    }

    if (project.githubLink) {
        modalGithub.href = project.githubLink;
        modalGithub.style.display = 'inline-block';
    } else {
        modalGithub.style.display = 'none';
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
 * Khởi tạo portfolio filter
 */
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Xóa class active khỏi tất cả các nút
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Thêm class active cho nút được click
            button.classList.add('active');

            // Lấy category được chọn
            const filterValue = button.getAttribute('data-filter');

            // Lọc các portfolio items
            portfolioItems.forEach(item => {
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
    const modal = document.getElementById('project-modal');
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
        'web': 'Web',
        'mobile': 'Mobile',
        'design': 'Design',
        'other': 'Khác'
    };

    return categoryMap[category] || 'Khác';
}
