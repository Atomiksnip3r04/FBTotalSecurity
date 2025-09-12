/**
 * UTM Parameter Tracking for Social Media Traffic
 * Automatically adds UTM parameters to social media links for analytics tracking
 */

// UTM Configuration for different social platforms
const UTM_CONFIG = {
    facebook: {
        utm_source: 'facebook',
        utm_medium: 'social',
        utm_campaign: 'social_media_footer'
    },
    instagram: {
        utm_source: 'instagram', 
        utm_medium: 'social',
        utm_campaign: 'social_media_footer'
    },
    twitter: {
        utm_source: 'twitter',
        utm_medium: 'social', 
        utm_campaign: 'social_media_footer'
    }
};

/**
 * Add UTM parameters to social media links
 */
function addUTMParameters() {
    const socialLinks = document.querySelectorAll('.social-links a');
    
    socialLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        
        let platform = '';
        if (href.includes('facebook.com')) platform = 'facebook';
        else if (href.includes('instagram.com')) platform = 'instagram';
        else if (href.includes('twitter.com') || href.includes('x.com')) platform = 'twitter';
        
        if (platform && UTM_CONFIG[platform]) {
            const config = UTM_CONFIG[platform];
            const separator = href.includes('?') ? '&' : '?';
            const utmParams = `utm_source=${config.utm_source}&utm_medium=${config.utm_medium}&utm_campaign=${config.utm_campaign}`;
            
            // Add current page as utm_content for better tracking
            const pageName = document.title.toLowerCase().replace(/\s+/g, '_');
            const fullUTM = `${utmParams}&utm_content=${pageName}`;
            
            link.setAttribute('href', `${href}${separator}${fullUTM}`);
        }
    });
}

/**
 * Track social media clicks for analytics
 */
function trackSocialClicks() {
    const socialLinks = document.querySelectorAll('.social-links a');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const platform = this.getAttribute('aria-label')?.toLowerCase() || 'unknown';
            const href = this.getAttribute('href');
            
            // Google Analytics tracking disabled
            // if (typeof gtag !== 'undefined') {
            //     gtag('event', 'social_click', {
            //         'social_network': platform,
            //         'social_action': 'click',
            //         'social_target': href
            //     });
            // }
            
            // Console log for debugging
            console.log(`Social click tracked: ${platform} - ${href}`);
        });
    });
}

/**
 * Initialize UTM tracking when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    addUTMParameters();
    trackSocialClicks();
});

// Export functions for manual use if needed
window.UTMTracking = {
    addUTMParameters,
    trackSocialClicks,
    UTM_CONFIG
};