/**
 * Facebook Pixel Analytics Implementation - Performance Optimized
 * Implementazione ottimizzata del Meta Pixel per FB Total Security
 * Ottimizzato per Google PageSpeed e Core Web Vitals
 */

class FacebookPixelOptimized {
    constructor() {
        this.pixelId = '901001165949446';
        this.isLoaded = false;
        this.eventQueue = [];
        this.loadTimeout = null;
        
        // Inizializza il caricamento lazy
        this.initLazyLoading();
    }
    
    /**
     * Inizializza il caricamento lazy del pixel
     * Carica solo quando necessario per migliorare le performance
     */
    initLazyLoading() {
        // Carica immediatamente se l'utente interagisce con la pagina
        const interactionEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        
        const loadPixel = () => {
            if (!this.isLoaded) {
                this.loadFacebookPixel();
                // Rimuovi i listener dopo il caricamento
                interactionEvents.forEach(event => {
                    document.removeEventListener(event, loadPixel, { passive: true });
                });
            }
        };
        
        // Aggiungi listener per interazioni utente
        interactionEvents.forEach(event => {
            document.addEventListener(event, loadPixel, { passive: true });
        });
        
        // Fallback: carica dopo 3 secondi se nessuna interazione
        this.loadTimeout = setTimeout(() => {
            if (!this.isLoaded) {
                this.loadFacebookPixel();
            }
        }, 3000);
    }
    
    /**
     * Carica il Facebook Pixel in modo asincrono
     */
    loadFacebookPixel() {
        if (this.isLoaded) return;
        
        // Cancella il timeout se presente
        if (this.loadTimeout) {
            clearTimeout(this.loadTimeout);
        }
        
        // Facebook Pixel Base Code ottimizzato
        !function(f,b,e,v,n,t,s) {
            if(f.fbq) return;
            n = f.fbq = function() {
                n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments)
            };
            if(!f._fbq) f._fbq = n;
            n.push = n; n.loaded = !0; n.version = '2.0';
            n.queue = []; t = b.createElement(e); t.async = !0;
            t.src = v; s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)
        }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        
        // Inizializza il pixel
        fbq('init', this.pixelId);
        
        // Disabilita esplicitamente server-side tracking e CAPIG per evitare errori di timeout
        fbq('set', 'autoConfig', false, this.pixelId);
        
        // Processa gli eventi in coda
        this.processQueuedEvents();
        
        this.isLoaded = true;
    }
    
    /**
     * Processa gli eventi che erano in coda prima del caricamento
     */
    processQueuedEvents() {
        while (this.eventQueue.length > 0) {
            const event = this.eventQueue.shift();
            this.executeEvent(event);
        }
    }
    
    /**
     * Esegue un evento Facebook Pixel
     */
    executeEvent(event) {
        if (this.isLoaded && window.fbq) {
            if (event.type === 'track') {
                fbq('track', event.eventName, event.parameters);
            } else if (event.type === 'trackCustom') {
                fbq('trackCustom', event.eventName, event.parameters);
            }
        }
    }
    
    /**
     * Traccia un evento (con coda se il pixel non è ancora caricato)
     */
    track(eventName, parameters = {}) {
        const event = {
            type: 'track',
            eventName: eventName,
            parameters: parameters
        };
        
        if (this.isLoaded && window.fbq) {
            this.executeEvent(event);
        } else {
            this.eventQueue.push(event);
            // Forza il caricamento se non già iniziato
            if (!this.isLoaded) {
                this.loadFacebookPixel();
            }
        }
    }
    
    /**
     * Traccia un evento personalizzato
     */
    trackCustom(eventName, parameters = {}) {
        const event = {
            type: 'trackCustom',
            eventName: eventName,
            parameters: parameters
        };
        
        if (this.isLoaded && window.fbq) {
            this.executeEvent(event);
        } else {
            this.eventQueue.push(event);
            if (!this.isLoaded) {
                this.loadFacebookPixel();
            }
        }
    }
}

// Inizializza il pixel ottimizzato
const fbPixelOptimized = new FacebookPixelOptimized();

// Esponi le funzioni globalmente per compatibilità
window.fbPixelEvents = {
    // Traccia visualizzazione contenuto
    trackViewContent: function(contentName, contentCategory) {
        fbPixelOptimized.track('ViewContent', {
            content_name: contentName,
            content_category: contentCategory,
            content_type: 'product'
        });
    },
    
    // Traccia lead generation (form contatti)
    trackLead: function(contentName) {
        fbPixelOptimized.track('Lead', {
            content_name: contentName,
            content_category: 'security_services'
        });
    },
    
    // Traccia interesse per servizio specifico
    trackInterest: function(serviceName) {
        fbPixelOptimized.trackCustom('ServiceInterest', {
            service_name: serviceName,
            content_category: 'security_services'
        });
    },
    
    // Traccia click su pulsante contatto
    trackContact: function(contactMethod, serviceName) {
        fbPixelOptimized.trackCustom('Contact', {
            contact_method: contactMethod,
            service_name: serviceName,
            content_category: 'security_services'
        });
    },
    
    // Traccia download brochure
    trackDownload: function(fileName, serviceName) {
        fbPixelOptimized.trackCustom('Download', {
            file_name: fileName,
            service_name: serviceName,
            content_category: 'security_services'
        });
    }
};

// Traccia automaticamente PageView quando il pixel è caricato
document.addEventListener('DOMContentLoaded', function() {
    // Ritarda leggermente il PageView per migliorare LCP
    setTimeout(() => {
        fbPixelOptimized.track('PageView');
        
        // Traccia eventi specifici per pagina
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('allarmi.html')) {
            fbPixelOptimized.track('ViewContent', {
                content_name: 'Sistemi Allarme',
                content_category: 'security_services'
            });
        } else if (currentPage.includes('nebbiogeni.html')) {
            fbPixelOptimized.track('ViewContent', {
                content_name: 'Sistemi Nebbiogeni',
                content_category: 'security_services'
            });
        } else if (currentPage.includes('serramenti.html')) {
            fbPixelOptimized.track('ViewContent', {
                content_name: 'Serramenti di Sicurezza',
                content_category: 'security_services'
            });
        } else if (currentPage.includes('sorveglianza.html')) {
            fbPixelOptimized.track('ViewContent', {
                content_name: 'Sistemi Videosorveglianza',
                content_category: 'security_services'
            });
        } else if (currentPage.includes('chi-siamo.html')) {
            fbPixelOptimized.track('ViewContent', {
                content_name: 'Chi Siamo',
                content_category: 'about_page'
            });
        }
    }, 100);
});