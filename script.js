/**
 * Terra Salon and Wellness Spa - Professional LPG Endermologie Website
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

        form.addEventListener('submit', async function(e) {
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

            // Prepare form data for submission
            const submissionData = {
                name: name,
                email: email,
                phone: formData.get('phone')?.trim() || 'Not provided',
                treatment: treatment,
                message: message,
                timestamp: new Date().toISOString()
            };

            // Try to send to backend
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(submissionData)
                });

                if (response.ok) {
                    showFormResponse(
                        `Thank you, ${name}! Your ${treatment} inquiry has been received. We'll contact you within 24 hours.`,
                        'success'
                    );
                    
                    // Track conversion
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'conversion', {
                            'event_category': 'Contact',
                            'event_label': treatment,
                            'value': 1
                        });
                    }
                    
                    if (typeof fbq !== 'undefined') {
                        fbq('track', 'Lead', {
                            content_name: treatment,
                            content_category: 'Contact Form'
                        });
                    }
                } else {
                    // Fallback to mailto if API fails
                    const mailtoLink = `mailto:terrasalonandspa@gmail.com?subject=New ${treatment} Inquiry from ${name}&body=${encodeURIComponent(
                        `Name: ${name}\nEmail: ${email}\nPhone: ${submissionData.phone}\nTreatment Interest: ${treatment}\n\nMessage:\n${message}`
                    )}`;
                    window.location.href = mailtoLink;
                    
                    showFormResponse(
                        `Thank you, ${name}! Please complete sending your email in your email client.`,
                        'success'
                    );
                }
            } catch (error) {
                // Fallback to mailto if network error
                const mailtoLink = `mailto:terrasalonandspa@gmail.com?subject=New ${treatment} Inquiry from ${name}&body=${encodeURIComponent(
                    `Name: ${name}\nEmail: ${email}\nPhone: ${submissionData.phone}\nTreatment Interest: ${treatment}\n\nMessage:\n${message}`
                )}`;
                window.location.href = mailtoLink;
                
                showFormResponse(
                    `Thank you, ${name}! Please complete sending your email in your email client.`,
                    'success'
                );
            }

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
     * Enhanced image loading with WebP support and optimization
     */
    function initImageHandling() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        // Check WebP support
        function supportsWebP() {
            const canvas = document.createElement('canvas');
            return canvas.toDataURL('image/webp').indexOf('webp') !== -1;
        }
        
        const webpSupported = supportsWebP();
        
        images.forEach(img => {
            // Add loading placeholder with blur effect
            img.style.backgroundColor = '#f5f5f5';
            img.style.filter = 'blur(5px)';
            img.style.transition = 'filter 0.3s ease, opacity 0.3s ease';
            
            // Attempt WebP optimization for supported browsers
            if (webpSupported && img.src.includes('.jpg') || img.src.includes('.jpeg') || img.src.includes('.png')) {
                const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                
                // Test if WebP version exists
                const webpImg = new Image();
                webpImg.onload = function() {
                    img.src = webpSrc;
                };
                webpImg.onerror = function() {
                    // Keep original format if WebP doesn't exist
                };
                webpImg.src = webpSrc;
            }
            
            // Handle successful load
            img.addEventListener('load', function() {
                this.style.opacity = '1';
                this.style.filter = 'none';
                this.style.backgroundColor = 'transparent';
            });
            
            // Handle load errors with graceful fallback
            img.addEventListener('error', function() {
                if (this.getAttribute('data-fallback-attempted')) {
                    console.warn('Image failed to load after fallback:', this.src);
                    this.style.backgroundColor = '#e0e0e0';
                    this.style.opacity = '0.7';
                    this.style.filter = 'none';
                    return;
                }
                
                // Try fallback to original format if WebP failed
                if (this.src.includes('.webp')) {
                    this.setAttribute('data-fallback-attempted', 'true');
                    this.src = this.src.replace('.webp', '.jpg');
                }
            });
            
            // Add intersection observer for better lazy loading
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const image = entry.target;
                            if (image.dataset.src) {
                                image.src = image.dataset.src;
                                image.removeAttribute('data-src');
                            }
                            imageObserver.unobserve(image);
                        }
                    });
                });
                
                if (img.dataset.src) {
                    imageObserver.observe(img);
                }
            }
        });
    }

    /**
     * Hide page loader
     */
    function hidePageLoader() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            // Hide immediately for faster loading
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }
    }

    /**
     * Initialize scroll animations
     */
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.1 });

        // Observe elements with animate-on-scroll class
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Initialize mobile menu toggle
     */
    function initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!mobileToggle || !navMenu) return;
        
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Update ARIA expanded
            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /**
     * Initialize testimonial carousel
     */
    function initTestimonialCarousel() {
        const wrapper = document.getElementById('testimonials-wrapper');
        const dotsContainer = document.getElementById('testimonial-dots');
        const prevBtn = document.getElementById('prev-testimonial');
        const nextBtn = document.getElementById('next-testimonial');
        
        if (!wrapper || !dotsContainer || !prevBtn || !nextBtn) return;
        
        const testimonials = wrapper.querySelectorAll('.testimonial');
        let currentIndex = 0;
        
        // Create dots
        testimonials.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `testimonial-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goToTestimonial(index));
            dotsContainer.appendChild(dot);
        });
        
        const dots = dotsContainer.querySelectorAll('.testimonial-dot');
        
        function updateTestimonial() {
            wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
            
            // Update button states
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === testimonials.length - 1;
        }
        
        function goToTestimonial(index) {
            currentIndex = index;
            updateTestimonial();
        }
        
        function nextTestimonial() {
            if (currentIndex < testimonials.length - 1) {
                currentIndex++;
                updateTestimonial();
            }
        }
        
        function prevTestimonial() {
            if (currentIndex > 0) {
                currentIndex--;
                updateTestimonial();
            }
        }
        
        // Event listeners
        nextBtn.addEventListener('click', nextTestimonial);
        prevBtn.addEventListener('click', prevTestimonial);
        
        // Auto-rotation
        let autoRotateInterval = setInterval(nextTestimonial, 5000);
        
        // Pause auto-rotation on hover
        wrapper.addEventListener('mouseenter', () => {
            clearInterval(autoRotateInterval);
        });
        
        wrapper.addEventListener('mouseleave', () => {
            autoRotateInterval = setInterval(nextTestimonial, 5000);
        });
        
        // Initialize
        updateTestimonial();
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
            initImageHandling();
            initScrollAnimations();
            initMobileMenu();
            initTestimonialCarousel();
            
            console.log('Terra Salon and Wellness Spa website initialized successfully');
        } catch (error) {
            console.error('Error initializing website functionality:', error);
        }
    }

    // Start the application immediately
    init();
    
    // Hide loader when page is fully loaded
    window.addEventListener('load', hidePageLoader);
    
    // Fallback - hide loader after max 2 seconds
    setTimeout(hidePageLoader, 2000);
});