/**
 * Animations - Quản lý các hiệu ứng animation cho website
 */

class AnimationManager {
    constructor() {
        // Kiểm tra xem GSAP và ScrollTrigger đã được load chưa
        this.checkGSAP();
        this.particles = [];
    }

    /**
     * Kiểm tra xem GSAP và ScrollTrigger đã được load chưa
     */
    checkGSAP() {
        if (typeof gsap === 'undefined') {
            console.warn('GSAP chưa được load. Một số animation sẽ không hoạt động.');
            return false;
        }

        if (typeof ScrollTrigger === 'undefined') {
            console.warn('ScrollTrigger chưa được load. Các scroll animation sẽ không hoạt động.');
            return false;
        }

        gsap.registerPlugin(ScrollTrigger);
        return true;
    }

    /**
     * Khởi tạo tất cả animation
     */
    init() {
        // Kiểm tra lại xem GSAP đã load chưa
        if (!this.checkGSAP()) return;

        // Khởi tạo các animation
        this.initPreloader();
        this.initScrollAnimations();
        this.initParticles();
        this.initHeroAnimation();
        this.initTypewriterEffect();
        this.initScrollReveal();
        this.initSkillsAnimation();
        this.initPortfolioHover();
        this.initParallaxEffect();
        this.initCurvedSlider();
        this.initShatteringEffect();
    }

    /**
     * Animation cho preloader
     */
    initPreloader() {
        const loaderTl = gsap.timeline();

        loaderTl.to('.loader-container', {
            opacity: 0,
            duration: 0.8,
            delay: 1, // Đợi 1 giây trước khi ẩn loader
            onComplete: () => {
                const loader = document.querySelector('.loader-container');
                if (loader) {
                    loader.style.display = 'none';
                }
            }
        });
    }

