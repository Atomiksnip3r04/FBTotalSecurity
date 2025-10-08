/**
 * Third-Party Scripts Loader - Performance Optimized
 * Carica script di terze parti in modo lazy per migliorare LCP e ridurre il blocking
 */

class ThirdPartyLoader {
    constructor() {
        this.loaded = {
            gtag: false,
            fbPixel: false
        };
        this.userInteracted = false;
        this.initInteractionDetection();
    }

    /**
     * Rileva la prima interazione dell'utente
     */
    initInteractionDetection() {
        const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
        const markInteraction = () => {
            this.userInteracted = true;
            events.forEach(event => {
                document.removeEventListener(event, markInteraction, { passive: true });
            });
        };

        events.forEach(event => {
            document.addEventListener(event, markInteraction, { passive: true, once: true });
        });
    }

    /**
     * Carica Google Analytics in modo lazy
     */
    loadGoogleAnalytics() {
        if (this.loaded.gtag) return;

        // Crea lo script tag
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-K3KTWNJ5CQ';
        
        script.onload = () => {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            gtag('config', 'G-K3KTWNJ5CQ', {
                send_page_view: false,
                transport_type: 'beacon',
                allow_google_signals: false,
                allow_ad_personalization_signals: false,
                anonymize_ip: true,
                cookie_flags: 'SameSite=None;Secure'
            });
            
            // Invia page view manualmente
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href
            });
            
            this.loaded.gtag = true;
        };

        document.head.appendChild(script);
    }

    /**
     * Carica Facebook Pixel in modo lazy
     */
    loadFacebookPixel() {
        if (this.loaded.fbPixel) return;

        const script = document.createElement('script');
        script.async = true;
        script.src = 'js/facebook-pixel-optimized.js';
        script.onload = () => {
            this.loaded.fbPixel = true;
        };

        document.head.appendChild(script);
    }

    /**
     * Inizializza il caricamento lazy di tutti gli script
     */
    init() {
        // Carica dopo la prima interazione o dopo 3 secondi
        const loadScripts = () => {
            this.loadGoogleAnalytics();
            this.loadFacebookPixel();
        };

        if (this.userInteracted) {
            loadScripts();
        } else {
            // Fallback: carica dopo 3 secondi se nessuna interazione
            setTimeout(loadScripts, 3000);
        }
    }
}

// Inizializza il loader dopo il DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const loader = new ThirdPartyLoader();
        // Ritarda l'inizializzazione per non bloccare il rendering
        requestIdleCallback ? requestIdleCallback(() => loader.init()) : setTimeout(() => loader.init(), 1);
    });
} else {
    const loader = new ThirdPartyLoader();
    requestIdleCallback ? requestIdleCallback(() => loader.init()) : setTimeout(() => loader.init(), 1);
}
