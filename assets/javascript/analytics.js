// Simplified Vercel Analytics tracking
class WebAnalytics {
    // Track custom event with Vercel Analytics only
    static trackEvent(eventName, eventData = {}) {
        if (window.va) {
            window.va('track', eventName, eventData);
            console.log('📊 Event tracked:', eventName, eventData);
        }
    }
}

// Initialize analytics on page load
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Just log that Vercel Analytics is active
        if (window.va) {
            console.log('✅ Vercel Analytics is active');
        }
    });
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebAnalytics;
}
