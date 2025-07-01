/**
 * Inga Dorochova LPG - Professional Endermologie Website
 * Interactive functionality for smooth navigation and form handling
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Configuration
    const CONFIG = {
        headerOffset: 80,
        scrollThreshold: 90,
        responseDisplayTime: 5000
    };

    /**
     * Smooth scrolling for navigation links
     */
    function initSmoothScrolling() {
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const targetPosition = targetElement.offsetTop - CONFIG.headerOffset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Active navigation link highlighting based on scroll position
     */
    function initActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav ul li a');

        window.addEventListener('scroll', () => {
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (window.pageYOffset >= sectionTop - CONFIG.scrollThreshold &&
                    window.pageYOffset < sectionTop + sectionHeight - CONFIG.scrollThreshold) {
                    currentSection = section.getAttribute('id');
                }
            });

            // Update active navigation link
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                
                if (href === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    /**
     * Contact form submission with validation and feedback
     */
    function initContactForm() {
        const form = document.getElementById('contact-form');
        const formResponse = document.getElementById('form-response');

        if (!form || !formResponse) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const name = formData.get('name')?.trim();
            const email = formData.get('email')?.trim();
            const treatment = formData.get('treatment');
            const message = formData.get('message')?.trim();

            // Basic validation
            if (!name || !email || !treatment || !message) {
                showFormResponse('Please fill in all required fields.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormResponse('Please enter a valid email address.', 'error');
                return;
            }

            // Success response
            showFormResponse(
                `Thank you, ${name}! Your ${treatment} inquiry has been received. We'll contact you within 24 hours.`,
                'success'
            );

            // Reset form
            form.reset();
        });
    }

    /**
     * Display form response message
     */
    function showFormResponse(message, type = 'success') {
        const formResponse = document.getElementById('form-response');
        
        if (!formResponse) return;

        formResponse.style.display = 'block';
        formResponse.textContent = message;
        
        // Style based on message type
        if (type === 'error') {
            formResponse.style.color = '#d32f2f';
            formResponse.style.backgroundColor = '#ffebee';
            formResponse.style.padding = '10px';
            formResponse.style.borderRadius = '5px';
            formResponse.style.border = '1px solid #ffcdd2';
        } else {
            formResponse.style.color = '#2e7d32';
            formResponse.style.backgroundColor = '#e8f5e8';
            formResponse.style.padding = '10px';
            formResponse.style.borderRadius = '5px';
            formResponse.style.border = '1px solid #c8e6c9';
        }

        // Auto-hide after configured time
        setTimeout(() => {
            formResponse.style.display = 'none';
        }, CONFIG.responseDisplayTime);
    }

    /**
     * Header background on scroll
     */
    function initHeaderScroll() {
        const header = document.querySelector('header');
        
        if (!header) return;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 50) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                header.style.backdropFilter = 'none';
            }
        });
    }

    /**
     * Initialize all functionality
     */
    function init() {
        try {
            initSmoothScrolling();
            initActiveNavigation();
            initContactForm();
            initHeaderScroll();
            
            console.log('Inga Dorochova LPG website initialized successfully');
        } catch (error) {
            console.error('Error initializing website functionality:', error);
        }
    }

    // Start the application
    init();
});