    /**
     * Các animation khi scroll
     */
    initScrollAnimations() {
        // Header animation
        gsap.to('.header', {
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'bottom top',
                end: '+=50',
                scrub: true
            },
            height: '70px',
            boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)'
        });

        // About section animation
        gsap.from('.about-image', {
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top 80%',
                end: 'center center',
                scrub: 1
            },
            x: -100,
            opacity: 0,
            duration: 1
        });

        gsap.from('.about-text', {
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top 80%',
                end: 'center center',
                scrub: 1
            },
            x: 100,
            opacity: 0,
            duration: 1
        });

        // Experience timeline animation
        gsap.from('.timeline-item', {
            scrollTrigger: {
                trigger: '.experience-section',
                start: 'top 80%',
                end: 'bottom bottom',
                scrub: 1
            },
            opacity: 0,
            y: 50,
            stagger: 0.2
        });

        // Portfolio items animation
        gsap.from('.portfolio-item', {
            scrollTrigger: {
                trigger: '.portfolio-section',
                start: 'top 80%',
                end: 'center center',
                scrub: 1
            },
            opacity: 0,
            y: 50,
            stagger: 0.1
        });
    }

    /**
     * Hiệu ứng particles cho hero section
     */
    initParticles() {
        const particlesContainer = document.getElementById('particles-container');
        if (!particlesContainer) return;

        const colors = [
            'rgba(0, 123, 255, 0.3)',
            'rgba(0, 123, 255, 0.2)',
            'rgba(0, 123, 255, 0.1)'
        ];

        // Tạo các particles
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // Kích thước ngẫu nhiên
            const size = Math.random() * 10 + 5;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            // Vị trí ngẫu nhiên
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;

            // Màu ngẫu nhiên từ mảng colors
            const colorIndex = Math.floor(Math.random() * colors.length);
            particle.style.backgroundColor = colors[colorIndex];

            // Animation độ trễ ngẫu nhiên
            particle.style.animationDelay = `${Math.random() * 5}s`;

            // Hướng di chuyển ngẫu nhiên
            const endX = (Math.random() - 0.5) * 200;
            const endY = (Math.random() - 0.5) * 200;
            particle.style.setProperty('--end-x', `${endX}px`);
            particle.style.setProperty('--end-y', `${endY}px`);

            particlesContainer.appendChild(particle);
            this.particles.push(particle);
        }
    }

    /**
     * Animation cho hero section
     */
    initHeroAnimation() {
        const heroTl = gsap.timeline();

        heroTl.from('.hero-content h1', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: 0.5
        })
            .from('.hero-content h2', {
                y: 50,
                opacity: 0,
                duration: 0.8
            }, '-=0.5')
            .from('.hero-content p', {
                y: 50,
                opacity: 0,
                duration: 0.8
            }, '-=0.5')
            .from('.cta-buttons', {
                y: 50,
                opacity: 0,
                duration: 0.8
            }, '-=0.5')
            .from('.hero-avatar', {
                scale: 0.8,
                opacity: 0,
                duration: 1
            }, '-=0.8')
            .from('.hero-bg', {
                scale: 0.5,
                opacity: 0,
                duration: 1.5
            }, '-=1')
            .from('.scroll-indicator', {
                opacity: 0,
                y: 20,
                duration: 0.5
            }, '-=0.5');
    }

    /**
     * Hiệu ứng đánh chữ cho tiêu đề
     */
    initTypewriterEffect() {
        const fullNameElement = document.querySelector('.full-name');
        if (!fullNameElement) return;

        const name = fullNameElement.getAttribute('data-name') || 'Tên của bạn';
        fullNameElement.textContent = '';
        fullNameElement.classList.add('typing');

        let i = 0;
        const typeWriter = () => {
            if (i < name.length) {
                fullNameElement.textContent += name.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // Xóa class typing sau khi hoàn thành
                setTimeout(() => {
                    fullNameElement.classList.remove('typing');
                }, 1000);
            }
        };

        // Bắt đầu hiệu ứng đánh chữ sau 1.5 giây
        setTimeout(typeWriter, 1500);
    }

    /**
     * Hiệu ứng scroll reveal cho các phần tử
     */
    initScrollReveal() {
        // Chọn tất cả các phần tử cần animation khi scroll
        const revealElements = document.querySelectorAll('.reveal');

        const revealOnScroll = () => {
            const windowHeight = window.innerHeight;
            const revealPoint = 150;

            revealElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;

                if (elementTop < windowHeight - revealPoint) {
                    element.classList.add('active');
                } else {
                    element.classList.remove('active');
                }
            });
        };

        // Gọi hàm khi scroll
        window.addEventListener('scroll', revealOnScroll);

        // Gọi một lần khi load trang
        revealOnScroll();
    }

    /**
     * Animation cho các thanh kỹ năng
     */
    initSkillsAnimation() {
        const skills = document.querySelectorAll('.skill-progress');

        skills.forEach(skill => {
            const level = parseInt(skill.getAttribute('data-width'));

            if (level && typeof gsap !== 'undefined') {
                gsap.to(skill, {
                    width: `${level}%`,
                    duration: 1.5,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: skill,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                });
            }
        });

        // Fallback animation nếu GSAP không có
        if (typeof gsap === 'undefined') {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const skill = entry.target;
                        const level = parseInt(skill.getAttribute('data-width'));
                        if (level) {
                            skill.style.width = `${level}%`;
                        }
                    }
                });
            }, { threshold: 0.5 });

            skills.forEach(skill => {
                observer.observe(skill);
            });
        }
    }

    /**
     * Animation cho portfolio items (3D hover effect)
     */
    initPortfolioHover() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        portfolioItems.forEach(item => {
            item.addEventListener('mousemove', e => {
                const { left, top, width, height } = item.getBoundingClientRect();
                const x = (e.clientX - left) / width - 0.5;
                const y = (e.clientY - top) / height - 0.5;

                gsap.to(item, {
                    rotationY: x * 10,
                    rotationX: -y * 10,
                    transformPerspective: 500,
                    ease: 'power1.out',
                    duration: 0.5
                });
            });

            item.addEventListener('mouseleave', () => {
                gsap.to(item, {
                    rotationY: 0,
                    rotationX: 0,
                    ease: 'elastic.out(1, 0.5)',
                    duration: 1
                });
            });
        });
    }

    /**
     * Tạo hiệu ứng parallax khi scroll
     */
    initParallaxEffect() {
        const parallaxElements = document.querySelectorAll('.parallax');

        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;

            gsap.to(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                },
                y: (i, target) => -ScrollTrigger.maxScroll(window) * speed,
                ease: 'none'
            });
        });
    }

    /**
     * Hiệu ứng Clean Slider với Curved Background
     */
    initCurvedSlider() {
        // Kiểm tra xem các phần tử cần thiết có tồn tại không
        const heroSection = document.querySelector('.hero-section');
        const aboutSection = document.querySelector('.about-section');

        if (!heroSection || !aboutSection) return;

        // Thêm đường cong cho hero section
        const curve = document.createElement('div');
        curve.className = 'hero-curve';
        heroSection.appendChild(curve);

        // Thêm hiệu ứng chuyển động mượt cho đường cong
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: heroSection,
                start: 'bottom bottom',
                end: 'bottom top-=30%',
                scrub: true
            }
        });

        tl.to(curve, {
            y: -50,
            ease: "power3.out"
        });

        // Thêm hiệu ứng cho hero content
        const heroContent = heroSection.querySelector('.hero-content');
        if (heroContent) {
            gsap.from(heroContent, {
                y: 50,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: heroSection,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            });
        }

        // Thêm hiệu ứng chuyển động mượt giữa các section
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            if (index > 0) {
                const prevSection = sections[index - 1];

                // Thêm đường cong giữa các section
                const sectionCurve = document.createElement('div');
                sectionCurve.className = 'section-curve';
                prevSection.appendChild(sectionCurve);

                // Hiệu ứng Parallax giữa các section
                gsap.to(sectionCurve, {
                    y: -30,
                    scrollTrigger: {
                        trigger: section,
                        start: "top bottom",
                        end: "top 70%",
                        scrub: true
                    }
                });
            }
        });
    }

    /**
     * Hiệu ứng Shattering (vỡ ra) cho các phần tử
     */
    initShatteringEffect() {
        // Tạo hiệu ứng vỡ ra cho avatar
        const avatar = document.querySelector('.hero-avatar');
        if (avatar) {
            // Thêm sự kiện hover
            avatar.addEventListener('mouseenter', () => {
                // Kiểm tra nếu anime.js đã được load
                if (typeof anime === 'undefined') return;

                // Tạo các mảnh vỡ
                const fragments = 12;
                const container = document.createElement('div');
                container.className = 'avatar-shatter-container';

                // Lấy kích thước và vị trí của avatar
                const rect = avatar.getBoundingClientRect();
                container.style.position = 'absolute';
                container.style.top = '0';
                container.style.left = '0';
                container.style.width = `${rect.width}px`;
                container.style.height = `${rect.height}px`;
                container.style.borderRadius = '50%';
                container.style.overflow = 'hidden';

                // Tạo các mảnh vỡ
                for (let i = 0; i < fragments; i++) {
                    const fragment = document.createElement('div');
                    fragment.className = 'avatar-fragment';
                    fragment.style.backgroundImage = getComputedStyle(avatar).backgroundImage;
                    fragment.style.backgroundSize = 'cover';
                    fragment.style.position = 'absolute';

                    // Tính toán vị trí và kích thước của từng mảnh
                    const angle = (i / fragments) * Math.PI * 2;
                    const x = Math.cos(angle) * rect.width / 4;
                    const y = Math.sin(angle) * rect.height / 4;

                    fragment.style.width = `${rect.width / 3}px`;
                    fragment.style.height = `${rect.height / 3}px`;
                    fragment.style.top = `${rect.height / 2 - rect.height / 6}px`;
                    fragment.style.left = `${rect.width / 2 - rect.width / 6}px`;
                    fragment.style.transform = `translate(${x}px, ${y}px) rotate(${angle * 180 / Math.PI}deg)`;

                    container.appendChild(fragment);
                }

                // Thêm vào DOM
                avatar.appendChild(container);

                // Animation các mảnh vỡ bay ra
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: '.avatar-fragment',
                        translateX: function (el, i) {
                            const angle = (i / fragments) * Math.PI * 2;
                            return Math.cos(angle) * rect.width;
                        },
                        translateY: function (el, i) {
                            const angle = (i / fragments) * Math.PI * 2;
                            return Math.sin(angle) * rect.height;
                        },
                        opacity: 0,
                        easing: 'easeOutExpo',
                        duration: 1500,
                        delay: function (el, i) { return i * 100; },
                        complete: function () {
                            // Xóa container sau khi hoàn thành
                            container.remove();
                        }
                    });
                }
            });
        }

        // Hiệu ứng vỡ ra cho các project khi hover
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                if (typeof anime === 'undefined') return;

                // Tạo hiệu ứng rung lắc
                anime({
                    targets: item,
                    translateX: [0, -5, 5, -5, 5, 0],
                    duration: 800,
                    easing: 'easeInOutQuad'
                });

                // Hiệu ứng tách ra khi hover
                const img = item.querySelector('img');
                if (img) {
                    anime({
                        targets: img,
                        scale: 1.1,
                        duration: 500,
                        easing: 'easeOutQuad'
                    });
                }
            });

            item.addEventListener('mouseleave', () => {
                if (typeof anime === 'undefined') return;

                // Phục hồi kích thước
                const img = item.querySelector('img');
                if (img) {
                    anime({
                        targets: img,
                        scale: 1,
                        duration: 500,
                        easing: 'easeOutQuad'
                    });
                }
            });
        });
    }

    /**
     * Hủy các animation và dọn dẹp
     */
    destroy() {
        // Xóa tất cả các ScrollTrigger
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        }

        // Xóa tất cả các particles
        this.particles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });

        this.particles = [];
    }
}

// Tạo instance duy nhất của AnimationManager
const animationManager = new AnimationManager();

// Export để sử dụng trong các file khác
window.animationManager = animationManager;

// Khởi tạo animation khi trang đã load xong
window.addEventListener('load', () => {
    animationManager.init();
});
