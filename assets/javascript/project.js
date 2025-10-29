document.addEventListener('DOMContentLoaded', () => {
    const username = "Revampes";
    const grid = document.getElementById('projects-grid');
    const searchInput = document.getElementById('repo-search');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const activeTagsContainer = document.getElementById('active-tags');
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalClose = document.getElementById('modal-close');
    
    let allProjects = [];
    let currentCategory = 'all';
    let activeTags = new Set();

    const artProjects = [
        {
            title: "Bamboo Forest Path",
            description: "Peaceful bamboo forest path with water reflections",
            image: "assets/images/sketchingone.png",
            category: "art",
            tags: ["art", "sketch", "character"]
        },
        {
            title: "Cheerful Character",
            description: "Colorful painted character with joyful expression",
            image: "assets/images/drawingone.png",
            category: "art",
            tags: ["art", "paint", "landscape"]
        }
    ];

    const docProjects = [
        {
            title: "Chemistry DSE Notes",
            description: "DSE chemistry notes and by topic question from 2012-2024",
            link: "https://docs.google.com/document/d/14bsq4VLEhD0N4QkLUcIZzEeraZJJ90QBhYkeh5jMXjc/edit?usp=sharing",
            category: "documentation",
            tags: ["doc", "chemistry", "education"]
        }
    ];

    async function getRepoLanguages(repoName) {
        try {
            const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/languages`);
            const languages = await response.json();
            return Object.keys(languages);
        } catch (error) {
            return [];
        }
    }

    function renderProjects(projects) {
        grid.innerHTML = '';
        if (projects.length === 0) {
            grid.innerHTML = '<p style="color:var(--text-color,#fff);text-align:center;width:100%;grid-column: 1/-1;">No projects found.</p>';
            return;
        }
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            
            if (project.category === 'programming') {
                card.innerHTML = renderProgrammingCard(project);
            } else if (project.category === 'art') {
                card.classList.add('art-card');
                card.innerHTML = renderArtCard(project);
            } else if (project.category === 'documentation') {
                card.innerHTML = renderDocCard(project);
            }
            
            grid.appendChild(card);
        });

        document.querySelectorAll('.project-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleTag(tag.textContent);
            });
        });

        document.querySelectorAll('.art-card .project-card-header').forEach(header => {
            header.addEventListener('click', function() {
                const img = this.querySelector('.project-image');
                openModal(img.src, img.alt);
            });
        });
    }

    function renderProgrammingCard(project) {
        const tagsHTML = project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('');
        
        return `
            <div class="project-card-header">
                <img class="project-image" src="${project.ogImage}" alt="${project.title} preview" onerror="this.onerror=null;this.src='${project.avatar}';">
            </div>
            <div class="project-card-body">
                <div class="project-title">${project.title}</div>
                <div class="project-desc">${project.description}</div>
                <div class="project-tags">${tagsHTML}</div>
                <div class="project-meta">
                    <span><i class="fas fa-star"></i> ${project.stars}</span>
                    <span><i class="fas fa-code-branch"></i> ${project.forks}</span>
                </div>
                <a class="project-link" href="${project.link}" target="_blank" rel="noopener">View Repository</a>
            </div>
        `;
    }

    function renderArtCard(project) {
        const tagsHTML = project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('');
        
        return `
            <div class="project-card-header">
                <img class="project-image" src="${project.image}" alt="${project.title}">
            </div>
            <div class="project-card-body">
                <div class="project-title">${project.title}</div>
                <div class="project-desc">${project.description}</div>
                <div class="project-tags">${tagsHTML}</div>
                <button class="project-link" style="border: none; width: 100%; text-align: center;">View Full Image</button>
            </div>
        `;
    }

    function renderDocCard(project) {
        const tagsHTML = project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('');
        
        return `
            <div class="project-card-body" style="padding: 24px 20px;">
                <div class="project-title">${project.title}</div>
                <div class="project-desc">${project.description}</div>
                <div class="project-tags">${tagsHTML}</div>
                <a class="project-link" href="${project.link}" target="_blank" rel="noopener">Open Document</a>
            </div>
        `;
    }

    function filterProjects() {
        const query = searchInput.value.trim().toLowerCase();
        
        let filtered = allProjects;

        if (currentCategory !== 'all') {
            filtered = filtered.filter(p => p.category === currentCategory);
        }

        if (activeTags.size > 0) {
            filtered = filtered.filter(p => 
                Array.from(activeTags).every(tag => p.tags.includes(tag))
            );
        }

        if (query) {
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query) ||
                p.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        renderProjects(filtered);
    }

    function toggleTag(tag) {
        if (activeTags.has(tag)) {
            activeTags.delete(tag);
        } else {
            activeTags.add(tag);
        }
        updateActiveTagsDisplay();
        filterProjects();
    }

    function updateActiveTagsDisplay() {
        activeTagsContainer.innerHTML = '';
        activeTags.forEach(tag => {
            const badge = document.createElement('span');
            badge.className = 'tag-badge';
            badge.innerHTML = `${tag} <i class="fas fa-times"></i>`;
            badge.addEventListener('click', () => toggleTag(tag));
            activeTagsContainer.appendChild(badge);
        });
    }

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            filterProjects();
        });
    });

    searchInput.addEventListener('input', filterProjects);

    function openModal(src, alt) {
        modalImage.src = src;
        modalImage.alt = alt;
        imageModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        imageModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    imageModal.querySelector('.modal-overlay').addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && imageModal.classList.contains('active')) {
            closeModal();
        }
    });

    async function loadProjects() {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
            const repos = await response.json();
            
            if (Array.isArray(repos)) {
                const programmingProjects = await Promise.all(
                    repos.map(async (repo) => {
                        const languages = await getRepoLanguages(repo.name);
                        const tags = ['github', ...languages.map(l => l.toLowerCase())];
                        
                        return {
                            title: repo.name,
                            description: repo.description || 'No description available.',
                            link: repo.html_url,
                            ogImage: `https://opengraph.githubassets.com/1/${username}/${repo.name}`,
                            avatar: repo.owner?.avatar_url || '',
                            stars: repo.stargazers_count,
                            forks: repo.forks_count,
                            category: 'programming',
                            tags: tags
                        };
                    })
                );

                programmingProjects.sort((a, b) => b.stars - a.stars);

                allProjects = [...programmingProjects, ...artProjects, ...docProjects];
                renderProjects(allProjects);
            } else {
                grid.innerHTML = '<p style="color:var(--text-color,#fff);text-align:center;width:100%;grid-column: 1/-1;">Failed to load projects.</p>';
            }
        } catch (error) {
            grid.innerHTML = '<p style="color:var(--text-color,#fff);text-align:center;width:100%;grid-column: 1/-1;">Failed to load projects.</p>';
        }
    }

    loadProjects();

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
