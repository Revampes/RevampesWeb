// Common utilities (theme, sidebar, loader) are handled by common-utils.js

document.addEventListener('DOMContentLoaded', () => {
    // Typing animation (index page only) – guard for missing elements
    const typingElements = [
        { element: document.getElementById('typing-title'), text: 'Revampes' },
        { element: document.getElementById('typing-subtitle'), text: 'AfterTime' },
        { element: document.querySelector('#typing-location span'), text: 'HKG' },
        { element: document.querySelector('#typing-intro p:nth-child(1)'), text: 'Bullshit code creator' },
        { element: document.querySelector('#typing-intro p:nth-child(2)'), text: 'Yes font-end, No back-end, No code, Yes sports, Yes game, Yes draw, Yes chess!' },
    ].filter(item => item.element);

    const typingSpeed = 35;
    const delayBetweenElements = 500;

    function typeWriter(element, text, index, callback) {
        if (!element) return; // safety
        if (index < text.length) {
            element.classList.remove('typing-cursor');
            element.textContent += text.charAt(index);
            element.classList.add('typing-cursor');
            setTimeout(() => {
                typeWriter(element, text, index + 1, callback);
            }, typingSpeed);
        } else if (callback) {
            element.classList.remove('typing-cursor');
            setTimeout(callback, delayBetweenElements);
        }
    }

    function startTypingAnimation(elements, index = 0) {
        if (!elements || elements.length === 0) return;
        if (index < elements.length) {
            const { element, text } = elements[index];
            element.textContent = '';
            typeWriter(element, text, 0, () => {
                startTypingAnimation(elements, index + 1);
            });
        } else {
            // Typing animation finished, show skill boxes
            const skillBoxes = document.getElementById('skill-boxes');
            if (skillBoxes) {
                setTimeout(() => {
                    skillBoxes.classList.add('show');
                }, 300);
            }
        }
    }

    startTypingAnimation(typingElements);

    // Skills slider (index page only)
    const skillsSlider = document.querySelector('.skills-slider');
    if (skillsSlider) {
        skillsSlider.addEventListener('mouseenter', () => {
            skillsSlider.style.animationPlayState = 'paused';
        });
        skillsSlider.addEventListener('mouseleave', () => {
            skillsSlider.style.animationPlayState = 'running';
        });
    }

    document.querySelectorAll('a[href^="/"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`导航到: ${this.getAttribute('href')}`);
        });
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-in').forEach(element => {
        observer.observe(element);
    });
});