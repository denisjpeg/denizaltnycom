// ===== Modern JavaScript with ES6+ Features =====

// DOM Elements
const elements = {
    hamburger: document.querySelector('[data-hamburger]'),
    navMenu: document.querySelector('[data-nav-menu]'),
    navLinks: document.querySelectorAll('[data-nav-link]'),
    themeToggle: document.querySelector('[data-theme-toggle]'),
    contactForm: document.querySelector('[data-contact-form]'),
    tabButtons: document.querySelectorAll('[data-tab]'),
    statNumbers: document.querySelectorAll('[data-count]'),
    particles: document.getElementById('particles')
};

// ===== Theme Management =====
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        document.body.classList.toggle('light-mode', this.currentTheme === 'light');
        this.updateThemeIcon();
        this.bindEvents();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.body.classList.toggle('light-mode', this.currentTheme === 'light');
        localStorage.setItem('theme', this.currentTheme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const icon = elements.themeToggle?.querySelector('i');
        if (icon) {
            icon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    bindEvents() {
        elements.themeToggle?.addEventListener('click', () => this.toggleTheme());
    }
}

// ===== Navigation Manager =====
class NavigationManager {
    constructor() {
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        elements.hamburger?.classList.toggle('active', this.isMenuOpen);
        elements.navMenu?.classList.toggle('active', this.isMenuOpen);
        
        // Animate hamburger bars
        const bars = elements.hamburger?.querySelectorAll('.bar');
        bars?.forEach((bar, index) => {
            if (this.isMenuOpen) {
                if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) bar.style.opacity = '0';
                if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                bar.style.transform = '';
                bar.style.opacity = '';
            }
        });
    }

    handleScroll() {
        const navbar = document.querySelector('[data-navbar]');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar?.style.transform = currentScroll > lastScroll ? 'translateY(-100%)' : 'translateY(0)';
                navbar?.style.background = 'rgba(10, 10, 10, 0.95)';
            } else {
                navbar?.style.transform = 'translateY(0)';
                navbar?.style.background = 'var(--glass-bg)';
            }
            
            lastScroll = currentScroll;
        });
    }

    smoothScroll(target) {
        const element = document.querySelector(target);
        if (element) {
            const offset = 80;
            const elementPosition = element.offsetTop - offset;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }

    bindEvents() {
        elements.hamburger?.addEventListener('click', () => this.toggleMenu());
        
        elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                this.smoothScroll(target);
                
                if (window.innerWidth <= 768) {
                    this.toggleMenu();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !elements.navMenu?.contains(e.target) && 
                !elements.hamburger?.contains(e.target)) {
                this.toggleMenu();
            }
        });
    }
}

// ===== Particle System =====
class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.particleCount = 50;
        this.init();
    }

    init() {
        this.createParticles();
        this.animate();
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const animationDuration = Math.random() * 20 + 10;
        const animationDelay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDuration = `${animationDuration}s`;
        particle.style.animationDelay = `${animationDelay}s`;
        
        this.container.appendChild(particle);
        this.particles.push(particle);
    }

    animate() {
        // Additional animation logic can be added here
        requestAnimationFrame(() => this.animate());
    }
}

// ===== Counter Animation =====
class CounterAnimator {
    constructor(elements) {
        this.elements = elements;
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.elements.forEach(element => {
            observer.observe(element);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }
}

// ===== Experience Tabs =====
class ExperienceTabs {
    constructor() {
        this.tabButtons = document.querySelectorAll('[data-tab]');
        this.init();
    }

    init() {
        this.bindEvents();
        this.showTab('tech'); // Show first tab by default
    }

    showTab(tabName) {
        // Hide all experience items
        document.querySelectorAll('[data-content]').forEach(item => {
            item.classList.remove('active');
        });

        // Show selected experience item
        const selectedItem = document.querySelector(`[data-content="${tabName}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
        }

        // Update active tab button
        this.tabButtons.forEach(button => {
            button.classList.toggle('active', button.getAttribute('data-tab') === tabName);
        });
    }

    bindEvents() {
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                this.showTab(tabName);
            });
        });
    }
}

// ===== Contact Form Handler =====
class ContactForm {
    constructor(form) {
        this.form = form;
        this.init();
    }

    init() {
        if (this.form) {
            this.bindEvents();
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        // Validation
        if (!this.validateForm(data)) {
            return;
        }

        // Show loading state
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalHTML = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;

        try {
            // Simulate API call
            await this.simulateApiCall(data);
            
            // Success state
            submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitButton.style.background = 'var(--success-color, #10b981)';
            
            setTimeout(() => {
                this.form.reset();
                submitButton.innerHTML = originalHTML;
                submitButton.disabled = false;
                submitButton.style.background = '';
            }, 3000);

        } catch (error) {
            // Error state
            submitButton.innerHTML = '<i class="fas fa-times"></i> Failed';
            submitButton.style.background = 'var(--error-color, #ef4444)';
            
            setTimeout(() => {
                submitButton.innerHTML = originalHTML;
                submitButton.disabled = false;
                submitButton.style.background = '';
            }, 3000);
        }
    }

    validateForm(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!data.name || data.name.trim().length < 2) {
            this.showError('Please enter a valid name (at least 2 characters)');
            return false;
        }
        
        if (!emailRegex.test(data.email)) {
            this.showError('Please enter a valid email address');
            return false;
        }
        
        if (!data.message || data.message.trim().length < 10) {
            this.showError('Please enter a message (at least 10 characters)');
            return false;
        }
        
        return true;
    }

    simulateApiCall(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted:', data);
                resolve({ success: true });
            }, 2000);
        });
    }

    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--error-color, #ef4444);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-family: var(--font-secondary);
            font-size: 0.9rem;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
}

// ===== Intersection Observer for Animations =====
class ScrollAnimator {
    constructor() {
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements for animation
        document.querySelectorAll('.about-content, .experience-content, .work-item, .contact-form-container').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== Main Application =====
class App {
    constructor() {
        this.themeManager = new ThemeManager();
        this.navigationManager = new NavigationManager();
        this.experienceTabs = new ExperienceTabs();
        this.scrollAnimator = new ScrollAnimator();
        
        if (elements.particles) {
            this.particleSystem = new ParticleSystem(elements.particles);
        }
        
        if (elements.statNumbers.length > 0) {
            this.counterAnimator = new CounterAnimator(elements.statNumbers);
        }
        
        if (elements.contactForm) {
            this.contactForm = new ContactForm(elements.contactForm);
        }
        
        this.init();
    }

    init() {
        // Add loading animation
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
            document.body.style.transition = 'opacity 0.5s ease';
        });

        // Set initial body opacity
        document.body.style.opacity = '0';
        
        console.log('�� Modern Portfolio initialized successfully!');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

// ===== Utility Functions =====
const utils = {
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager, NavigationManager, ParticleSystem, CounterAnimator, ExperienceTabs, ContactForm, ScrollAnimator, App };
}