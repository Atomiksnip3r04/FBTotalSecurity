/**
 * Facebook Pixel Analytics Implementation
 * Implementazione del Meta Pixel per FB Total Security
 * Seguendo le best practices di Meta per il 2024
 */

// Facebook Pixel Base Code
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

// Inizializza il pixel con l'ID specifico
// NOTA: ID pixel aggiornato per FB Total Security
fbq('init', '901001165949446');

// Track automatico della PageView
fbq('track', 'PageView');

// Funzioni per eventi personalizzati
window.fbPixelEvents = {
    // Traccia visualizzazione contenuto
    trackViewContent: function(contentName, contentCategory) {
        fbq('track', 'ViewContent', {
            content_name: contentName,
            content_category: contentCategory,
            content_type: 'product'
        });
    },
    
    // Traccia lead generation (form contatti)
    trackLead: function(contentName) {
        fbq('track', 'Lead', {
            content_name: contentName,
            content_category: 'security_services'
        });
    },
    
    // Traccia interesse per servizio specifico
    trackInterest: function(serviceName) {
        fbq('trackCustom', 'ServiceInterest', {
            service_name: serviceName,
            content_category: 'security_services'
        });
    },
    
    // Traccia contatto telefonico
    trackPhoneContact: function() {
        fbq('trackCustom', 'PhoneContact', {
            content_category: 'contact'
        });
    },
    
    // Traccia richiesta preventivo
    trackQuoteRequest: function(serviceName) {
        fbq('trackCustom', 'QuoteRequest', {
            service_name: serviceName,
            content_category: 'quote'
        });
    }
};

// Event listeners per tracciamento automatico
document.addEventListener('DOMContentLoaded', function() {
    // Traccia click sui link di contatto
    const contactLinks = document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]');
    contactLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (this.href.startsWith('tel:')) {
                window.fbPixelEvents.trackPhoneContact();
            } else if (this.href.startsWith('mailto:')) {
                window.fbPixelEvents.trackLead('email_contact');
            }
        });
    });
    
    // Traccia submit dei form
    const forms = document.querySelectorAll('form');
    forms.forEach(function(form) {
        form.addEventListener('submit', function() {
            const formName = this.getAttribute('name') || this.getAttribute('id') || 'contact_form';
            window.fbPixelEvents.trackLead(formName);
        });
    });
    
    // Traccia scroll profondo (75% della pagina) - Ottimizzato per evitare forced reflow
    let scrollTracked = false;
    let cachedBodyHeight = null;
    let ticking = false;
    
    // Cache dell'altezza del body per evitare letture DOM ripetute - Ottimizzato per forced reflow
    function updateBodyHeight() {
        // Usa il sistema di batching DOM per evitare forced reflow
        if (window.domOperations && window.domOperations.read) {
            window.domOperations.read(() => {
                cachedBodyHeight = document.body.offsetHeight;
            });
        } else {
            // Fallback per compatibilità
            cachedBodyHeight = document.body.offsetHeight;
        }
    }
    
    // Inizializza cache altezza
    updateBodyHeight();
    
    // Aggiorna cache su resize (debounced)
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateBodyHeight, 250);
    });
    
    function checkScrollDepth() {
        if (!scrollTracked && cachedBodyHeight && 
            (window.scrollY + window.innerHeight) >= cachedBodyHeight * 0.75) {
            fbq('trackCustom', 'DeepScroll', {
                content_category: 'engagement'
            });
            scrollTracked = true;
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(checkScrollDepth);
            ticking = true;
        }
    });
    
    // Traccia tempo di permanenza (30 secondi)
    setTimeout(function() {
        fbq('trackCustom', 'TimeOnSite30s', {
            content_category: 'engagement'
        });
    }, 30000);
});

// Gestione privacy e consenso
window.fbPixelConsent = {
    // Verifica se il consenso è stato dato
    hasConsent: function() {
        // Implementare logica di consenso se necessario
        // Per ora ritorna true, ma dovrebbe essere integrato con il sistema di consenso
        return true;
    },
    
    // Revoca consenso
    revokeConsent: function() {
        // Disabilita il tracking
        fbq('consent', 'revoke');
    },
    
    // Concede consenso
    grantConsent: function() {
        fbq('consent', 'grant');
    }
};

console.log('Facebook Pixel Analytics caricato correttamente per FB Total Security');