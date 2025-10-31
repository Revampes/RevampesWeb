/**
 * Common Utilities for RevampesWeb
 * Centralized shared functionality across all pages
 */

// ========================================
// Theme Toggle Functionality
// ========================================
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const targetElement = document.documentElement.classList.contains('html') ? document.documentElement : document.body;
    const icon = themeToggle.querySelector('i');
    
    // Initialize theme from localStorage
    if (localStorage.getItem('theme') === 'light') {
        targetElement.classList.add('light-mode');
        if (icon) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', () => {
        targetElement.classList.toggle('light-mode');
        
        if (targetElement.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            if (icon) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
            // Trigger custom event for particle color updates
            window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: 'light' } }));
        } else {
            localStorage.setItem('theme', 'dark');
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
            window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: 'dark' } }));
        }
    });
}

// ========================================
// Sidebar/Hamburger Menu Functionality
// ========================================
function initSidebar() {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    if (!hamburger || !sidebar) return;

    function handleResize() {
        if (window.innerWidth <= 768) {
            hamburger.style.display = 'block';
        } else {
            hamburger.style.display = 'none';
            sidebar.classList.remove('open');
            if (sidebarOverlay) {
                sidebarOverlay.style.display = 'none';
            }
        }
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        if (sidebarOverlay) {
            sidebarOverlay.style.display = 'none';
        }
    }

    function openSidebar() {
        sidebar.classList.add('open');
        if (sidebarOverlay) {
            sidebarOverlay.style.display = 'block';
        }
    }

    // Event listeners
    hamburger.addEventListener('click', openSidebar);
    
    if (sidebarClose) {
        sidebarClose.addEventListener('click', closeSidebar);
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // Close sidebar when clicking nav links
    sidebar.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeSidebar);
    });

    // Handle window resize
    window.addEventListener('resize', handleResize);
    handleResize();
}

// ========================================
// Page Loader Functionality
// ========================================
function initPageLoader(minTime = 1000) {
    const loader = document.getElementById('page-loader');
    if (!loader) return;

    const loaderStart = Date.now();

    function hideLoader() {
        const elapsed = Date.now() - loaderStart;
        const delay = Math.max(0, minTime - elapsed);
        setTimeout(() => {
            loader.classList.add('hidden');
        }, delay);
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
    }
}

// ========================================
// Navigation with Loader
// ========================================
function initNavigationWithLoader() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;

    function getSafeHref(href) {
        if (window.location.protocol === 'file:') {
            // Remove leading slash for local navigation
            return href.replace(/^\//, '');
        }
        return href;
    }

    function showLoaderAndNavigate(href) {
        loader.classList.remove('hidden');
        setTimeout(() => {
            window.location.href = getSafeHref(href);
        }, 300);
    }

    document.querySelectorAll('a[href^="/"]:not([target="_blank"])').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showLoaderAndNavigate(this.getAttribute('href'));
        });
    });
}

// ========================================
// Initialize All Common Utilities
// ========================================
function initCommonUtils() {
    initThemeToggle();
    initSidebar();
    initPageLoader();
    initNavigationWithLoader();
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommonUtils);
} else {
    initCommonUtils();
}
