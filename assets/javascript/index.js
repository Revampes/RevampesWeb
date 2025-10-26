document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (localStorage.getItem('theme') === 'light') {
            body.classList.add('light-mode');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');

            if (body.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light');
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            } else {
                localStorage.setItem('theme', 'dark');
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        });
    }

    // Typing animation (index page only) – guard for missing elements
    const typingElements = [
        { element: document.getElementById('typing-title'), text: 'Revampes' },
        { element: document.getElementById('typing-subtitle'), text: 'AfterTime' },
        { element: document.querySelector('#typing-location span'), text: 'HKG' },
        { element: document.querySelector('#typing-intro p:nth-child(1)'), text: 'Bullshit code creator' },
        { element: document.querySelector('#typing-intro p:nth-child(2)'), text: 'Font-end only, do not provide any work related to back-end to me' },
        { element: document.querySelector('#typing-intro p:nth-child(3)'), text: 'Minecraft Mod Creator | Web Design | Pixel Draw | Painting | Go player | Sport Lover' },
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

    // Sidebar wiring (shared across pages)
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    function handleResize() {
        if (!hamburger || !sidebar || !sidebarOverlay) return;
        if (window.innerWidth <= 768) {
            hamburger.style.display = 'block';
        } else {
            hamburger.style.display = 'none';
            sidebar.classList.remove('open');
            sidebarOverlay.style.display = 'none';
        }
    }
    window.addEventListener('resize', handleResize);
    handleResize();

    if (hamburger && sidebar && sidebarClose && sidebarOverlay) {
        hamburger.addEventListener('click', () => {
            sidebar.classList.add('open');
            sidebarOverlay.style.display = 'block';
        });
        sidebarClose.addEventListener('click', () => {
            sidebar.classList.remove('open');
            sidebarOverlay.style.display = 'none';
        });
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            sidebarOverlay.style.display = 'none';
        });
        sidebar.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                sidebar.classList.remove('open');
                sidebarOverlay.style.display = 'none';
            });
        });
    }

    const loader = document.getElementById('page-loader');
    let loaderMinTime = 2000;
    let loaderStart = Date.now();

    function hideLoader() {
        const elapsed = Date.now() - loaderStart;
        const delay = Math.max(0, loaderMinTime - elapsed);
        setTimeout(() => {
            loader && loader.classList.add('hidden');
        }, delay);
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        hideLoader();
    } else {
        window.addEventListener('DOMContentLoaded', hideLoader);
    }

    // Fix navigation for local file:// and server
    function getSafeHref(href) {
        if (window.location.protocol === 'file:') {
            // Remove leading slash for local navigation
            return href.replace(/^\//, '');
        }
        return href;
    }

    function showLoaderAndNavigate(href) {
        loader && loader.classList.remove('hidden');
        loaderStart = Date.now();
        setTimeout(() => {
            window.location.href = getSafeHref(href);
        }, loaderMinTime);
    }

    document.querySelectorAll('a[href^="/"]:not([target="_blank"])').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showLoaderAndNavigate(this.getAttribute('href'));
        });
    });
});