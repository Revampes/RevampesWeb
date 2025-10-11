document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    if (localStorage.getItem('theme') === 'light' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: light)').matches)) {
        document.body.classList.add('light-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');

        if (document.body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            updateParticleColors('light');
        } else {
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            updateParticleColors('dark');
        }
    });

    // 粒子背景功能
    const canvas = document.getElementById('projectParticleCanvas') || document.getElementById('aboutParticleCanvas') || document.getElementById('particleCanvas');
    if (!canvas) return; // If no canvas found, do nothing
    const ctx = canvas.getContext('2d');
    const hero = canvas.parentElement;

    // --- Responsive particle count logic ---
    function getResponsiveParticleCount() {
        const w = window.innerWidth;
        if (w <= 600) return 20;
        if (w <= 1024) return 40;
        return 60;
    }
    let currentParticleCount = getResponsiveParticleCount();

    // Debug: Log initialization and canvas/parent size
    console.log('Initializing particles for', canvas.id);
    console.log('Parent size before resize:', hero.offsetWidth, hero.offsetHeight);

    function resizeCanvas() {
        let w = hero.offsetWidth;
        let h = hero.offsetHeight;
        if (w === 0) w = 400;
        if (h === 0) h = 180;
        canvas.width = w;
        canvas.height = h;
        console.log('Canvas resized to:', w, h);
    }
    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        // Check if particle count should change
        const newCount = getResponsiveParticleCount();
        if (newCount !== currentParticleCount) {
            currentParticleCount = newCount;
            initParticles();
        }
    });

    // 粒子配置参数（移除背景色，保持透明）
    let particleConfig = {
        count: currentParticleCount,
        maxDistance: 150,
        radius: 2,
        speed: 0.8,
        lineWidth: 0.8,
        particleColor: 'rgba(255, 105, 180, 0.8)', // 粉色粒子
        lineColorBase: '255, 105, 180' // 粉色线条
    };

    function updateParticleColors(theme) {
        if (theme === 'light') {
            particleConfig.particleColor = 'rgba(255, 105, 180, 0.6)';
            particleConfig.lineColorBase = '255, 105, 180';
        } else {
            particleConfig.particleColor = 'rgba(255, 105, 180, 0.8)';
            particleConfig.lineColorBase = '255, 105, 180';
        }
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * particleConfig.speed;
            this.vy = (Math.random() - 0.5) * particleConfig.speed;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // 边界反弹
            if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
            if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;

            // 确保粒子在画布内
            this.x = Math.max(0, Math.min(this.x, canvas.width));
            this.y = Math.max(0, Math.min(this.y, canvas.height));
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, particleConfig.radius, 0, Math.PI * 2);
            ctx.fillStyle = particleConfig.particleColor;
            ctx.fill();
        }
    }

    const particles = [];

    function initParticles() {
        particles.length = 0;
        particleConfig.count = currentParticleCount;
        for (let i = 0; i < particleConfig.count; i++) {
            particles.push(new Particle());
        }
    }

    function getDistance(p1, p2) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const distance = getDistance(particles[i], particles[j]);
                if (distance < particleConfig.maxDistance) {
                    const opacity = 1 - (distance / particleConfig.maxDistance);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${particleConfig.lineColorBase}, ${opacity})`;
                    ctx.lineWidth = opacity * particleConfig.lineWidth;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        // 清理画布（透明背景）
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        drawLines();
        requestAnimationFrame(animate);
    }

    // 启动效果
    initParticles();
    animate();
});