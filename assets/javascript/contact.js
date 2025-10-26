document.addEventListener('DOMContentLoaded', () => {
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
});