// Analytics tracking and display system
class WebAnalytics {
    constructor() {
        this.apiUrl = 'https://api.revampes-web.vercel.app/analytics'; // You'll need to set up API endpoint
        this.storageKey = 'revampes_analytics';
        this.init();
    }

    init() {
        this.trackPageView();
        this.trackVisitor();
    }

    // Track page view
    trackPageView() {
        const pageData = {
            page: window.location.pathname,
            title: document.title,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenResolution: `${screen.width}x${screen.height}`
        };

        // Store locally
        this.storeLocalData('pageView', pageData);

        // Send to server if API is available
        this.sendToServer('pageview', pageData);

        console.log('📊 Page view tracked:', pageData);
    }

    // Track unique visitor
    trackVisitor() {
        let visitorId = localStorage.getItem('visitor_id');
        
        if (!visitorId) {
            visitorId = this.generateVisitorId();
            localStorage.setItem('visitor_id', visitorId);
            localStorage.setItem('first_visit', new Date().toISOString());
        }

        const visitorData = {
            visitorId,
            firstVisit: localStorage.getItem('first_visit'),
            currentVisit: new Date().toISOString(),
            visits: this.incrementVisitCount()
        };

        this.storeLocalData('visitor', visitorData);
        this.sendToServer('visitor', visitorData);
    }

    // Generate unique visitor ID
    generateVisitorId() {
        return 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Increment visit count
    incrementVisitCount() {
        let count = parseInt(localStorage.getItem('visit_count') || '0');
        count++;
        localStorage.setItem('visit_count', count.toString());
        return count;
    }

    // Store data locally
    storeLocalData(type, data) {
        try {
            let analytics = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
            if (!analytics[type]) analytics[type] = [];
            analytics[type].push(data);
            
            // Keep only last 100 entries
            if (analytics[type].length > 100) {
                analytics[type] = analytics[type].slice(-100);
            }
            
            localStorage.setItem(this.storageKey, JSON.stringify(analytics));
        } catch (e) {
            console.warn('Failed to store analytics:', e);
        }
    }

    // Send data to server
    async sendToServer(type, data) {
        try {
            // This would send to your backend API
            // For now, we'll use Vercel Analytics if available
            if (window.va) {
                window.va('track', type, data);
            }
        } catch (e) {
            console.warn('Failed to send analytics to server:', e);
        }
    }

    // Get analytics summary
    static getAnalyticsSummary() {
        try {
            const analytics = JSON.parse(localStorage.getItem('revampes_analytics') || '{}');
            const pageViews = analytics.pageView || [];
            const visitors = analytics.visitor || [];

            // Calculate page view stats
            const pages = {};
            pageViews.forEach(view => {
                pages[view.page] = (pages[view.page] || 0) + 1;
            });

            // Get most visited pages
            const topPages = Object.entries(pages)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([page, views]) => ({ page, views }));

            return {
                totalPageViews: pageViews.length,
                uniqueVisitors: new Set(visitors.map(v => v.visitorId)).size,
                currentVisitor: {
                    id: localStorage.getItem('visitor_id'),
                    visits: localStorage.getItem('visit_count'),
                    firstVisit: localStorage.getItem('first_visit')
                },
                topPages,
                lastUpdate: new Date().toISOString()
            };
        } catch (e) {
            console.warn('Failed to get analytics summary:', e);
            return null;
        }
    }

    // Track custom event
    static trackEvent(eventName, eventData = {}) {
        const event = {
            name: eventName,
            data: eventData,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        };

        // Store locally
        try {
            let analytics = JSON.parse(localStorage.getItem('revampes_analytics') || '{}');
            if (!analytics.events) analytics.events = [];
            analytics.events.push(event);
            
            if (analytics.events.length > 100) {
                analytics.events = analytics.events.slice(-100);
            }
            
            localStorage.setItem('revampes_analytics', JSON.stringify(analytics));
        } catch (e) {
            console.warn('Failed to track event:', e);
        }

        // Send to Vercel Analytics
        if (window.va) {
            window.va('track', eventName, eventData);
        }

        console.log('📊 Event tracked:', event);
    }
}

// Initialize analytics on page load
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        new WebAnalytics();
    });
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebAnalytics;
}
