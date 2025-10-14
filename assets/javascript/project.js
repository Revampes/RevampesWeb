document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle logic
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const body = document.body;
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

    const username = "Revampes"; // Change to your GitHub username if needed
    const grid = document.getElementById('projects-grid');
    const searchInput = document.getElementById('repo-search');
    let allRepos = [];

    function renderRepos(repos) {
        grid.innerHTML = '';
        if (repos.length === 0) {
            grid.innerHTML = '<p style="color:var(--text-color,#fff);text-align:center;width:100%;">No repositories found.</p>';
            return;
        }
        repos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'project-card';
            const ogImage = `https://opengraph.githubassets.com/1/${username}/${repo.name}`;
            const avatar = repo.owner && repo.owner.avatar_url ? repo.owner.avatar_url : '';
            card.innerHTML = `
                <img class="project-image" src="${ogImage}" alt="${repo.name} image" onerror="this.onerror=null;this.src='${avatar}';" style="width:100%;border-radius:10px 10px 0 0;object-fit:cover;max-height:160px;filter:brightness(65%)">
                <div class="project-title">${repo.name}</div>
                <div class="project-desc">${repo.description ? repo.description : 'No description.'}</div>
                <div class="project-meta">
                    <span><i class="fas fa-code"></i> ${repo.language || 'N/A'}</span>
                    <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                    <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                </div>
                <a class="project-link" href="${repo.html_url}" target="_blank" rel="noopener">Go to repository</a>
            `;
            grid.appendChild(card);
        });
    }

    function filterRepos() {
        const q = searchInput.value.trim().toLowerCase();
        const filtered = allRepos.filter(repo =>
            repo.name.toLowerCase().includes(q) ||
            (repo.description && repo.description.toLowerCase().includes(q))
        );
        renderRepos(filtered);
    }

    searchInput.addEventListener('input', filterRepos);

    // Fetch repositories from GitHub API
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                // Sort by stargazers_count descending
                allRepos = data.sort((a, b) => b.stargazers_count - a.stargazers_count);
                renderRepos(allRepos);
            } else {
                grid.innerHTML = '<p style="color:var(--text-color,#fff);text-align:center;width:100%;">Failed to load repositories.</p>';
            }
        })
        .catch(() => {
            grid.innerHTML = '<p style="color:var(--text-color,#fff);text-align:center;width:100%;">Failed to load repositories.</p>';
        });

    // Loader hiding logic
    const loader = document.getElementById('page-loader');
    let loaderMinTime = 2000;
    let loaderStart = Date.now();

    function hideLoader() {
        const elapsed = Date.now() - loaderStart;
        const delay = Math.max(0, loaderMinTime - elapsed);
        setTimeout(() => {
            loader.classList.add('hidden');
        }, delay);
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        hideLoader();
    } else {
        window.addEventListener('DOMContentLoaded', hideLoader);
    }
});