// Common utilities (theme, loader) are handled by common-utils.js

document.addEventListener('DOMContentLoaded', () => {
    const username = 'Revampes';
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
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalClose = document.getElementById('modal-close');

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
            links: [
                { label: 'View Artwork', type: 'modal-image', url: '../images/drawingone.png' }
            ]
        },
        {
            title: 'Bamboo Forest sketch',
            description: 'A normal piece of sketching.',
            category: 'art',
            stack: ['Sketchbook', 'Graphite'],
            tags: ['art', 'sketch', 'landscape'],
            links: [
                { label: 'View Artwork', type: 'modal-image', url: '../images/sketchingone.png' }
            ]
        },
        {
            title: 'Doggie Pic 1',
            description: 'Not bad huh?',
            category: 'art',
            stack: ['Digital Illustration'],
            tags: ['art', 'character'],
            links: [
                { label: 'View Artwork', type: 'modal-image', url: '../images/DoggiePic.png' }
            ]
        },
        {
            title: 'Doggie Pic 2',
            description: 'Still not bad huh?',
            category: 'art',
            stack: ['Digital Illustration'],
            tags: ['art', 'character'],
            links: [
                { label: 'View Artwork', type: 'modal-image', url: '../images/DoggiePic2.png' }
            ]
        },
        {
            title: 'Autumn Leaves',
            description: 'A sketching of autumn leaves.',
            category: 'art',
            stack: ['Sketchbook', 'Colored Pencils'],
            tags: ['art', 'nature', 'autumn'],
            links: [
                { label: 'View Artwork', type: 'modal-image', url: '../images/autumn_leaves.png' }
            ]
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

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            searchQuery = searchInput.value.trim().toLowerCase();
            renderAllSections();
        });
    }

    function normalizeWebsiteUrl(url) {
        if (!url) return null;
        const trimmed = url.trim();
        if (!trimmed) return null;
        if (/^https?:\/\//i.test(trimmed)) return trimmed;
        return `https://${trimmed}`;
    }

    async function getRepoLanguages(repoName) {
        try {
            const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/languages`);
            const languages = await response.json();
            return Object.keys(languages);
        } catch (error) {
            return [];
        }
    }

    async function getRepoPagesUrl(repoName) {
        try {
            const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/pages`);
            if (!response.ok) return null;
            const data = await response.json();
            return data.html_url || null;
        } catch (error) {
            return null;
        }
    }

    function formatUpdatedDate(value) {
        if (!value) return '';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        return `Updated ${date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}`;
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
            project.meta,
            ...(project.stack || []),
            ...(project.tags || [])
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
        return haystack.includes(searchQuery);
    }

    function filterProjects(projects) {
        return projects.filter(matchesSearch);
    }

    function buildProjectRow(project) {
        const row = document.createElement('div');
        row.className = 'project-row';
        row.setAttribute('role', 'listitem');

        const main = document.createElement('div');
        main.className = 'project-main';

        const titleEl = document.createElement('h3');
        titleEl.textContent = project.title;
        main.appendChild(titleEl);

        if (project.description) {
            const descEl = document.createElement('p');
            descEl.className = 'project-description';
            descEl.textContent = project.description;
            main.appendChild(descEl);
        }

        if (project.meta) {
            const metaEl = document.createElement('p');
            metaEl.className = 'project-meta-line';
            metaEl.textContent = project.meta;
            main.appendChild(metaEl);
        }

        if (project.metrics && project.metrics.length) {
            const metricsWrap = document.createElement('div');
            metricsWrap.className = 'project-metrics';
            project.metrics.forEach(metric => {
                const badge = document.createElement('span');
                badge.className = 'metric-badge';
                if (metric.icon) {
                    const icon = document.createElement('i');
                    icon.className = metric.icon;
                    icon.setAttribute('aria-hidden', 'true');
                    badge.appendChild(icon);
                }
                const value = document.createElement('span');
                value.textContent = `${metric.value} ${metric.label || ''}`.trim();
                badge.appendChild(value);
                metricsWrap.appendChild(badge);
            });
            main.appendChild(metricsWrap);
        }

        row.appendChild(main);
        row.appendChild(buildStackColumn(project));
        row.appendChild(buildLinksColumn(project));

        return row;
    }

    function buildStackColumn(project) {
        const stackWrapper = document.createElement('div');
        stackWrapper.className = 'project-built-with';
        const stackItems = (project.stack && project.stack.length ? project.stack : project.tags || []).slice(0, 8);

        if (!stackItems.length) {
            const pill = document.createElement('span');
            pill.className = 'stack-pill muted';
            pill.textContent = 'Coming soon';
            stackWrapper.appendChild(pill);
            return stackWrapper;
        }

        stackItems.forEach(item => {
            const pill = document.createElement('span');
            pill.className = 'stack-pill';
            pill.textContent = item;
            stackWrapper.appendChild(pill);
        });

        return stackWrapper;
    }

    function buildLinksColumn(project) {
        const linksWrapper = document.createElement('div');
        linksWrapper.className = 'project-links';
        const links = project.links || [];

        if (!links.length) {
            const placeholder = document.createElement('span');
            placeholder.className = 'project-links-empty';
            placeholder.textContent = 'Links coming soon';
            linksWrapper.appendChild(placeholder);
            return linksWrapper;
        }

        links.forEach(link => {
            if (link.type === 'modal-image') {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'project-link-btn';
                button.textContent = link.label;
                button.addEventListener('click', () => openModal(link.url, project.title));
                linksWrapper.appendChild(button);
            } else if (link.url) {
                const anchor = document.createElement('a');
                anchor.className = 'project-link-btn';
                anchor.href = link.url;
                anchor.target = '_blank';
                anchor.rel = 'noopener';
                anchor.textContent = link.label;
                linksWrapper.appendChild(anchor);
            }
        });

        return linksWrapper;
    }

    function renderRows(category, projects) {
        const ref = sectionRefs[category];
        if (!ref || !ref.list) return;
        const filtered = filterProjects(projects);
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

        filtered.forEach(project => {
            ref.list.appendChild(buildProjectRow(project));
        });
    }

    function renderAllSections() {
        renderRows('programming', programmingProjects);
        renderRows('art', artProjects);
        renderRows('documentation', docProjects);
    }

    function openModal(src, altText) {
        if (!imageModal || !modalImage || !src) return;
        modalImage.src = src;
        modalImage.alt = altText || 'Artwork preview';
        imageModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!imageModal) return;
        imageModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    const modalOverlay = imageModal ? imageModal.querySelector('.modal-overlay') : null;
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && imageModal?.classList.contains('active')) {
            closeModal();
        }
    });

    async function loadProjects() {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
            if (!response.ok) {
                throw new Error('Unable to load GitHub repositories.');
            }

            const repos = await response.json();
            if (!Array.isArray(repos)) {
                throw new Error(repos?.message || 'Unexpected GitHub API response.');
            }
            const programmingData = await Promise.all(
                repos.map(async (repo) => {
                    const [languages, pagesUrl] = await Promise.all([
                        getRepoLanguages(repo.name),
                        getRepoPagesUrl(repo.name)
                    ]);

                    const stack = languages.length ? languages.slice(0, 6) : (repo.language ? [repo.language] : []);
                    const tags = ['github', ...languages.map(l => l.toLowerCase())];
                    const homepageUrl = normalizeWebsiteUrl(repo.homepage);
                    const websiteUrl = pagesUrl || homepageUrl;

                    const links = [];
                    if (websiteUrl) {
                        links.push({ label: 'Visit Website', url: websiteUrl });
                    }
                    links.push({ label: 'View Source', url: repo.html_url });

                    return {
                        title: repo.name,
                        description: repo.description || 'No description available yet.',
                        category: 'programming',
                        stack,
                        tags,
                        links,
                        metrics: [
                            { icon: 'fas fa-star', value: repo.stargazers_count, label: 'stars' },
                            { icon: 'fas fa-code-branch', value: repo.forks_count, label: 'forks' }
                        ],
                        meta: formatUpdatedDate(repo.updated_at)
                    };
                })
            );

            programmingProjects = programmingData.sort((a, b) => {
                const starsA = a.metrics?.[0]?.value || 0;
                const starsB = b.metrics?.[0]?.value || 0;
                return starsB - starsA;
            });
            setSectionMessage('programming', '');
            renderRows('programming', programmingProjects);
        } catch (error) {
            console.error('Error loading projects:', error);
            setSectionMessage(
                'programming',
                '<i class="fas fa-exclamation-triangle" aria-hidden="true"></i> Unable to load GitHub repositories right now. Showing curated projects only.'
            );
            programmingProjects = [];
            renderRows('programming', programmingProjects);
        }
    }

    renderAllSections();
    loadProjects();
});