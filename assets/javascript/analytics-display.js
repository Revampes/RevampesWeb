// Display analytics data on the about page
function displayAnalytics() {
    const analyticsContainer = document.getElementById('analytics-display');
    if (!analyticsContainer) return;

    const stats = WebAnalytics.getAnalyticsSummary();
    if (!stats) {
        analyticsContainer.innerHTML = '<p>No analytics data available yet.</p>';
        return;
    }

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Create analytics HTML
    const analyticsHTML = `
        <div class="analytics-grid">
            <div class="analytics-card">
                <div class="analytics-icon">
                    <i class="fas fa-eye"></i>
                </div>
                <div class="analytics-value">${stats.totalPageViews}</div>
                <div class="analytics-label">Total Page Views</div>
            </div>

            <div class="analytics-card">
                <div class="analytics-icon">
                    <i class="fas fa-users"></i>
                </div>
                <div class="analytics-value">${stats.uniqueVisitors}</div>
                <div class="analytics-label">Unique Visitors</div>
            </div>

            <div class="analytics-card">
                <div class="analytics-icon">
                    <i class="fas fa-user"></i>
                </div>
                <div class="analytics-value">${stats.currentVisitor.visits || 0}</div>
                <div class="analytics-label">Your Visits</div>
            </div>

            <div class="analytics-card">
                <div class="analytics-icon">
                    <i class="fas fa-calendar"></i>
                </div>
                <div class="analytics-value">${formatDate(stats.currentVisitor.firstVisit).split(',')[0]}</div>
                <div class="analytics-label">First Visit</div>
            </div>
        </div>

        <div class="top-pages-section">
            <h3><i class="fas fa-chart-bar"></i> Most Visited Pages</h3>
            <div class="top-pages-list">
                ${stats.topPages.map(page => `
                    <div class="page-stat">
                        <div class="page-name">${page.page === '/' ? 'Home' : page.page.replace(/\.html|\//, '')}</div>
                        <div class="page-views">${page.views} views</div>
                        <div class="page-bar">
                            <div class="page-bar-fill" style="width: ${(page.views / stats.totalPageViews) * 100}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="analytics-footer">
            <p><i class="fas fa-info-circle"></i> Analytics data is stored locally in your browser</p>
            <p class="analytics-update">Last updated: ${formatDate(stats.lastUpdate)}</p>
        </div>
    `;

    analyticsContainer.innerHTML = analyticsHTML;

    // Animate the cards
    const cards = analyticsContainer.querySelectorAll('.analytics-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Load analytics when page is ready
document.addEventListener('DOMContentLoaded', () => {
    displayAnalytics();
    
    // Refresh analytics every 30 seconds
    setInterval(displayAnalytics, 30000);
});

// Track button clicks on about page
document.addEventListener('click', (e) => {
    if (e.target.matches('.about-button, .project-link, .nav-link')) {
        WebAnalytics.trackEvent('button_click', {
            button: e.target.textContent.trim(),
            url: e.target.href || window.location.href
        });
    }
});
