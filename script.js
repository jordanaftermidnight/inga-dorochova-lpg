document.addEventListener('DOMContentLoaded', function() {

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            let targetId = this.getAttribute('href');
            let targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section');
    const navLi = document.querySelectorAll('nav ul li a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 90) {
                current = section.getAttribute('id');
            }
        });

        navLi.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });


    // Contact Form Submission
    const form = document.getElementById('contact-form');
    const formResponse = document.getElementById('form-response');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Basic validation feedback
        formResponse.style.display = 'block';
        formResponse.style.color = '#b48c72';
        formResponse.textContent = 'Thank you for your message! We will get back to you shortly.';

        // Clear the form
        form.reset();

        // Hide the message after a few seconds
        setTimeout(() => {
            formResponse.style.display = 'none';
        }, 5000);
    });

});
