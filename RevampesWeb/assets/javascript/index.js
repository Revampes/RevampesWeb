// 主题切换功能
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const icon = themeToggle.querySelector('i');

    // 检查本地存储中的主题偏好
    if (localStorage.getItem('theme') === 'light') {
        html.classList.add('light-mode');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }

    // 切换主题
    themeToggle.addEventListener('click', () => {
        html.classList.toggle('light-mode');

        if (html.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            localStorage.setItem('theme', 'dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    });

    // 打字动画功能
    const typingElements = [
        { element: document.getElementById('typing-title'), text: 'Revampes' },
        { element: document.getElementById('typing-subtitle'), text: 'AfterTime' },
        { element: document.querySelector('#typing-location span'), text: 'HKG' },
        { element: document.querySelector('#typing-intro p:nth-child(1)'), text: 'Bullshit code creator' },
        { element: document.querySelector('#typing-intro p:nth-child(2)'), text: 'Font-end only, do not provide any work related to back-end to me' },
        { element: document.querySelector('#typing-intro p:nth-child(3)'), text: 'Minecraft Mod Creator | Web Design | Pixel Draw | Painting | Go player | Sport Lover' },
    ];

    // 打字速度设置
    const typingSpeed = 50; // 每个字符的毫秒数
    const delayBetweenElements = 500; // 元素之间的延迟毫秒数

    // 执行打字动画（带光标）
    function typeWriter(element, text, index, callback) {
        if (index < text.length) {
            // 移除之前的光标
            element.classList.remove('typing-cursor');

            // 添加字符
            element.textContent += text.charAt(index);

            // 添加光标
            element.classList.add('typing-cursor');

            setTimeout(() => {
                typeWriter(element, text, index + 1, callback);
            }, typingSpeed);
        } else if (callback) {
            // 完成后移除光标
            element.classList.remove('typing-cursor');
            setTimeout(callback, delayBetweenElements);
        }
    }

    // 按顺序执行所有元素的打字动画
    function startTypingAnimation(elements, index = 0) {
        if (index < elements.length) {
            const { element, text } = elements[index];
            element.textContent = ''; // 清空内容
            typeWriter(element, text, 0, () => {
                startTypingAnimation(elements, index + 1);
            });
        }
    }

    // 启动打字动画
    startTypingAnimation(typingElements);

    // 技术技能滚动优化（鼠标悬停时暂停滚动）
    const skillsSlider = document.querySelector('.skills-slider');
    skillsSlider.addEventListener('mouseenter', () => {
        skillsSlider.style.animationPlayState = 'paused';
    });

    skillsSlider.addEventListener('mouseleave', () => {
        skillsSlider.style.animationPlayState = 'running';
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="/"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`导航到: ${this.getAttribute('href')}`);
        });
    });

    // 渐入动画实现
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

    // 观察所有带animate-in类的元素
    document.querySelectorAll('.animate-in').forEach(element => {
        observer.observe(element);
    });

    // --- Sidebar Navigation for Mobile ---
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    // Show hamburger only on mobile
    function handleResize() {
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
    // Close sidebar when a link is clicked (mobile UX)
    sidebar.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            sidebar.classList.remove('open');
            sidebarOverlay.style.display = 'none';
        });
    });

    // --- Loader logic ---
    const loader = document.getElementById('page-loader');
    let loaderMinTime = 2500; // 2.5 seconds
    let loaderStart = Date.now();

    function hideLoader() {
        const elapsed = Date.now() - loaderStart;
        const delay = Math.max(0, loaderMinTime - elapsed);
        setTimeout(() => {
            loader.classList.add('hidden');
        }, delay);
    }

    // Hide loader after DOM is ready and at least 2.5s has passed
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        hideLoader();
    } else {
        window.addEventListener('DOMContentLoaded', hideLoader);
    }

    // Show loader on navigation (internal links)
    function showLoaderAndNavigate(href) {
        loader.classList.remove('hidden');
        loaderStart = Date.now();
        setTimeout(() => {
            window.location.href = href;
        }, loaderMinTime);
    }

    // Intercept all internal links
    document.querySelectorAll('a[href^="/"]:not([target="_blank"])').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showLoaderAndNavigate(this.getAttribute('href'));
        });
    });
});