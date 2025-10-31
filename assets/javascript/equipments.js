/**
 * Equipments Page JavaScript
 * Handles animations and interactions
 */

// ========================================
// Initialize Particle Background
// ========================================
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    // Particle background will be initialized by particle-bg.js
    // Just trigger the themeChanged event to ensure proper colors
    const theme = document.body.classList.contains('light-mode') || 
                  document.documentElement.classList.contains('light-mode') ? 'light' : 'dark';
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
}

// ========================================
// Scroll Animation Observer
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in-visible');
            }
        });
    }, observerOptions);

    // Observe all sections with animate-in class
    document.querySelectorAll('.animate-in').forEach(element => {
        observer.observe(element);
    });
}

// ========================================
// Card Hover Effects
// ========================================
function initCardEffects() {
    // Add subtle tilt effect on mouse move for cards
    const cards = document.querySelectorAll('.tool-card, .peripheral-card, .laptop-showcase');
    
    cards.forEach(card => {
        // Skip tilt effect for cards with images to avoid jarring movement
        const hasImage = card.querySelector('.peripheral-image');
        
        card.addEventListener('mousemove', (e) => {
            if (hasImage) return; // Skip tilt for image cards
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ========================================
// Staggered Animation for Cards
// ========================================
function initStaggeredAnimations() {
    // Tool cards staggered animation
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });

    // Peripheral cards staggered animation
    const peripheralCards = document.querySelectorAll('.peripheral-card');
    peripheralCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
}

// ========================================
// Laptop Image Animation
// ========================================
function initLaptopAnimation() {
    const laptopImage = document.querySelector('.laptop-image');
    if (!laptopImage) return;

    // Add floating animation
    let floatDirection = 1;
    let floatPosition = 0;
    
    setInterval(() => {
        floatPosition += floatDirection * 0.5;
        
        if (floatPosition > 10 || floatPosition < -10) {
            floatDirection *= -1;
        }
        
        laptopImage.style.transform = `translateY(${floatPosition}px)`;
    }, 50);
}

// ========================================
// Neon Glow Animation
// ========================================
function initNeonGlow() {
    const neonElements = document.querySelectorAll('.hero-title, .section-title, .laptop-name');
    
    neonElements.forEach(element => {
        setInterval(() => {
            const currentOpacity = parseFloat(getComputedStyle(element).textShadow.match(/rgba?\([^)]+\)/)?.[0]?.match(/[\d.]+$/)?.[0] || 1);
            const newOpacity = 0.6 + Math.random() * 0.4;
            
            const neonColor = getComputedStyle(document.documentElement).getPropertyValue('--neon-color').trim();
            element.style.textShadow = `
                0 0 10px ${neonColor},
                0 0 20px ${neonColor},
                0 0 30px rgba(255, 110, 199, ${newOpacity})
            `;
        }, 2000 + Math.random() * 1000);
    });
}

// ========================================
// Hero Title Animation
// ========================================
function initHeroAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    // Trigger fade in animation
    setTimeout(() => {
        heroTitle.style.opacity = '1';
    }, 300);
}

// ========================================
// Initialize All Features
// ========================================
function initEquipmentsPage() {
    initParticles();
    initScrollAnimations();
    initHeroAnimation();
    
    // Delay card effects until after page load
    setTimeout(() => {
        initCardEffects();
        initStaggeredAnimations();
        initLaptopAnimation();
        initNeonGlow();
    }, 500);
}

// ========================================
// Run on DOM Content Loaded
// ========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEquipmentsPage);
} else {
    initEquipmentsPage();
}

// ========================================
// Theme Change Listener
// ========================================
window.addEventListener('themeChanged', (e) => {
    // Particle background will handle theme changes automatically
    console.log('Theme changed to:', e.detail.theme);
});
