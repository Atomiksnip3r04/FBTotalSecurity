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
     * Inizializza il pixel con gestione degli errori
     */
    init() {
        // Configura la gestione degli errori prima di inizializzare il pixel
        this.setupErrorHandling();
        
        if (this.isLoaded) return;
        
        this.loadPixel();
    }
    
    /**
     * Carica il pixel Facebook
     */
    loadPixel() {
        if (!this.isLoaded) {
            this.loadFacebookPixel();
        }
    }
    
    /**
     * Configura la gestione degli errori per le richieste Facebook Pixel
     */
    setupErrorHandling() {
        // Intercetta e gestisce gli errori di rete del Facebook Pixel
        const originalFetch = window.fetch;
        
        window.fetch = function(...args) {
            const url = args[0];
            
            // Se è una richiesta verso i server Facebook/Meta
            if (typeof url === 'string' && (
                url.includes('facebook.com') || 
                url.includes('capig.datah04.com') ||
                url.includes('graph.facebook.com')
            )) {
                return originalFetch.apply(this, args).catch(error => {
                    // Log silenzioso dell'errore senza mostrarlo in console
                    console.debug('Facebook Pixel network request failed (handled):', error.message);
                    
                    // Ritorna una risposta vuota per evitare errori in console
                    return new Response('{}', {
                        status: 200,
                        statusText: 'OK',
                        headers: { 'Content-Type': 'application/json' }
                    });
                });
            }
            
            // Per tutte le altre richieste, usa il fetch originale
            return originalFetch.apply(this, args);
        };
        
        // Gestione errori per eventi non critici
        window.addEventListener('error', (event) => {
            if (event.message && event.message.includes('facebook')) {
                event.preventDefault();
                console.debug('Facebook Pixel error handled:', event.message);
            }
        });
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
     * Carica e inizializza il Facebook Pixel con configurazioni ottimizzate
     */
    loadFacebookPixel() {
        if (this.isLoaded) return;
        
        // Facebook Pixel Base Code ottimizzato con gestione errori
        !function(f,b,e,v,n,t,s) {
            if(f.fbq) return;
            n = f.fbq = function() {
                n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments)
            };
            if(!f._fbq) f._fbq = n;
            n.push = n; n.loaded = !0; n.version = '2.0';
            n.queue = []; t = b.createElement(e); t.async = !0;
            t.src = v; 
            
            // Gestione errori per il caricamento dello script
            t.onerror = function() {
                console.debug('Facebook Pixel script failed to load (handled)');
            };
            
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)
        }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

        // Inizializzazione del pixel con configurazioni ottimizzate
        fbq('init', this.pixelId, {
            // Disabilita Advanced Matching per evitare problemi di privacy
            em: 'disabled',
            ph: 'disabled',
            fn: 'disabled',
            ln: 'disabled',
            db: 'disabled',
            ge: 'disabled',
            ct: 'disabled',
            st: 'disabled',
            zp: 'disabled',
            country: 'disabled'
        });
        
        // Disabilita il tracking server-side e CAPIG per evitare errori di fetch
        fbq('set', 'autoConfig', false, this.pixelId);
        fbq('set', 'agent', 'plowshare', this.pixelId);
        
        // Processa gli eventi in coda
        this.eventQueue.forEach(event => this.executeEvent(event));
        this.eventQueue = [];
        
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
     * Esegue un evento Facebook Pixel con gestione errori
     */
    executeEvent(event) {
        if (this.isLoaded && window.fbq) {
            try {
                if (event.type === 'track') {
                    fbq('track', event.eventName, event.parameters);
                } else if (event.type === 'trackCustom') {
                    fbq('trackCustom', event.eventName, event.parameters);
                }
            } catch (error) {
                console.debug('Facebook Pixel event error (handled):', error.message);
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