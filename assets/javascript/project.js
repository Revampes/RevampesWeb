// Common utilities (theme, loader) are handled by common-utils.js

document.addEventListener('DOMContentLoaded', () => {
    const username = 'Revampes';
    const MAX_PROGRAMMING_REPOS = 21;
    const searchInput = document.getElementById('repo-search');
    const sectionRefs = {
        programming: {
            list: document.getElementById('programming-list'),
            message: document.getElementById('programming-message')
        },
        art: {
            list: document.getElementById('art-list'),
            message: document.getElementById('art-message')
        },
        documentation: {
            list: document.getElementById('documentation-list'),
            message: document.getElementById('documentation-message')
        }
    };

    // Image modal
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalClose = document.getElementById('modal-close');

    // Explore modal
    const exploreModal = document.getElementById('explore-modal');
    const exploreTitle = document.getElementById('explore-title');
    const exploreBody = document.getElementById('explore-body');
    const exploreFooter = document.getElementById('explore-footer');
    const exploreClose = document.getElementById('explore-close');
    const exploreOverlay = document.getElementById('explore-overlay');

    const emptyStateCopy = {
        programming: 'Repositories will pop up here soon.',
        art: 'More creative drops are coming soon.',
        documentation: 'Documentation updates will appear here.'
    };

    let programmingProjects = [];
    let searchQuery = '';

    const artProjects = [
        {
            title: '魔丸靈珠 中秋version',
            description: 'For fun, and happy mid-autumn festival!',
            category: 'art',
            stack: ['Digital Illustration', 'Clip Studio Paint'],
            tags: ['art', 'paint', 'character'],
            previewUrl: '../images/drawingone.png'
        },
        {
            title: 'Bamboo Forest sketch',
            description: 'A normal piece of sketching.',
            category: 'art',
            stack: ['Sketchbook', 'Graphite'],
            tags: ['art', 'sketch', 'landscape'],
            previewUrl: '../images/sketchingone.png'
        },
        {
            title: 'Doggie Pic 1',
            description: 'Not bad huh?',
            category: 'art',
            stack: ['Digital Illustration'],
            tags: ['art', 'character'],
            previewUrl: '../images/DoggiePic.png'
        },
        {
            title: 'Doggie Pic 2',
            description: 'Still not bad huh?',
            category: 'art',
            stack: ['Digital Illustration'],
            tags: ['art', 'character'],
            previewUrl: '../images/DoggiePic2.png'
        },
        {
            title: 'Autumn Leaves',
            description: 'A sketching of autumn leaves.',
            category: 'art',
            stack: ['Sketchbook', 'Colored Pencils'],
            tags: ['art', 'nature', 'autumn'],
            previewUrl: '../images/autumn_leaves.png'
        }
    ];

    const docProjects = [
        {
            title: 'Chemistry DSE Notes',
            description: 'DSE chemistry notes and by-topic questions from 2012-2024.',
            category: 'documentation',
            stack: ['Google Docs', 'Education'],
            tags: ['doc', 'chemistry', 'education'],
            links: [
                { label: 'Open Document', url: 'https://docs.google.com/document/d/14bsq4VLEhD0N4QkLUcIZzEeraZJJ90QBhYkeh5jMXjc/edit?usp=sharing' }
            ]
        }
    ];

    // ========== Search ==========
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            searchQuery = searchInput.value.trim().toLowerCase();
            renderAllSections();
        });
    }

    // ========== Helpers ==========
    function formatDate(value) {
        if (!value) return 'N/A';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return 'N/A';
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }

    async function getCommitCount(repoName) {
        try {
            const resp = await fetch(`https://api.github.com/repos/${username}/${repoName}/commits?per_page=1`);
            const linkHeader = resp.headers.get('Link');
            if (linkHeader) {
                const match = linkHeader.match(/[&?]page=(\d+)>;\s*rel="last"/);
                if (match) return parseInt(match[1], 10);
            }
            // Fallback: count from the array if Link header is absent (small repos)
            const commits = await resp.json();
            return Array.isArray(commits) ? commits.length : 0;
        } catch {
            return 0;
        }
    }

    async function getRepoLanguages(repoName) {
        try {
            const resp = await fetch(`https://api.github.com/repos/${username}/${repoName}/languages`);
            const languages = await resp.json();
            return Object.keys(languages);
        } catch {
            return [];
        }
    }

    async function getRepoPagesUrl(repoName) {
        try {
            const resp = await fetch(`https://api.github.com/repos/${username}/${repoName}/pages`);
            if (!resp.ok) return null;
            const data = await resp.json();
            return data.html_url || null;
        } catch {
            return null;
        }
    }

    function setSectionMessage(category, message) {
        const ref = sectionRefs[category];
        if (!ref || !ref.message) return;
        if (message) {
            ref.message.innerHTML = message;
            ref.message.classList.add('active');
        } else {
            ref.message.innerHTML = '';
            ref.message.classList.remove('active');
        }
    }

    function matchesSearch(project) {
        if (!searchQuery) return true;
        const haystack = [
            project.title,
            project.description,
            ...(project.stack || []),
            ...(project.tags || [])
        ].filter(Boolean).join(' ').toLowerCase();
        return haystack.includes(searchQuery);
    }

    // ========== Build Cards ==========
    function buildProgrammingCard(project, index) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('role', 'listitem');
        card.style.animationDelay = `${index * 0.06}s`;

        // Title
        const title = document.createElement('h3');
        title.className = 'card-title';
        title.textContent = project.title;
        card.appendChild(title);

        // Description
        if (project.description) {
            const desc = document.createElement('p');
            desc.className = 'card-description';
            desc.textContent = project.description;
            card.appendChild(desc);
        }

        // Meta: commits, last commit, stars
        const meta = document.createElement('div');
        meta.className = 'card-meta';

        const commitsRow = document.createElement('div');
        commitsRow.className = 'card-meta-row';
        commitsRow.innerHTML = `<i class="fas fa-history"></i> <span>Total commits:</span> <span class="meta-value">${project.commitCount ?? '...'}</span>`;
        meta.appendChild(commitsRow);

        const lastCommitRow = document.createElement('div');
        lastCommitRow.className = 'card-meta-row';
        lastCommitRow.innerHTML = `<i class="fas fa-clock"></i> <span>Last commit:</span> <span class="meta-value">${project.lastCommitDate || 'N/A'}</span>`;
        meta.appendChild(lastCommitRow);

        const starsRow = document.createElement('div');
        starsRow.className = 'card-meta-row';
        starsRow.innerHTML = `<i class="fas fa-star"></i> <span>Stars:</span> <span class="meta-value">${project.stars ?? 0}</span>`;
        meta.appendChild(starsRow);

        card.appendChild(meta);

        // Stack pills
        const stackWrap = document.createElement('div');
        stackWrap.className = 'card-stack';
        const stackItems = (project.stack && project.stack.length ? project.stack : []).slice(0, 6);
        if (stackItems.length) {
            stackItems.forEach(item => {
                const pill = document.createElement('span');
                pill.className = 'stack-pill';
                pill.textContent = item;
                stackWrap.appendChild(pill);
            });
        } else {
            const pill = document.createElement('span');
            pill.className = 'stack-pill muted';
            pill.textContent = 'No languages';
            stackWrap.appendChild(pill);
        }
        card.appendChild(stackWrap);

        // Actions
        const actions = document.createElement('div');
        actions.className = 'card-actions';

        const exploreBtn = document.createElement('button');
        exploreBtn.type = 'button';
        exploreBtn.className = 'project-link-btn explore-btn';
        exploreBtn.innerHTML = '<i class="fas fa-book-open"></i> Explore details';
        exploreBtn.addEventListener('click', () => openExploreModal(project.repoName, project.websiteUrl));
        actions.appendChild(exploreBtn);

        if (project.htmlUrl) {
            const githubBtn = document.createElement('a');
            githubBtn.className = 'project-link-btn github-btn';
            githubBtn.href = project.htmlUrl;
            githubBtn.target = '_blank';
            githubBtn.rel = 'noopener';
            githubBtn.innerHTML = '<i class="fab fa-github"></i> View on GitHub';
            actions.appendChild(githubBtn);
        }

        card.appendChild(actions);
        return card;
    }

    function buildArtCard(project, index) {
        const card = document.createElement('div');
        card.className = 'project-card art-card';
        card.setAttribute('role', 'listitem');
        card.style.animationDelay = `${index * 0.06}s`;
        card.addEventListener('click', () => openImageModal(project.previewUrl, project.title));

        // Preview image
        if (project.previewUrl) {
            const img = document.createElement('img');
            img.className = 'card-preview';
            img.src = project.previewUrl;
            img.alt = project.title;
            img.loading = 'lazy';
            card.appendChild(img);
        }

        const title = document.createElement('h3');
        title.className = 'card-title';
        title.textContent = project.title;
        card.appendChild(title);

        if (project.description) {
            const desc = document.createElement('p');
            desc.className = 'card-description';
            desc.textContent = project.description;
            card.appendChild(desc);
        }

        // Stack pills
        const stackWrap = document.createElement('div');
        stackWrap.className = 'card-stack';
        (project.stack || []).forEach(item => {
            const pill = document.createElement('span');
            pill.className = 'stack-pill';
            pill.textContent = item;
            stackWrap.appendChild(pill);
        });
        card.appendChild(stackWrap);

        return card;
    }

    function buildDocCard(project, index) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('role', 'listitem');
        card.style.animationDelay = `${index * 0.06}s`;

        const title = document.createElement('h3');
        title.className = 'card-title';
        title.textContent = project.title;
        card.appendChild(title);

        if (project.description) {
            const desc = document.createElement('p');
            desc.className = 'card-description';
            desc.textContent = project.description;
            card.appendChild(desc);
        }

        // Stack pills
        const stackWrap = document.createElement('div');
        stackWrap.className = 'card-stack';
        (project.stack || []).forEach(item => {
            const pill = document.createElement('span');
            pill.className = 'stack-pill';
            pill.textContent = item;
            stackWrap.appendChild(pill);
        });
        card.appendChild(stackWrap);

        // Action links
        const actions = document.createElement('div');
        actions.className = 'card-actions';

        (project.links || []).forEach(link => {
            if (link.url) {
                const anchor = document.createElement('a');
                anchor.className = 'project-link-btn github-btn';
                anchor.href = link.url;
                anchor.target = '_blank';
                anchor.rel = 'noopener';
                anchor.textContent = link.label;
                actions.appendChild(anchor);
            }
        });

        card.appendChild(actions);
        return card;
    }

    // ========== Explore Modal ==========
    function openExploreModal(repoName, websiteUrl) {
        if (!exploreModal) return;
        exploreTitle.textContent = repoName;
        exploreBody.innerHTML = '<div class="readme-loading"><i class="fas fa-spinner fa-spin"></i> Loading README...</div>';
        exploreFooter.innerHTML = '';
        exploreModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        loadExploreContent(repoName, websiteUrl);
    }

    function closeExploreModal() {
        if (!exploreModal) return;
        exploreModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    async function loadExploreContent(repoName, websiteUrl) {
        // Fetch README and latest release in parallel
        const [readmeHtml, releaseData] = await Promise.allSettled([
            fetchReadmeHtml(repoName),
            fetchLatestRelease(repoName)
        ]);

        // Render README
        if (readmeHtml.status === 'fulfilled' && readmeHtml.value) {
            exploreBody.innerHTML = `<div class="readme-content">${readmeHtml.value}</div>`;
        } else {
            exploreBody.innerHTML = '<div class="readme-loading">No README found for this project.</div>';
        }

        // Build actions
        let actionsHtml = '';
        if (releaseData.status === 'fulfilled' && releaseData.value) {
            const release = releaseData.value;
            actionsHtml += `
                <div class="release-info">
                    <h3><i class="fas fa-tag"></i> Latest Release: ${escapeHtml(release.tag_name || release.name || 'Unknown')}</h3>
                    <p class="release-meta">Published ${formatDate(release.published_at)}</p>
                    ${release.body ? `<div class="release-body">${escapeHtml(release.body).replace(/\n/g, '<br>')}</div>` : ''}
                </div>
            `;
        } else {
            actionsHtml += '<p class="no-release">No releases published yet.</p>';
        }

        actionsHtml += '<div class="explore-actions">';
        if (websiteUrl) {
            actionsHtml += `<a href="${websiteUrl}" target="_blank" rel="noopener" class="explore-btn-action download-btn"><i class="fas fa-globe"></i> Visit Website</a>`;
        }
        if (releaseData.status === 'fulfilled' && releaseData.value) {
            actionsHtml += `<a href="${releaseData.value.html_url}" target="_blank" rel="noopener" class="explore-btn-action download-btn"><i class="fas fa-download"></i> Download Release</a>`;
        }
        actionsHtml += `<a href="https://github.com/${username}/${repoName}/releases" target="_blank" rel="noopener" class="explore-btn-action releases-btn"><i class="fab fa-github"></i> All Releases</a>`;
        actionsHtml += '</div>';

        exploreFooter.innerHTML = actionsHtml;
    }

    async function fetchReadmeHtml(repoName) {
        const resp = await fetch(`https://api.github.com/repos/${username}/${repoName}/readme`, {
            headers: { 'Accept': 'application/vnd.github.html+json' }
        });
        if (!resp.ok) return null;
        return await resp.text();
    }

    async function fetchLatestRelease(repoName) {
        const resp = await fetch(`https://api.github.com/repos/${username}/${repoName}/releases/latest`);
        if (!resp.ok) return null;
        return await resp.json();
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ========== Image Modal ==========
    function openImageModal(src, altText) {
        if (!imageModal || !modalImage || !src) return;
        modalImage.src = src;
        modalImage.alt = altText || 'Artwork preview';
        imageModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeImageModal() {
        if (!imageModal) return;
        imageModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ========== Render ==========
    function renderCards(category, projects, builderFn) {
        const ref = sectionRefs[category];
        if (!ref || !ref.list) return;
        const filtered = projects.filter(matchesSearch);
        ref.list.innerHTML = '';

        if (!filtered.length) {
            const emptyEl = document.createElement('p');
            emptyEl.className = 'section-empty';
            emptyEl.textContent = searchQuery
                ? 'No projects match your search.'
                : (emptyStateCopy[category] || 'Projects will be added soon.');
            ref.list.appendChild(emptyEl);
            return;
        }

        filtered.forEach((project, i) => {
            ref.list.appendChild(builderFn(project, i));
        });
    }

    function renderAllSections() {
        renderCards('programming', programmingProjects, buildProgrammingCard);
        renderCards('art', artProjects, buildArtCard);
        renderCards('documentation', docProjects, buildDocCard);
    }

    // ========== Event Listeners ==========
    if (modalClose) modalClose.addEventListener('click', closeImageModal);
    const imgOverlay = imageModal ? imageModal.querySelector('.modal-overlay') : null;
    if (imgOverlay) imgOverlay.addEventListener('click', closeImageModal);

    if (exploreClose) exploreClose.addEventListener('click', closeExploreModal);
    if (exploreOverlay) exploreOverlay.addEventListener('click', closeExploreModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (exploreModal?.classList.contains('active')) closeExploreModal();
            if (imageModal?.classList.contains('active')) closeImageModal();
        }
    });

    // ========== Load GitHub Projects ==========
    async function loadProjects() {
        try {
            const resp = await fetch(`https://api.github.com/users/${username}/repos?per_page=${MAX_PROGRAMMING_REPOS}&sort=updated`);
            if (!resp.ok) throw new Error('Unable to load GitHub repositories.');

            const repos = await resp.json();
            if (!Array.isArray(repos)) throw new Error(repos?.message || 'Unexpected API response.');

            const limited = repos.slice(0, MAX_PROGRAMMING_REPOS);

            // Fetch detailed data in parallel batches of 5 to avoid rate limits
            const batchSize = 5;
            const results = [];
            for (let i = 0; i < limited.length; i += batchSize) {
                const batch = limited.slice(i, i + batchSize);
                const batchResults = await Promise.all(
                    batch.map(async (repo) => {
                        const [languages, pagesUrl, commitCount] = await Promise.all([
                            getRepoLanguages(repo.name),
                            getRepoPagesUrl(repo.name),
                            getCommitCount(repo.name)
                        ]);

                        const allLangs = languages.length ? languages : (repo.language ? [repo.language] : []);
                        const websiteUrl = pagesUrl || null;

                        return {
                            title: repo.name,
                            repoName: repo.name,
                            description: repo.description || 'No description available yet.',
                            category: 'programming',
                            stack: allLangs.slice(0, 6),
                            tags: ['github', ...allLangs.map(l => l.toLowerCase())],
                            stars: repo.stargazers_count,
                            commitCount,
                            lastCommitDate: formatDate(repo.pushed_at),
                            htmlUrl: repo.html_url,
                            websiteUrl
                        };
                    })
                );
                results.push(...batchResults);
            }

            programmingProjects = results.sort((a, b) => b.stars - a.stars);
            setSectionMessage('programming', '');
            renderCards('programming', programmingProjects, buildProgrammingCard);
        } catch (error) {
            console.error('Error loading projects:', error);
            setSectionMessage(
                'programming',
                '<i class="fas fa-exclamation-triangle"></i> Unable to load GitHub repositories. Showing curated projects only.'
            );
            programmingProjects = [];
            renderCards('programming', programmingProjects, buildProgrammingCard);
        }
    }

    // Initial render
    renderAllSections();
    loadProjects();
});