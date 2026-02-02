/* ========================================
   ELLIE TAYLOR FURNITURE - JAVASCRIPT
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initSmoothScroll();
    initLightbox();
    initPortfolioFilter();
    initContactForm();
});

/* ========================================
   NAVBAR
   ======================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');

    if (!navbar) return;

    // Add scrolled class on scroll
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Initial check
    handleScroll();

    // Listen for scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
}

/* ========================================
   MOBILE MENU
   ======================================== */
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navMenu) return;

    // Toggle menu
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ========================================
   SCROLL REVEAL ANIMATION
   ======================================== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    if (!reveals.length) return;

    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });
}

/* ========================================
   SMOOTH SCROLL
   ======================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   LIGHTBOX
   ======================================== */
let currentLightboxIndex = 0;
let lightboxImages = [];

function initLightbox() {
    const lightbox = document.getElementById('lightbox');

    if (!lightbox) return;

    // Close lightbox on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close lightbox on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
        if (e.key === 'ArrowLeft') {
            navigateLightbox(-1);
        }
        if (e.key === 'ArrowRight') {
            navigateLightbox(1);
        }
    });

    // Collect all portfolio images for navigation
    collectLightboxImages();
}

function collectLightboxImages() {
    const portfolioItems = document.querySelectorAll('.portfolio-item, .featured-item');
    lightboxImages = [];

    portfolioItems.forEach((item, index) => {
        const btn = item.querySelector('.btn-view, .btn-view-portfolio');
        if (btn) {
            const onclick = btn.getAttribute('onclick');
            if (onclick) {
                // Extract parameters from onclick
                const match = onclick.match(/openLightbox\('([^']+)',\s*'([^']+)',\s*'([^']+)'\)/);
                if (match) {
                    lightboxImages.push({
                        src: match[1],
                        title: match[2],
                        desc: match[3],
                        index: index
                    });
                }
            }
        }
    });
}

function openLightbox(imageSrc, title, description) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');

    if (!lightbox || !lightboxImage) return;

    // Find current index
    currentLightboxIndex = lightboxImages.findIndex(img => img.src === imageSrc);
    if (currentLightboxIndex === -1) currentLightboxIndex = 0;

    lightboxImage.src = imageSrc;
    lightboxImage.alt = title;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxDesc) lightboxDesc.textContent = description;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');

    if (!lightbox) return;

    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    if (!lightboxImages.length) return;

    currentLightboxIndex += direction;

    // Loop around
    if (currentLightboxIndex >= lightboxImages.length) {
        currentLightboxIndex = 0;
    } else if (currentLightboxIndex < 0) {
        currentLightboxIndex = lightboxImages.length - 1;
    }

    const img = lightboxImages[currentLightboxIndex];
    if (img) {
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxTitle = document.getElementById('lightboxTitle');
        const lightboxDesc = document.getElementById('lightboxDesc');

        if (lightboxImage) {
            lightboxImage.src = img.src;
            lightboxImage.alt = img.title;
        }
        if (lightboxTitle) lightboxTitle.textContent = img.title;
        if (lightboxDesc) lightboxDesc.textContent = img.desc;
    }
}

/* ========================================
   PORTFOLIO FILTER
   ======================================== */
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (!filterButtons.length || !portfolioItems.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter items with animation
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    // Re-trigger animation
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.classList.add('hidden');
                }
            });

            // Re-collect lightbox images after filter
            setTimeout(collectLightboxImages, 100);
        });
    });
}

/* ========================================
   CONTACT FORM
   ======================================== */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Simple validation
        if (!data.name || !data.email || !data.message) {
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            // Success message
            showFormMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);

        // For actual implementation, you would:
        // 1. Use a form service like Formspree, Netlify Forms, or EmailJS
        // 2. Or set up a backend endpoint to handle the form

        // Example with Formspree:
        // fetch('https://formspree.io/f/YOUR_FORM_ID', {
        //     method: 'POST',
        //     body: formData,
        //     headers: { 'Accept': 'application/json' }
        // })
        // .then(response => {
        //     if (response.ok) {
        //         showFormMessage('Thank you! I\'ll get back to you soon.', 'success');
        //         contactForm.reset();
        //     } else {
        //         showFormMessage('Oops! Something went wrong.', 'error');
        //     }
        // })
        // .catch(error => {
        //     showFormMessage('Oops! Something went wrong.', 'error');
        // })
        // .finally(() => {
        //     submitBtn.innerHTML = originalText;
        //     submitBtn.disabled = false;
        // });
    });
}

function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 4px;
        font-size: 0.9375rem;
        text-align: center;
        background-color: ${type === 'success' ? '#d4edda' : '#f8d7da'};
        color: ${type === 'success' ? '#155724' : '#721c24'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
    `;

    // Insert after form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.appendChild(messageEl);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

// Debounce function for performance
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
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
