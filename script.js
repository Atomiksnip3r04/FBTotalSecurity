
// DOM Query Cache per ridurre forced reflow
const domCache = new Map();
const cacheTimeout = 16; // ~60fps

function getCachedDOMProperty(element, property, getter) {
    const key = `${element.tagName}-${element.className}-${property}`;
    const cached = domCache.get(key);
    
    if (cached && Date.now() - cached.timestamp < cacheTimeout) {
        return cached.value;
    }
    
    const value = getter();
    domCache.set(key, { value, timestamp: Date.now() });
    return value;
}

// Batch DOM reads and writes
const domOperations = {
    reads: [],
    writes: [],
    
    read(fn) {
        this.reads.push(fn);
        this.schedule();
    },
    
    write(fn) {
        this.writes.push(fn);
        this.schedule();
    },
    
    schedule() {
        if (this.scheduled) return;
        this.scheduled = true;
        
        requestAnimationFrame(() => {
            // Execute all reads first
            this.reads.forEach(fn => fn());
            this.reads = [];
            
            // Then execute all writes
            this.writes.forEach(fn => fn());
            this.writes = [];
            
            this.scheduled = false;
        });
    },
    
    scheduled: false
};
// Utility functions to prevent forced reflows
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initContactForm();
    initHeaderScroll();
    initServiceCards();
    initLanguageSelector();
});

// Mobile Menu Functionality - Optimized with cached DOM elements
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body; // Cache body element
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking on a link - cache nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    }
}

// Smooth Scrolling for Navigation Links
// Smooth Scrolling for Navigation Links - Optimized to reduce layout thrashing
/**
 * VERSIONE MIGLIORATA: initSmoothScrolling
 * Usa window.scrollTo che è il metodo standard e più pulito.
 * La lettura di getBoundingClientRect() qui è sicura perché avviene solo
 * su un'azione dell'utente (click), non in un loop o in un evento di scroll.
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    let cachedHeaderHeight = 80; // Inizializza con un valore di default

    const headerElement = document.querySelector('.header');
    if (headerElement && window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                cachedHeaderHeight = entry.contentRect.height;
            }
        });
        resizeObserver.observe(headerElement);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - cachedHeaderHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                updateActiveNavLink(targetId);
            }
        });
    });
}

// Update Active Navigation Link - Optimized with cached nav links
let cachedNavLinksForUpdate = null;

function updateActiveNavLink(targetId) {
    // Cache nav links on first call to avoid repeated DOM queries
    if (!cachedNavLinksForUpdate) {
        cachedNavLinksForUpdate = document.querySelectorAll('.nav-link');
    }
    
    cachedNavLinksForUpdate.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// Header Scroll Effect - Optimized version as per pagespeed.txt recommendations
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    // Simplified scroll handling with throttled scroll listener
    let ticking = false;
    let lastScrollY = 0;
    
    const handleScroll = () => {
        const scrollY = window.pageYOffset;
        
        // Add/remove scrolled class at 100px threshold
        header.classList.toggle('scrolled', scrollY > 100);
        
        // Hide/show header based on scroll direction at 200px threshold
        if (scrollY > 200) {
            if (scrollY > lastScrollY) {
                // Scrolling down - hide header
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - show header
                header.style.transform = 'translateY(0)';
            }
        } else {
            // Always show header when near top
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = scrollY;
        ticking = false;
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
        }
    }, { passive: true });
    
    // Simplified IntersectionObserver for active section detection - optimized per pagespeed.txt
    const sections = document.querySelectorAll('section[id]');
    const cachedNavLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
    
    if (sections.length > 0 && cachedNavLinks.length > 0) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    
                    // Update active nav links - simplified approach
                    cachedNavLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            rootMargin: '-20% 0px -60% 0px' // Simplified options - removed complex threshold array
        });
        
        // Observe all sections
        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }
}

// Function removed - replaced with optimized version in initHeaderScroll

// script.js

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        // QUI È LA CORREZIONE: Assicurati che ci siano gli spazi tra i valori.
        rootMargin: '0px 0px -50px 0px' 
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .feature, .contact-item, .service-text, .service-image');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Service Cards Hover Effects
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Contact Form Handling
function initContactForm() {
    const contactForms = document.querySelectorAll('.contact-form form, form');
    
    contactForms.forEach(contactForm => {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Validate form
            if (validateForm(formObject)) {
                // Create mailto link with form data (simplified to avoid length issues)
                const emailTo = 'postmaster@fbtotalsecurity.com';
                const subject = encodeURIComponent('Richiesta informazioni - FB Total Security');
                
                let body = `Nome: ${formObject.nome || 'Non specificato'}\n`;
                body += `Email: ${formObject.email || 'Non specificato'}\n`;
                body += `Telefono: ${formObject.telefono || 'Non specificato'}\n`;
                
                if (formObject.servizio) {
                    body += `Servizio: ${formObject.servizio}\n`;
                }
                
                if (formObject.messaggio) {
                    body += `Messaggio: ${formObject.messaggio}\n`;
                }
                
                const encodedBody = encodeURIComponent(body);
                const mailtoLink = `mailto:${emailTo}?subject=${subject}&body=${encodedBody}`;
                
                // Try multiple methods to open email client
                try {
                    // Method 1: window.open
                    const mailWindow = window.open(mailtoLink, '_blank');
                    if (!mailWindow) {
                        // Method 2: direct location change
                        window.location.href = mailtoLink;
                    }
                } catch (error) {
                    // Method 3: temporary link element as fallback
                    const tempLink = document.createElement('a');
                    tempLink.href = mailtoLink;
                    tempLink.target = '_blank';
                    tempLink.style.display = 'none';
                    document.body.appendChild(tempLink);
                    tempLink.click();
                    document.body.removeChild(tempLink);
                }
                
                // Show success message
                showNotification('Client di posta aperto! Controlla la tua applicazione email.', 'success');
            }
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    });
}

// Form Validation
function validateForm(formData) {
    let isValid = true;
    const errors = [];
    
    // Required fields validation - check only fields that exist in the form
    const basicRequiredFields = ['nome', 'email'];
    basicRequiredFields.forEach(field => {
        if (!formData[field] || formData[field].trim() === '') {
            errors.push(`Il campo ${field} è obbligatorio`);
            isValid = false;
        }
    });
    
    // Check if servizio field exists and is required
    const servicioField = document.querySelector('#servizio');
    if (servicioField && servicioField.hasAttribute('required')) {
        if (!formData.servizio || formData.servizio.trim() === '') {
            errors.push('Il campo servizio è obbligatorio');
            isValid = false;
        }
    }
    
    // Check if telefono field exists and is required
    const telefonoField = document.querySelector('#telefono');
    if (telefonoField && telefonoField.hasAttribute('required')) {
        if (!formData.telefono || formData.telefono.trim() === '') {
            errors.push('Il campo telefono è obbligatorio');
            isValid = false;
        }
    }
    
    // Email validation
    if (formData.email && !isValidEmail(formData.email)) {
        errors.push('Inserisci un indirizzo email valido');
        isValid = false;
    }
    
    // Phone validation (only if phone is provided)
    if (formData.telefono && formData.telefono.trim() !== '' && !isValidPhone(formData.telefono)) {
        errors.push('Inserisci un numero di telefono valido');
        isValid = false;
    }
    
    // Privacy checkbox validation (only if privacy checkbox exists)
    const privacyField = document.querySelector('#privacy');
    if (privacyField && !formData.privacy) {
        errors.push('Devi accettare il trattamento dei dati personali');
        isValid = false;
    }
    
    if (!isValid) {
        showNotification(errors.join('<br>'), 'error');
    }
    
    return isValid;
}

// Validate Individual Field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error state
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Check if required field is empty
    if (field.hasAttribute('required') && value === '') {
        isValid = false;
        errorMessage = 'Questo campo è obbligatorio';
    }
    
    // Email validation
    if (field.type === 'email' && value !== '' && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Inserisci un indirizzo email valido';
    }
    
    // Phone validation
    if (field.type === 'tel' && value !== '' && !isValidPhone(value)) {
        isValid = false;
        errorMessage = 'Inserisci un numero di telefono valido';
    }
    
    if (!isValid) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        errorDiv.style.color = '#ff6b6b';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '0.5rem';
        field.parentNode.appendChild(errorDiv);
    }
    
    return isValid;
}

// Email Validation Helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone Validation Helper
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = message;
    
    // Styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        maxWidth: '400px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // Type-specific styles
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #4caf50, #45a049)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #2196f3, #1976d2)';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Click to dismiss
    notification.addEventListener('click', function() {
        this.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        }, 300);
    });
}

// Utility Functions - Removed duplicate functions (already defined at top of file)

// Lazy Loading for Images (if needed in future)
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    }, { rootMargin: '0px 0px 50px 0px' });
    
    images.forEach(img => imageObserver.observe(img));
}

// Performance Monitoring
// Performance monitoring removed to eliminate deprecated API warnings

// Language Translation System
const translations = {
    it: {
        // Navigation
        'nav-home': 'Home',
        'nav-services': 'Servizi',
        'nav-about': 'Chi Siamo',
        'nav-contact': 'Contatti',
        'nav-quote': 'Preventivo Gratuito',
        'tagline': 'Creatori di Sicurezza',
        'nav-nebbiogeni': 'Nebbiogeni',
        'nav-serramenti': 'Serramenti',
        'nav-sorveglianza': 'Sorveglianza',
        'nav-allarmi': 'Allarmi',
        'nav-chi-siamo': 'Chi siamo',
        'nav-contatti': 'Contatti',
        
        // Hero section
        'hero-tagline': 'La tua sicurezza è la nostra priorità',
        'hero-title': 'Soluzioni di Sicurezza Avanzate per la Tua Protezione',
        'hero-subtitle': 'Sistemi nebbiogeni, serramenti blindati, videosorveglianza e allarmi intelligenti. Proteggi ciò che conta di più con tecnologie all\'avanguardia.',
        'hero-cta': 'Scopri i Nostri Servizi',
        'hero-cta-primary': 'Scopri i Nostri Servizi',
        'hero-cta-secondary': 'Richiedi Preventivo',
        
        // Mission Section
        'mission-title': 'La tua sicurezza, la nostra missione',
        'mission-description': 'In un mondo in continua evoluzione, la protezione dei tuoi beni e dei tuoi cari è una priorità. FB Security nasce con l\'obiettivo di offrirti una tranquillità totale, grazie a un servizio di sicurezza multisettoriale che si adatta a ogni tua esigenza. Dalla vigilanza armata ai sistemi di videosorveglianza più avanzati, dalla protezione fisica di inferriate e grate ai moderni nebbiogeni, ti offriamo una Protezione a 360°. Siamo il tuo partner di fiducia per un\'esistenza sicura, giorno e notte.',
        
        // Services Overview
        'services-title': 'I Nostri Servizi di Sicurezza',
        'services-subtitle': 'Soluzioni complete per ogni esigenza di protezione',
        'service-nebbiogeni-title': 'Sistemi Nebbiogeni',
        'service-nebbiogeni-desc': 'Protezione istantanea con nebbia densa che neutralizza qualsiasi intrusione',
        'service-serramenti-title': 'Serramenti Blindati',
        'service-serramenti-desc': 'Porte e finestre ad alta sicurezza certificate per la massima protezione',
        'service-sorveglianza-title': 'Videosorveglianza',
        'service-sorveglianza-desc': 'Sistemi di monitoraggio avanzati con intelligenza artificiale',
        'service-allarmi-title': 'Sistemi di Allarme',
        'service-allarmi-desc': 'Allarmi intelligenti connessi per una protezione 24/7',
        'services-cta': 'Richiedi Consulenza Gratuita',
        'service-nebbiogeni-link': 'Sistemi Nebbiogeni Milano',
        'service-serramenti-link': 'Serramenti Blindati Milano',
        'service-sorveglianza-link': 'Videosorveglianza Milano',
        'service-allarmi-link': 'Sistemi Allarme Milano',
        
        // Partnership
        'partnership-title': 'I Nostri Partner Tecnologici',
        'partnership-subtitle': 'Collaboriamo con i leader mondiali della sicurezza per offrirti le migliori soluzioni',
        'partnerships-title': 'I Nostri Partner Tecnologici',
        'partnerships-subtitle': 'Collaboriamo con i leader mondiali della sicurezza per offrirti le migliori soluzioni',
        
        // Nebbiogeni Section
        'nebbiogeni-title': 'Sistemi Nebbiogeni Avanzati',
        'nebbiogeni-subtitle': 'Protezione istantanea e invisibile',
        'nebbiogeni-desc': 'I nostri sistemi nebbiogeni rappresentano l\'evoluzione della sicurezza passiva. In caso di intrusione, il sistema rilascia istantaneamente una nebbia densa e sicura che riduce la visibilità a zero, costringendo gli intrusi alla fuga immediata.',
        'nebbiogeni-feature-1': 'Attivazione in 2-3 secondi',
        'nebbiogeni-feature-2': 'Nebbia sicura e atossica',
        'nebbiogeni-feature-3': 'Copertura fino a 500m²',
        'nebbiogeni-feature-4': 'Integrazione con sistemi esistenti',
        'nebbiogeni-cta': 'Scopri i Sistemi Nebbiogeni',
        
        // Serramenti Section
        'serramenti-title': 'Serramenti di Sicurezza Blindati',
        'serramenti-subtitle': 'Barriera fisica impenetrabile',
        'serramenti-desc': 'Porte e finestre blindate certificate secondo le normative europee più severe. Ogni serramento è progettato su misura per garantire il massimo livello di protezione senza compromettere l\'estetica della tua abitazione.',
        'serramenti-feature-1': 'Antieffrazione fino a Classe 6 (UNI EN 1627-1630)',
        'serramenti-feature-2': 'Produzione interna (ciclo chiuso)',
        'serramenti-feature-3': 'Personalizzabile (su misura, varie classi e modelli)',
        'serramenti-feature-4': 'Installazione senza opere murarie',
        'serramenti-feature-5': 'Certificazione ISO 9001:2015',
        'serramenti-feature-6': 'Design moderno (finiture, colori, forme speciali)',
        'serramenti-feature-7': 'Serrature a cilindro europeo o doppia mappa',
        'serramenti-feature-8': 'Sistemi brevettati',
        'serramenti-feature-9': 'Struttura blindata (acciaio, tubolari rinforzati, piatti antitaglio)',
        'serramenti-feature-10': 'Anti-corrosione (verniciatura a forno e primer)',
        'serramenti-feature-11': 'Sopralluogo e consulenza dedicata',
        'serramenti-feature-12': 'Assistenza tecnica',
        'serramenti-feature-13': 'Supporto post-vendita',
        'serramenti-cta': 'Configura i Tuoi Serramenti',
        
        // Sorveglianza Section
        'sorveglianza-title': 'Sistemi di Videosorveglianza Avanzati',
        'sorveglianza-subtitle': 'Occhi intelligenti che non dormono mai',
        'sorveglianza-desc': 'Telecamere di ultima generazione con intelligenza artificiale integrata per il riconoscimento automatico di situazioni anomale. Monitoraggio remoto 24/7 con notifiche istantanee su smartphone.',
        'sorveglianza-feature-1': 'Videosorveglianza e videoanalisi intelligente',
        'sorveglianza-feature-2': 'Controllo remoto da app e centrale operativa',
        'sorveglianza-feature-3': 'Gestione eventi con blockchain',
        'sorveglianza-feature-4': 'Intervento rapido e pattuglie armate',
        'sorveglianza-feature-5': 'Servizio 24h/365',
        'sorveglianza-feature-6': 'Antimanomissione',
        'sorveglianza-feature-7': 'Antirapina/antipanico',
        'sorveglianza-feature-8': 'Collegabile al 112 (ops. pubbliche)',
        'sorveglianza-feature-9': 'Telesoccorso',
        'sorveglianza-feature-10': 'Sistemi antijammer',
        'sorveglianza-feature-11': 'Modulare su richiesta cliente',
        'sorveglianza-feature-12': 'Supporto e assistenza h24',
        'sorveglianza-feature-13': 'Consulenza sicurezza personalizzata',
        'sorveglianza-cta': 'Progetta il Tuo Sistema',
        
        // Allarmi Section
        'allarmi-title': 'Sistemi di Allarme Intelligenti',
        'allarmi-subtitle': 'Protezione smart e connessa',
        'allarmi-desc': 'Centrali di allarme di nuova generazione con sensori wireless e connettività IoT. Controllo completo tramite app mobile con notifiche push istantanee e integrazione con servizi di vigilanza.',
        'allarmi-feature-1': 'Protezione volumetrica e perimetrale avanzata',
        'allarmi-feature-2': 'Controllo ingressi con sensore predinamico',
        'allarmi-feature-3': 'Sistema antiaggressione e antipanico integrato',
        'allarmi-feature-4': 'Modem GSM con APP dedicata e sintesi vocale',
        'allarmi-feature-5': 'Collegamento diretto al 112 e telesoccorso',
        'allarmi-feature-6': 'Sistema antijammer e antimanomissione',
        'allarmi-feature-7': 'Modulabile e trasferibile secondo necessità',
        'allarmi-cta': 'Personalizza il Tuo Allarme',
        
        // Nebbiogeni Page Translations
        'nebbiogeni-hero-subtitle': 'Protezione istantanea con nebulizzazione di sicurezza. Blocca i ladri in pochi secondi con la tecnologia più avanzata.',
        'nebbiogeni-hero-cta1': 'Scopri di Più',
        'nebbiogeni-hero-cta2': 'Richiedi Preventivo',
        'nebbiogeni-tech-title': 'Tecnologia Nebbiogeni Avanzata',
        'nebbiogeni-tech-description': 'I nostri sistemi nebbiogeni rappresentano la frontiera più avanzata nella protezione antifurto. In caso di intrusione, il sistema rilascia istantaneamente una densa nebbia che riduce la visibilità a zero, costringendo i malintenzionati ad abbandonare immediatamente i locali.',
        'nebbiogeni-feature-1': 'Nebbiogeno antintrusione certificato EN 50131-8:2019',
        'nebbiogeni-feature-2': 'Avvio rapido (erogazione nebbia in pochi secondi)',
        'nebbiogeni-feature-3': 'Protezione volumetrica',
        'nebbiogeni-feature-4': 'Fluido atossico e innocuo (certificato e senza residui)',
        'nebbiogeni-feature-5': 'Sistemi antimanomissione',
        'nebbiogeni-feature-6': 'Manutenzione programmata inclusa',
        'nebbiogeni-feature-7': 'Certificazioni CE e conformità normative',
        'nebbiogeni-feature-8': 'Garanzia estesa fino a 2 anni',
        'nebbiogeni-feature-9': 'Modulabile per piccoli/grandi ambienti',
        'nebbiogeni-feature-10': 'Ugelli orientabili',
        'nebbiogeni-feature-11': 'Installazione semplificata',
        'nebbiogeni-feature-12': 'Tecnologia brevettata (caldaia layer, pompa FOG STORM)',
        'nebbiogeni-feature-13': 'Supporto pre e post-vendita',
        'nebbiogeni-cta-vantaggi': 'Vantaggi',
        'nebbiogeni-cta-preventivo': 'Preventivo Gratuito',
        'nebbiogeni-why-title': 'Perché Scegliere i Nebbiogeni',
        'nebbiogeni-why-subtitle': 'La soluzione più efficace per proteggere la tua attività',
        'nebbiogeni-advantage-1-title': 'Attivazione Istantanea',
        'nebbiogeni-advantage-1-desc': 'Il sistema si attiva in meno di 10 secondi, creando immediatamente una barriera impenetrabile di nebbia densa.',
        'nebbiogeni-advantage-2-title': 'Protezione Totale',
        'nebbiogeni-advantage-2-desc': 'Riduce la visibilità a zero rendendo impossibile per i ladri orientarsi e portare a termine il furto.',
        'nebbiogeni-advantage-3-title': 'Completamente Sicuro',
        'nebbiogeni-advantage-3-desc': 'La nebbia è atossica, non danneggia persone, animali o oggetti. Certificata per uso in ambienti chiusi.',
        'nebbiogeni-advantage-4-title': 'Controllo Remoto',
        'nebbiogeni-advantage-4-desc': 'Gestisci il sistema da remoto tramite app dedicata. Ricevi notifiche in tempo reale.',
        'nebbiogeni-advantage-5-title': 'Manutenzione Inclusa',
        'nebbiogeni-advantage-5-desc': 'Servizio di manutenzione programmata e assistenza tecnica 24/7 per garantire sempre il massimo funzionamento.',
        'nebbiogeni-advantage-6-title': 'Risparmio Assicurativo',
        'nebbiogeni-advantage-6-desc': 'Molte compagnie assicurative riconoscono sconti significativi per immobili protetti da sistemi nebbiogeni.',
        'urfog-official-docs-title': 'Documentazione Ufficiale UR FOG',
        'urfog-official-docs-desc': 'Accedi alla documentazione tecnica completa e alle specifiche dei sistemi UR FOG',
        'urfog-cert-btn-title': 'Certificazioni UR FOG',
        'urfog-cert-btn-desc': 'Visualizza tutte le certificazioni e conformità normative dei prodotti UR FOG',
        'urfog-warranty-btn-title': 'Garanzie UR FOG',
        'urfog-warranty-btn-desc': 'Informazioni complete sulla garanzia e assistenza post-vendita UR FOG',
        'xecur-official-docs-title': 'Documentazione Ufficiale XECUR',
        'xecur-official-docs-desc': 'Accedi alla documentazione tecnica completa e alle specifiche dei sistemi XECUR',
        'xecur-cert-btn-title': 'Certificazioni XECUR',
        'xecur-cert-btn-desc': 'Visualizza tutte le certificazioni e la conformità normativa dei prodotti XECUR',
        'xecur-quality-btn-title': 'Qualità XECUR',
        'xecur-quality-btn-desc': 'Informazioni complete sui standard di qualità e l\'eccellenza XECUR',
        'civis-official-docs-title': 'Documentazione Ufficiale CIVIS',
        'civis-official-docs-desc': 'Accedi alla documentazione tecnica completa e alle specifiche dei sistemi CIVIS',
        'civis-cert-btn-title': 'Certificazioni CIVIS',
        'civis-cert-btn-desc': 'Visualizza tutte le certificazioni e la conformità normativa dei prodotti CIVIS',
        'nebbiogeni-applications-title': 'Applicazioni Ideali',
        'nebbiogeni-applications-description': 'I sistemi nebbiogeni sono la soluzione perfetta per una vasta gamma di ambienti commerciali e residenziali che richiedono il massimo livello di protezione.',
        'nebbiogeni-app-1': 'Negozi e centri commerciali',
        'nebbiogeni-app-2': 'Gioiellerie e oreficerie',
        'nebbiogeni-app-3': 'Banche e istituti di credito',
        'nebbiogeni-app-4': 'Farmacie e parafarmacie',
        'nebbiogeni-app-5': 'Uffici e studi professionali',
        'nebbiogeni-app-6': 'Magazzini e depositi',
        'nebbiogeni-app-7': 'Abitazioni di pregio',
        'nebbiogeni-app-8': 'Musei e gallerie d\'arte',
        'nebbiogeni-cta-consulenza': 'Richiedi Consulenza',
        'nebbiogeni-cta-servizi': 'Altri Servizi',
        'nebbiogeni-partner-title': 'Il Nostro Partner: UR Fog',
        'nebbiogeni-partner-info-title': 'Informazioni Generali',
        'nebbiogeni-partner-info-desc': 'UR Fog è un\'azienda leader mondiale nel mercato dei sistemi di sicurezza nebbiogeni. I loro sistemi bloccano i ladri in pochi secondi, proteggendo da furti in negozi, aziende, case e banche.',
        'nebbiogeni-partner-services-title': 'Servizi e Innovazione',
        'nebbiogeni-contact-title': 'Richiedi Informazioni',
        'nebbiogeni-contact-description': 'Contattaci per una consulenza completamente gratuita sui sistemi nebbiogeni. I nostri esperti valuteranno le tue esigenze e ti proporranno la soluzione più adatta. Verrai ricontattato telefonicamente da uno dei nostri operatori il più presto possibile.',
        
        // Serramenti Page
        'serramenti-hero-title': 'Serramenti di Sicurezza Blindati',
        'serramenti-hero-subtitle': 'Protezione fisica impenetrabile con design elegante. Porte e finestre blindate certificate per la massima sicurezza.',
        'serramenti-hero-cta1': 'Scopri di Più',
        'serramenti-hero-cta2': 'Richiedi Preventivo',
        'serramenti-products-title': 'Prodotti Principali',
        'serramenti-products-description': 'La nostra gamma completa di serramenti blindati combina sicurezza massima e design raffinato, con soluzioni personalizzate per ogni esigenza abitativa e commerciale.',
        'serramenti-product-1-title': 'Porte Blindate Residenziali',
        'serramenti-product-1-desc': 'Porte blindate certificate classe 3 e 4 con design personalizzabile per abitazioni private.',
        'serramenti-product-2-title': 'Finestre Antieffrazione',
        'serramenti-product-2-desc': 'Finestre con vetri stratificati e telai rinforzati per protezione totale.',
        'serramenti-product-3-title': 'Serramenti Commerciali',
        'serramenti-product-3-desc': 'Soluzioni professionali per negozi, uffici e attività commerciali.',
        'serramenti-tech-title': 'Caratteristiche Tecniche',
        'serramenti-tech-description': 'Ogni serramento è progettato secondo i più alti standard di sicurezza europei, utilizzando materiali di prima qualità e tecnologie all\'avanguardia.',
        'serramenti-tech-1': 'Certificazione antieffrazione classe 4',
        'serramenti-tech-2': 'Serrature europee multipoint',
        'serramenti-tech-3': 'Vetri antisfondamento stratificati',
        'serramenti-tech-4': 'Telai in acciaio rinforzato',
        'serramenti-tech-5': 'Guarnizioni termoacustiche',
        'serramenti-tech-6': 'Cerniere antisollevamento',
        'serramenti-tech-7': 'Defender e rostri di sicurezza',
        'serramenti-tech-8': 'Pannelli coibentati',
        'serramenti-types-title': 'Tipologie di Serramenti',
        'serramenti-types-description': 'Offriamo una vasta gamma di serramenti blindati per soddisfare ogni esigenza di sicurezza e design, dalla residenza privata agli ambienti commerciali più esigenti.',
        'serramenti-type-1': 'Porte blindate per appartamenti',
        'serramenti-type-2': 'Porte blindate per ville',
        'serramenti-type-3': 'Finestre e persiane blindate',
        'serramenti-type-4': 'Serramenti per negozi',
        'serramenti-type-5': 'Porte tagliafuoco certificate',
        'serramenti-type-6': 'Cancelli e recinzioni',
        'serramenti-installation-title': 'Processo di Installazione',
        'serramenti-installation-description': 'Il nostro processo di installazione garantisce precisione millimetrica e rispetto dei tempi, con un servizio completo dalla progettazione al collaudo finale.',
        'serramenti-install-1': 'Sopralluogo e progettazione personalizzata',
        'serramenti-install-2': 'Produzione su misura in fabbrica',
        'serramenti-install-3': 'Installazione professionale certificata',
        'serramenti-install-4': 'Collaudo finale e garanzia',
        'serramenti-cta-consulenza': 'Richiedi Consulenza',
        'serramenti-cta-catalogo': 'Scarica Catalogo',
        'serramenti-partner-title': 'Il Nostro Partner: Xecur Srl',
        'serramenti-partner-info-title': 'Informazioni Generali',
        'serramenti-partner-info-desc': 'Xecur Srl è un\'azienda leader nella produzione di serramenti blindati e sistemi di sicurezza passiva. Con oltre 30 anni di esperienza, garantisce prodotti di altissima qualità certificati secondo le normative europee più severe.',
        'serramenti-partner-services-title': 'Servizi e Innovazioni',
        'serramenti-partner-service-1': 'Progettazione e produzione su misura',
        'serramenti-partner-service-2': 'Certificazioni antieffrazione classe 1-6',
        'serramenti-partner-service-3': 'Ricerca e sviluppo continuo',
        'serramenti-partner-service-4': 'Assistenza tecnica specializzata',
        'serramenti-partner-service-5': 'Garanzia estesa su tutti i prodotti',
        'serramenti-contact-title': 'Richiedi Informazioni',
        'serramenti-contact-description': 'Contattaci per una consulenza completamente gratuita sui serramenti blindati. I nostri esperti valuteranno le tue esigenze e ti proporranno la soluzione più adatta. Verrai ricontattato telefonicamente da uno dei nostri operatori il più presto possibile.',
        'serramenti-form-name': 'Nome e Cognome',
        'serramenti-form-email': 'Email',
        'serramenti-form-phone': 'Telefono',
        'serramenti-form-message': 'Messaggio',
        'serramenti-form-privacy': 'Accetto il trattamento dei dati personali secondo i',
        'serramenti-form-submit': 'Invia Richiesta',
        
        // Sorveglianza Page
        'sorveglianza-hero-title': 'Sistemi di Videosorveglianza Avanzati',
        'sorveglianza-hero-subtitle': 'Protezione intelligente 24/7 con tecnologie di ultima generazione. Monitora e proteggi i tuoi spazi con sistemi di videosorveglianza all\'avanguardia.',
        'sorveglianza-hero-cta1': 'Scopri di Più',
        'sorveglianza-hero-cta2': 'Richiedi Preventivo',
        'sorveglianza-tech-title': 'Tecnologie Avanzate di Sorveglianza',
        'sorveglianza-tech-description': 'I nostri sistemi di videosorveglianza integrano le più moderne tecnologie di intelligenza artificiale e visione computerizzata per offrire una protezione completa e intelligente dei tuoi spazi.',
        'sorveglianza-tech-feature-1': 'Telecamere 4K Ultra HD con zoom ottico',
        'sorveglianza-tech-feature-2': 'Visione notturna avanzata fino a 50 metri',
        'sorveglianza-tech-feature-3': 'Riconoscimento facciale e targhe automatico',
        'sorveglianza-tech-feature-4': 'Analisi comportamentale con AI integrata',
        'sorveglianza-tech-feature-5': 'Storage cloud sicuro e backup automatico',
        'sorveglianza-tech-feature-6': 'Accesso remoto da smartphone e tablet',
        'sorveglianza-tech-cta1': 'Vantaggi',
        'sorveglianza-tech-cta2': 'Preventivo Gratuito',
        'sorveglianza-features-title': 'Caratteristiche Avanzate',
        'sorveglianza-features-subtitle': 'Tecnologie all\'avanguardia per la massima sicurezza',
        'sorveglianza-feature-1-title': 'Risoluzione 4K',
        'sorveglianza-feature-1-desc': 'Immagini cristalline in alta definizione per ogni dettaglio',
        'sorveglianza-feature-2-title': 'Visione Notturna',
        'sorveglianza-feature-2-desc': 'Monitoraggio efficace anche in condizioni di scarsa illuminazione',
        'sorveglianza-feature-3-title': 'Intelligenza Artificiale',
        'sorveglianza-feature-3-desc': 'Riconoscimento automatico di persone, veicoli e comportamenti anomali',
        'sorveglianza-feature-4-title': 'Cloud Storage',
        'sorveglianza-feature-4-desc': 'Archiviazione sicura nel cloud con accesso da qualsiasi dispositivo',
        'sorveglianza-systems-title': 'Tipologie di Sistemi',
        'sorveglianza-systems-description': 'Offriamo diverse soluzioni di videosorveglianza per adattarsi a ogni esigenza specifica, dalla protezione residenziale ai complessi sistemi industriali.',
        'sorveglianza-systems-feature-1': 'Sistemi IP di ultima generazione',
        'sorveglianza-systems-feature-2': 'Telecamere dome e bullet professionali',
        'sorveglianza-systems-feature-3': 'Integrazione con sistemi di allarme esistenti',
        'sorveglianza-systems-feature-4': 'Controllo accessi integrato',
        'sorveglianza-systems-feature-5': 'Monitoraggio perimetrale avanzato',
        'sorveglianza-systems-cta1': 'Scopri le Tipologie',
        'sorveglianza-systems-cta2': 'Richiedi Consulenza',
        'sorveglianza-advantages-title': 'Vantaggi della Videosorveglianza',
        'sorveglianza-advantages-subtitle': 'Protezione completa per la tua tranquillità',
        'sorveglianza-advantage-1-title': 'Deterrente Visivo',
        'sorveglianza-advantage-1-desc': 'La presenza visibile delle telecamere scoraggia i malintenzionati',
        'sorveglianza-advantage-2-title': 'Monitoraggio Remoto',
        'sorveglianza-advantage-2-desc': 'Controlla i tuoi spazi da qualsiasi luogo tramite smartphone',
        'sorveglianza-advantage-3-title': 'Prove Legali',
        'sorveglianza-advantage-3-desc': 'Registrazioni ad alta qualità utilizzabili come prove legali',
        'sorveglianza-advantage-4-title': 'Notifiche Istantanee',
        'sorveglianza-advantage-4-desc': 'Avvisi in tempo reale per eventi sospetti o allarmi',
        'sorveglianza-installation-title': 'Installazione Professionale',
        'sorveglianza-installation-description': 'Il nostro team di tecnici specializzati garantisce un\'installazione professionale e una configurazione ottimale del sistema di videosorveglianza.',
        'sorveglianza-installation-feature-1': 'Sopralluogo gratuito e progettazione personalizzata',
        'sorveglianza-installation-feature-2': 'Installazione certificata da tecnici qualificati',
        'sorveglianza-installation-feature-3': 'Configurazione e test completi del sistema',
        'sorveglianza-installation-feature-4': 'Formazione sull\'utilizzo e manutenzione',
        'sorveglianza-installation-cta1': 'Prenota Sopralluogo',
        'sorveglianza-partner-title': 'I Nostri Partner Tecnologici',
        'sorveglianza-partner-description': 'Collaboriamo con leader nel settore della videosorveglianza professionale, per garantire prodotti di altissima qualità e tecnologie all\'avanguardia.',
        'sorveglianza-partner-service-1': 'Sistemi di videosorveglianza IP avanzati',
        'sorveglianza-partner-service-2': 'Telecamere con intelligenza artificiale integrata',
        'sorveglianza-partner-service-3': 'Software di gestione professionale',
        'sorveglianza-partner-service-4': 'Supporto tecnico specializzato 24/7',
        'sorveglianza-partner-service-5': 'Garanzia estesa su tutti i prodotti',
        'sorveglianza-contact-title': 'Richiedi Informazioni',
        'sorveglianza-contact-description': 'Contattaci per una consulenza completamente gratuita sui sistemi di videosorveglianza. I nostri esperti valuteranno le tue esigenze e ti proporranno la soluzione più adatta. Verrai ricontattato telefonicamente da uno dei nostri operatori il più presto possibile.',
        'sorveglianza-form-name': 'Nome e Cognome',
        'sorveglianza-form-email': 'Email',
        'sorveglianza-form-phone': 'Telefono',
        'sorveglianza-form-message': 'Messaggio',
        'sorveglianza-form-privacy': 'Accetto il trattamento dei dati personali secondo la',
        'sorveglianza-form-submit': 'Invia Richiesta',
        
        // Why Choose Section
        'why-choose-title': 'Perché Scegliere FB Total Security',
        'why-choose-subtitle': 'La tua sicurezza è la nostra priorità assoluta',
        'why-choose-feature-1': 'Esperienza ventennale nel settore della sicurezza',
        'why-choose-feature-2': 'Tecnologie certificate e all\'avanguardia',
        'why-choose-feature-3': 'Assistenza tecnica specializzata 24/7',
        'why-choose-feature-4': 'Garanzia totale su tutti i prodotti installati',
        'feature-experience-title': 'Anni di Esperienza Multisettoriale',
        'feature-experience-desc': 'Oltre 20 anni nel settore sicurezza con migliaia di installazioni completate',
        'feature-certifications-title': 'Certificazioni Professionali',
        'feature-certifications-desc': 'Tecnici certificati e aggiornati sulle ultime tecnologie di sicurezza',
        'feature-support-title': 'Assistenza 24/7',
        'feature-support-desc': 'Supporto tecnico continuo e interventi rapidi per garantire sempre la tua protezione',
        
        // Client Solutions Section
        'client-solutions-title': 'Soluzioni su Misura per Ogni Esigenza',
        'client-solutions-subtitle': 'Dalla residenza privata all\'azienda, progettiamo la sicurezza perfetta per te',
        'client-residential': 'Clienti Residenziali',
        'client-residential-desc': 'Proteggi la tua famiglia e la tua casa con sistemi di sicurezza discreti ed efficaci',
        'client-residential-feature-1': 'Sistemi integrati invisibili',
        'client-residential-feature-2': 'Controllo da smartphone',
        'client-residential-feature-3': 'Installazione non invasiva',
        'client-commercial': 'Clienti Commerciali',
        'client-commercial-desc': 'Soluzioni professionali per uffici, negozi e attività commerciali',
        'client-commercial-feature-1': 'Monitoraggio multi-sede',
        'client-commercial-feature-2': 'Reportistica avanzata',
        'client-commercial-feature-3': 'Integrazione gestionale',
        'client-industrial': 'Clienti Industriali',
        'client-industrial-desc': 'Protezione perimetrale e controllo accessi per impianti e magazzini',
        'client-industrial-feature-1': 'Protezione perimetrale',
        'client-industrial-feature-2': 'Controllo accessi biometrico',
        'client-industrial-feature-3': 'Sistemi anti-intrusione',
        'client-solutions-cta': 'Richiedi Consulenza Personalizzata',
        
        // Contact Section
        'contact-title': 'Contatta FB Total Security',
        'contact-subtitle': 'Richiedi una consulenza completamente gratuita per valutare le tue esigenze di sicurezza. Sopralluogo e preventivo senza impegno. Verrai ricontattato telefonicamente da uno dei nostri operatori il più presto possibile.',
        'form-contact-description': 'Richiedi una consulenza completamente gratuita per valutare le tue esigenze di sicurezza. Sopralluogo e preventivo senza impegno. Verrai ricontattato telefonicamente da uno dei nostri operatori il più presto possibile.',
        'contact-phone-label': 'Telefono',
        'contact-email-label': 'Email',
        'contact-area-label': 'Zona di Servizio',
        'contact-area-text': 'Tutta Italia',
        'contact-name': 'Nome e Cognome',
        'contact-email': 'Email',

        'contact-service': 'Servizio di Interesse',
        'contact-service-option-1': 'Sistema Nebbiogeni',
        'contact-service-option-2': 'Serramenti Blindati',
        'contact-service-option-3': 'Videosorveglianza',
        'contact-service-option-4': 'Sistemi di Allarme',
        'contact-service-option-5': 'Consulenza Generale',
        'contact-message': 'Messaggio',
        'contact-privacy': 'Accetto il trattamento dei dati personali secondo la',
        'contact-privacy-link': 'Privacy Policy',
        'contact-submit': 'Invia Richiesta',
        
        // Contact Form
        'form-title': 'Richiedi Informazioni',
        'form-name-label': 'Nome e Cognome',
        'form-email-label': 'Email',
        'form-phone-label': 'Telefono',
        'form-message-label': 'Messaggio',
        'form-name-placeholder': 'Nome e Cognome',
        'form-email-placeholder': 'Email',

        'form-service-label': 'Servizio di interesse',
        'form-service-default': 'Seleziona il servizio di interesse',
        'form-service-nebbiogeni': 'Sistemi Nebbiogeni',
        'form-service-serramenti': 'Serramenti di Sicurezza',
        'form-service-sorveglianza': 'Videosorveglianza',
        'form-service-allarmi': 'Sistemi di Allarme',
        'form-service-consulenza': 'Consulenza Generale',
        'form-message-placeholder': 'Descrivi le tue esigenze di sicurezza',
        'form-privacy-label': 'Accetto il trattamento dei dati personali secondo i <a href="termini-condizioni.html" target="_blank" style="color: #4caf50; text-decoration: underline;">Termini e Condizioni</a>',
        'form-submit-btn': 'Invia Richiesta',
        
        // Footer
        'footer-description': 'Creatori di sicurezza specializzati in sistemi di protezione avanzati. La tua sicurezza è la nostra priorità.',
        'footer-services-title': 'Servizi',
        'footer-service-nebbiogeni': 'Sistemi Nebbiogeni',
        'footer-service-serramenti': 'Serramenti Blindati',
        'footer-service-sorveglianza': 'Videosorveglianza',
        'footer-service-allarmi': 'Sistemi di Allarme',
        'footer-contacts-title': 'Contatti',
        'footer-info-title': 'Informazioni',
        'footer-social-title': 'Seguici su',
        'footer-copyright': '© 2024 FB Total Security. Tutti i diritti riservati. | P.IVA: 12345678901',
        'footer-company': 'FB Total Security',
        'footer-company-desc': 'Creatori di sicurezza dal 2003. Specializzati in sistemi di protezione avanzati per aziende e privati.',
        'footer-services': 'Servizi',
        'footer-company-info': 'Azienda',
        'footer-contact': 'Contatti',
        
        // Allarmi page
        'allarmi-hero-title': 'Sistemi di Allarme Intelligenti',
        'allarmi-hero-subtitle': 'Protezione smart e connessa con tecnologie di ultima generazione. Controlla e monitora i tuoi spazi con sistemi di allarme avanzati.',
        'allarmi-hero-cta1': 'Scopri di Più',
        'allarmi-hero-cta2': 'Richiedi Preventivo',
        'allarmi-components-title': 'Componenti del Sistema',
        'allarmi-components-description': 'I nostri sistemi di allarme integrano i componenti più avanzati per offrire una protezione completa e affidabile dei tuoi spazi.',
        'allarmi-components-feature-1': 'Sensori wireless con tecnologia long-range',
        'allarmi-components-feature-2': 'Centrali di controllo con display touch',
        'allarmi-components-feature-3': 'Rilevatori di movimento con immunità animali',
        'allarmi-components-feature-4': 'Contatti magnetici per porte e finestre',
        'allarmi-components-feature-5': 'Rilevatori rottura vetro con doppia tecnologia',
        'allarmi-components-feature-6': 'Sirene esterne con anti-manomissione',
        'allarmi-components-cta1': 'Componenti',
        'allarmi-components-cta2': 'Preventivo Gratuito',
        'allarmi-tech-title': 'Tecnologie Avanzate',
        'allarmi-tech-subtitle': 'L\'innovazione al servizio della tua sicurezza',
        'allarmi-tech-feature-1-title': 'Tecnologia Wireless',
        'allarmi-tech-feature-1-desc': 'Sensori wireless con comunicazione criptata e lunga durata della batteria',
        'allarmi-tech-feature-2-title': 'App Mobile',
        'allarmi-tech-feature-2-desc': 'Controllo completo tramite smartphone con notifiche in tempo reale',
        'allarmi-tech-feature-3-title': 'Intelligenza Artificiale',
        'allarmi-tech-feature-3-desc': 'Algoritmi intelligenti per ridurre i falsi allarmi e migliorare la rilevazione',
        'allarmi-tech-feature-4-title': 'Integrazione Cloud',
        'allarmi-tech-feature-4-desc': 'Archiviazione cloud sicura e accesso remoto da qualsiasi dispositivo',
        'allarmi-systems-title': 'Tipologie di Sistemi',
        'allarmi-systems-description': 'Offriamo diverse soluzioni di allarme per adattarci ad ogni esigenza specifica, dalla protezione residenziale ai sistemi commerciali complessi.',
        'allarmi-systems-feature-1': 'Sistemi wireless con comunicazione criptata',
        'allarmi-systems-feature-2': 'Sistemi ibridi con sensori cablati e wireless',
        'allarmi-systems-feature-3': 'Integrazione con sistemi di videosorveglianza',
        'allarmi-systems-feature-4': 'Collegamento a centrali di monitoraggio 24/7',
        'allarmi-systems-feature-5': 'Integrazione domotica',
        'allarmi-systems-cta1': 'Scopri Tipologie',
        'allarmi-systems-cta2': 'Richiedi Consulenza',
        'allarmi-advantages-title': 'Vantaggi dei Nostri Sistemi',
        'allarmi-advantages-subtitle': 'Protezione completa per la tua tranquillità',
        'allarmi-advantage-1-title': 'Rilevazione Istantanea',
        'allarmi-advantage-1-desc': 'Rilevazione immediata delle intrusioni con notifiche istantanee',
        'allarmi-advantage-2-title': 'Controllo Remoto',
        'allarmi-advantage-2-desc': 'Attiva e disattiva il sistema da qualsiasi luogo tramite smartphone',
        'allarmi-advantage-3-title': 'Notifiche Intelligenti',
        'allarmi-advantage-3-desc': 'Avvisi in tempo reale con foto e video degli eventi rilevati',
        'allarmi-advantage-4-title': 'Monitoraggio H24',
        'allarmi-advantage-4-desc': 'Collegamento a centrali di monitoraggio professionali per intervento immediato',
        'allarmi-installation-title': 'Processo di Installazione',
        'allarmi-installation-description': 'Il nostro team di tecnici specializzati garantisce un\'installazione professionale e una configurazione ottimale del sistema di allarme.',
        'allarmi-installation-feature-1': 'Sopralluogo gratuito e analisi della sicurezza',
        'allarmi-installation-feature-2': 'Installazione certificata da tecnici qualificati',
        'allarmi-installation-feature-3': 'Configurazione completa e test del sistema',
        'allarmi-installation-feature-4': 'Formazione sull\'uso e app mobile',
        'allarmi-installation-cta1': 'Prenota Sopralluogo',
        'allarmi-partner-title': 'Partner Gruppo ITL',
        'allarmi-partner-description': 'Collaboriamo con Gruppo ITL, leader nel settore della sicurezza professionale, per garantire prodotti di altissima qualità e tecnologie all\'avanguardia.',
        'allarmi-partner-service-1': 'Sistemi di allarme wireless avanzati',
        'allarmi-partner-service-2': 'Centrali di monitoraggio professionali',
        'allarmi-partner-service-3': 'Applicazioni mobile e piattaforme cloud',
        'allarmi-partner-service-4': 'Assistenza tecnica specializzata 24/7',
        'allarmi-partner-service-5': 'Garanzia estesa su tutti i prodotti',
        'allarmi-contact-title': 'Richiedi Informazioni',
        'allarmi-contact-description': 'Contattaci per una consulenza completamente gratuita sui sistemi di allarme. I nostri esperti valuteranno le tue esigenze e ti proporranno la soluzione più adatta. Verrai ricontattato telefonicamente da uno dei nostri operatori il più presto possibile.',
        'allarmi-partner-feature-5': 'Soluzioni Personalizzate',
        'allarmi-partnership-title': 'Partnership Premium',
        'allarmi-partnership-desc': 'Collaboriamo con i leader del settore per offrirti le migliori soluzioni di sicurezza',
        'allarmi-partner-name': 'ITL Group',
        'allarmi-partner-desc': 'Sistemi di allarme Blue Lock con controllo wireless e installazione senza opere murarie. Sensori predinamici esclusivi con protezione fino a 500mq su più livelli. App di gestione per smartphone, connettività diretta a Forze dell\'Ordine, tecnologia di discriminazione automatica tra falsi allarmi e minacce reali. Servizio di videosorveglianza Overlook integrato. <strong>Garanzia standard 24 mesi</strong>, estendibile a vita con manutenzione annuale "Protetti & Sicuri".',
        'allarmi-partner-feature-1': 'Controllo Wireless',
        'allarmi-partner-feature-2': 'Sensori Predinamici',
        'allarmi-partner-feature-3': 'Protezione 500mq',
        'allarmi-partner-feature-4': 'App Smartphone',
        'allarmi-partner-feature-5': 'Overlook Integrato',
        'allarmi-partner-feature-6': 'Garanzia Estendibile a Vita',
        'allarmi-certifications-title': 'Certificazioni e Garanzie',
        'allarmi-cert-1-title': 'Conformità Normative',
        'allarmi-cert-1-desc': 'Italia ed Europa',
        'allarmi-cert-2-title': 'Sensore Predinamico',
        'allarmi-cert-2-desc': 'Brevettato Integrato',
        'allarmi-cert-3-title': 'Garanzia 24 Mesi',
        'allarmi-cert-3-desc': 'Estendibile a Vita',
        'allarmi-cert-4-title': 'Protetti & Sicuri',
        'allarmi-cert-4-desc': 'Approccio Completo',
        
        // Tecnologie allarmi
        'allarmi-tech-1-title': 'Wireless Avanzato',
        'allarmi-tech-1-desc': 'Comunicazione wireless bidirezionale con crittografia avanzata per massima sicurezza e affidabilità.',
        'allarmi-tech-2-title': 'Batterie Long-Life',
        'allarmi-tech-2-desc': 'Batterie al litio con durata fino a 5 anni e notifiche automatiche per sostituzione.',
        'allarmi-tech-3-title': 'Controllo Internet',
        'allarmi-tech-3-desc': 'Gestione completa via internet con notifiche push e controllo da qualsiasi parte del mondo.',
        'allarmi-tech-4-title': 'Anti-Sabotaggio',
        'allarmi-tech-4-desc': 'Protezione anti-manomissione su tutti i componenti con segnalazione immediata di tentativi.',
        'allarmi-tech-5-title': 'Backup Energetico',
        'allarmi-tech-5-desc': 'Batterie di backup integrate per funzionamento continuo anche in caso di blackout 24 ore su 24',
        'allarmi-tech-6-title': 'Rilevamento Preciso',
        'allarmi-tech-6-desc': 'Sensori con tecnologia pet-immune per evitare falsi allarmi causati da animali domestici.',
        'allarmi-types-title': 'Tipologie di Sistemi',
        'allarmi-types-description': 'Soluzioni personalizzate per ogni esigenza di sicurezza, dalla protezione residenziale ai sistemi commerciali avanzati.',
        'allarmi-type-1': 'Sistema volumetrico con rilevamento movimento',
        'allarmi-type-2': 'Protezione perimetrale avanzata',
        'allarmi-type-3': 'Controllo ingressi con tecnologia predinamica',
        'allarmi-type-4': 'Protezione personale e antiaggressione',
        'allarmi-type-5': 'Sistema antipanico con collegamento 112',
        'allarmi-type-6': 'Comunicazione GSM con APP e sintesi vocale',
        'allarmi-type-7': 'Protezione antijammer e antimanomissione',
        'allarmi-type-8': 'Sistema modulabile e trasferibile',
        'allarmi-types-cta1': 'Scopri i Vantaggi',
        'allarmi-types-cta2': 'Altri Servizi',
        'allarmi-advantage-5-title': 'Risparmio Assicurativo',
        'allarmi-advantage-5-desc': 'Riduzioni significative sui premi assicurativi grazie alla certificazione del sistema.',
        'allarmi-advantage-6-title': 'Manutenzione Minima',
        'allarmi-advantage-6-desc': 'Sistemi wireless con autodiagnostica e manutenzione ridotta al minimo.',
        'allarmi-installation-1': 'Sopralluogo tecnico gratuito',
        'allarmi-installation-2': 'Progettazione personalizzata',
        'allarmi-installation-3': 'Installazione certificata',
        'allarmi-installation-4': 'Configurazione e test completi',
        'allarmi-installation-5': 'Formazione all\'utilizzo',
        'allarmi-installation-6': 'Certificazione di conformità',
        'allarmi-installation-7': 'Assistenza post-vendita',
        'allarmi-installation-8': 'Manutenzione programmata',
        'contact-description': 'Contattaci per una consulenza completamente gratuita sui sistemi di allarme. I nostri esperti valuteranno le tue esigenze e ti proporranno la soluzione antifurto più adatta. Verrai ricontattato telefonicamente da uno dei nostri operatori il più presto possibile.',

        'contact-email-title': 'Email',
        'contact-address-title': 'Indirizzo',


        'form-name': 'Nome e Cognome',
        'form-email': 'Email',

        'form-message': 'Messaggio',
        'form-privacy': 'Accetto il trattamento dei dati personali secondo i <a href="termini-condizioni.html" target="_blank" style="color: #4caf50; text-decoration: underline;">Termini e Condizioni</a>',
        'form-submit': 'Invia Richiesta',
        'footer-name': 'FB Total Security',

        'footer-email': '📧 postmaster@fbtotalsecurity.com',
        'footer-address': '📍 Corso Sempione, Milano (MI)',

        'footer-service-area-title': 'Area di Servizio',
        'footer-service-area-location': 'Tutta Italia',
        'footer-service-installation': 'Installazione',
        'footer-service-maintenance': 'Manutenzione',
        'footer-service-support': 'Assistenza 24/7',
        'footer-info-about': 'Chi Siamo',
        'footer-info-terms': 'Termini e Condizioni',
        
        // Video descriptions and transcriptions
        'video-transcription-title': 'Trascrizione Video',
        'nebbiogeni-video-description': 'Guarda in azione il nostro sistema nebbiogeno professionale che garantisce protezione immediata contro le intrusioni. La tecnologia avanzata crea una barriera di nebbia impenetrabile in pochi secondi, impedendo ai malintenzionati di orientarsi e proteggendo efficacemente i tuoi beni. <a href="#contatti" class="text-link">Contattaci per una dimostrazione</a>.',
        'nebbiogeni-video-transcription': 'Il video mostra l\'efficacia dei sistemi nebbiogeni di sicurezza in azione. In pochi secondi dall\'attivazione, il dispositivo rilascia una densa nebbia che riempie completamente l\'ambiente, riducendo la visibilità a zero e rendendo impossibile per gli intrusi orientarsi o individuare oggetti di valore. La nebbia è completamente sicura per persone, animali e oggetti, non lascia residui e si dissipa naturalmente dopo un periodo prestabilito.',
        'serramenti-video-description': 'Scopri la qualità e l\'innovazione dei serramenti di sicurezza Xecur. I nostri serramenti antieffrazione offrono una protezione dal livello IV al livello VI, incluso lo standard di sicurezza più alto a livello europeo (RC6) con la grata Alice V. Porte blindate, finestre antieffrazione e soluzioni su misura per proteggere la tua casa con stile e design moderno. <a href="#contatti" class="text-link">Contattaci per una consulenza</a>.',
        'serramenti-video-transcription': 'Il video presenta la gamma completa di serramenti di sicurezza Xecur, mostrando porte blindate di classe superiore con protezione dal livello IV al livello VI (standard RC6), finestre antieffrazione con grata Alice V e sistemi di chiusura avanzati. Ogni prodotto combina massima sicurezza con design elegante, utilizzando materiali certificati e tecnologie all\'avanguardia per garantire protezione duratura nel tempo.',
        
        // Sorveglianza page
        'sorveglianza-meta-title': 'Videosorveglianza - Controllo e Monitoraggio | Milano',
        'sorveglianza-meta-description': 'Sistemi di videosorveglianza professionali, telecamere IP, controllo remoto. Monitoraggio 24/7 per casa e ufficio. Installazione a Milano.',
        'sorveglianza-og-title': 'Videosorveglianza - Sistemi di Controllo e Monitoraggio',
        'sorveglianza-og-description': 'Sistemi di videosorveglianza professionali con telecamere IP e controllo remoto 24/7.',
        'sorveglianza-partnership-title': 'Partnership Premium',
        'sorveglianza-partnership-desc': 'Collaboriamo con i leader del settore per offrirti le migliori soluzioni di sicurezza',
        'sorveglianza-civis-title': 'CIVIS',
        'sorveglianza-civis-desc': 'Leader italiano nella vigilanza privata e videosorveglianza professionale H24 con tecnologie AI NOD (Neural Object Detection) per il riconoscimento intelligente di oggetti e persone. Sistemi integrati con certificazioni Blockchain per la tracciabilità e autenticità dei dati di sorveglianza, garantendo massima sicurezza e conformità normativa.',
        'sorveglianza-civis-ai-nod': 'Tecnologia AI NOD',
        'sorveglianza-civis-blockchain': 'Certificazioni Blockchain',
        'sorveglianza-civis-neural': 'Riconoscimento Neurale',
        'sorveglianza-civis-traceability': 'Tracciabilità Dati',
        'sorveglianza-civis-compliance': 'Conformità Normativa',
        'sorveglianza-certifications-title': 'Certificazioni e Garanzie',
        'sorveglianza-cert-ai-nod': 'AI NOD Certified',
        'sorveglianza-cert-neural': 'Riconoscimento Neurale',
        'sorveglianza-cert-blockchain': 'Blockchain Security',
        'sorveglianza-cert-traceability': 'Tracciabilità Garantita',
        'sorveglianza-cert-data-integrity': 'Integrità Dati',
        'sorveglianza-cert-authenticity': 'Autenticità Certificata',
        'sorveglianza-cert-compliance': 'Conformità GDPR',
        'sorveglianza-cert-privacy': 'Privacy Protetta',
        'sorveglianza-tech-1': 'Telecamere IP ad alta risoluzione',
        'sorveglianza-tech-2': 'Visione notturna avanzata',
        'sorveglianza-tech-3': 'Riconoscimento facciale AI',
        'sorveglianza-tech-4': 'Analisi comportamentale intelligente',
        'sorveglianza-tech-5': 'Storage cloud sicuro e crittografato',
        'sorveglianza-tech-6': 'Controllo remoto via smartphone',
        'sorveglianza-tech-7': 'Notifiche push istantanee',
        'sorveglianza-tech-8': 'Integrazione con sistemi esistenti',
        'sorveglianza-cta-caratteristiche': 'Caratteristiche',
        'sorveglianza-cta-preventivo': 'Preventivo Gratuito',
        'sorveglianza-feature-5-title': 'Archiviazione Cloud',
        'sorveglianza-feature-5-desc': 'Registrazioni sicure nel cloud con backup automatico e accesso da qualsiasi dispositivo.',
        'sorveglianza-feature-6-title': 'Notifiche Istantanee',
        'sorveglianza-feature-6-desc': 'Avvisi push immediati su smartphone per ogni evento rilevato dal sistema.',
        'sorveglianza-types-title': 'Tipologie di Sistemi',
        'sorveglianza-types-description': 'Soluzioni personalizzate per ogni esigenza di sicurezza, dalla protezione residenziale ai sistemi commerciali avanzati.',
        'sorveglianza-type-1': 'Sistemi per abitazioni private',
        'sorveglianza-type-2': 'Videosorveglianza commerciale',
        'sorveglianza-type-3': 'Monitoraggio industriale',
        'sorveglianza-type-4': 'Controllo perimetrale',
        'sorveglianza-type-5': 'Sorveglianza cantieri',
        'sorveglianza-type-6': 'Sistemi anti-vandalismo',
        'sorveglianza-type-7': 'Controllo accessi integrato',
        'sorveglianza-type-8': 'Monitoraggio remoto H24',
        'sorveglianza-cta-consulenza': 'Richiedi Consulenza',
        'sorveglianza-cta-servizi': 'Altri Servizi',
        'sorveglianza-advantage-5-title': 'Riduzione Costi',
        'sorveglianza-advantage-5-desc': 'Diminuisci i costi di sicurezza fisica e ottieni sconti sulle polizze assicurative.',
        'sorveglianza-advantage-6-title': 'Analisi Comportamentale',
        'sorveglianza-advantage-6-desc': 'Studia i flussi di persone e ottimizza la gestione degli spazi commerciali.',
        'sorveglianza-installation-1': 'Sopralluogo e progettazione gratuiti',
        'sorveglianza-installation-2': 'Installazione certificata',
        'sorveglianza-installation-3': 'Configurazione rete e accessi',
        'sorveglianza-installation-4': 'Test completo del sistema',
        'sorveglianza-installation-5': 'Formazione all\'utilizzo',
        'sorveglianza-installation-6': 'Assistenza post-vendita',
        'sorveglianza-installation-7': 'Manutenzione programmata',
        'sorveglianza-installation-8': 'Aggiornamenti software inclusi',
        'sorveglianza-cta-sopralluogo': 'Prenota Sopralluogo',
        'sorveglianza-cta-assistenza': 'Assistenza Tecnica',
        'sorveglianza-partner-general-title': 'Informazioni Generali',
        'sorveglianza-partner-general-desc': 'Collaboriamo con istituti di vigilanza privata leader con oltre 50 anni di esperienza nel settore della vigilanza e sorveglianza. Offriamo soluzioni di sicurezza personalizzate per privati e aziende in tutta Italia.',
        'sorveglianza-partner-services-title': 'Servizi e Innovazione',
        'sorveglianza-partner-service-6': '<strong>Analisi del rischio:</strong> i nostri consulenti di sicurezza propongono soluzioni dopo un\'attenta analisi del rischio.',
        'sorveglianza-partner-service-7': '<strong>Tecnologia avanzata e esperienza solida:</strong> combinazione di tecnologia all\'avanguardia e professionisti esperti.',
        'sorveglianza-partner-service-8': '<strong>Adattamento sistemi esistenti:</strong> possibilità di collegare sistemi di allarme già esistenti alla nostra Centrale Operativa.',

        'sorveglianza-contact-email': 'Email',
        
        // Chi Siamo page
        'chi-siamo-meta-title': 'Chi Siamo - FB Total Security | Milano',
        'chi-siamo-meta-description': 'Scopri FB Total Security: agenzia autorizzata e certificata nella sicurezza professionale. Specialisti in nebbiogeni, serramenti blindati, videosorveglianza e allarmi con partnership dirette dai leader del settore.',
        'chi-siamo-og-title': 'Chi Siamo - FB Total Security | Creatori di Sicurezza',
        'chi-siamo-og-description': 'Scopri FB Total Security, agenzia autorizzata e certificata nella sicurezza professionale in tutta Italia con partnership dirette dai leader del settore.',
        'chi-siamo-hero-title': 'Chi Siamo',
        'chi-siamo-hero-subtitle': 'FB Total Security: agenzia autorizzata e certificata con partnership dirette dai leader del settore. Scopri i nostri valori e le certificazioni che ci rendono il partner ideale per la tua sicurezza.',
        'chi-siamo-hero-cta1': 'La Nostra Storia',
        'chi-siamo-hero-cta2': 'Contattaci',
        'chi-siamo-storia-title': 'La Nostra Storia',
        'chi-siamo-storia-desc1': 'FB Total Security nasce dalla passione e dall\'esperienza di professionisti del settore sicurezza con oltre 20 anni di attività. La nostra missione è proteggere persone, beni e attività attraverso soluzioni tecnologiche all\'avanguardia e un servizio di eccellenza.',
        'chi-siamo-storia-desc2': 'La nostra forza risiede nelle certificazioni professionali, nelle autorizzazioni ufficiali e nei rapporti diretti con i migliori brand internazionali. Offriamo soluzioni integrate multisettoriali con una sola agenzia. Questo ci permette di offrire soluzioni all\'avanguardia e garantire la massima qualità in ogni intervento, costruendo la nostra reputazione sulla competenza tecnica certificata del nostro team.',
        
        // Valori section
        'chi-siamo-valori-title': 'I Nostri Valori',
        'chi-siamo-valori-subtitle': 'Principi che guidano ogni nostro intervento',
        'chi-siamo-valore1-title': 'Agenzia Autorizzata',
        'chi-siamo-valore1-desc': 'Siamo un\'agenzia ufficialmente autorizzata con tutte le certificazioni necessarie per operare nel settore della sicurezza. Le nostre competenze spaziano dai sistemi residenziali a quelli commerciali e industriali, sempre nel rispetto delle normative vigenti.',
        'chi-siamo-valore2-title': 'Partnership Esclusive',
        'chi-siamo-valore2-desc': 'Manteniamo rapporti diretti e partnership esclusive con i leader mondiali del settore sicurezza. Questi mandati diretti ci permettono di accedere alle tecnologie più avanzate e di offrire prodotti certificati con garanzie estese e supporto tecnico specializzato.',
        'chi-siamo-valore3-title': 'Assistenza Continua',
        'chi-siamo-valore3-desc': 'Il nostro supporto non finisce con l\'installazione. Offriamo assistenza tecnica continua, interventi di emergenza 24/7 e manutenzione programmata per garantire sempre la massima efficienza dei tuoi sistemi.',
        
        // Specializzazioni section
        'chi-siamo-specializzazioni-title': 'Le Nostre Specializzazioni',
        'chi-siamo-specializzazioni-subtitle': 'Quattro aree di eccellenza per la tua sicurezza totale',
        'chi-siamo-spec1-title': 'Sistemi Nebbiogeni',
        'chi-siamo-spec1-desc': 'Tecnologia all\'avanguardia per la protezione immediata contro intrusioni. I nostri sistemi nebbiogeni creano una barriera di nebbia densa in pochi secondi, rendendo impossibile ai malintenzionati orientarsi e proseguire nell\'azione criminosa.',
        'chi-siamo-spec1-link': 'Scopri di più',
        'chi-siamo-spec2-title': 'Serramenti Blindati',
        'chi-siamo-spec2-desc': 'Porte blindate, finestre di sicurezza e serramenti antieffrazione di ultima generazione. Progettiamo e installiamo soluzioni su misura che combinano massima sicurezza ed estetica raffinata per ogni tipo di ambiente.',
        'chi-siamo-spec2-link': 'Scopri di più',
        'chi-siamo-spec3-title': 'Videosorveglianza',
        'chi-siamo-spec3-desc': 'Sistemi di videosorveglianza intelligenti con tecnologie AI integrate. Telecamere 4K, visione notturna, riconoscimento facciale e analisi comportamentale per un controllo completo e automatizzato della tua proprietà.',
        'chi-siamo-spec3-link': 'Scopri di più',
        'chi-siamo-spec4-title': 'Sistemi di Allarme',
        'chi-siamo-spec4-desc': 'Allarmi wireless e filari di ultima generazione con sensori intelligenti, bottoni antipanico e controllo remoto. Sistemi modulari e scalabili che si adattano perfettamente alle tue esigenze specifiche di sicurezza.',
        'chi-siamo-spec4-link': 'Scopri di più',
        
        // Perché sceglierci section
        'chi-siamo-perche-title': 'Perché Scegliere FB Total Security',
        'chi-siamo-perche-subtitle': 'La differenza che fa la differenza',
        'chi-siamo-approccio-title': 'Approccio Personalizzato',
        'chi-siamo-approccio-desc': 'Ogni cliente è unico, così come le sue esigenze di sicurezza. Iniziamo sempre con un sopralluogo gratuito per comprendere le tue necessità specifiche e progettare la soluzione più adatta. Non vendiamo prodotti standard, creiamo sistemi su misura.',
        'chi-siamo-approccio-feat1': 'Sopralluogo e consulenza gratuiti',
        'chi-siamo-approccio-feat2': 'Progettazione personalizzata',
        'chi-siamo-approccio-feat3': 'Preventivi dettagliati e trasparenti',
        'chi-siamo-approccio-feat4': 'Soluzioni modulari e scalabili',
        'chi-siamo-tecnologia-title': 'Tecnologia e Innovazione',
        'chi-siamo-tecnologia-desc': 'Investiamo costantemente in ricerca e sviluppo per offrirti sempre le tecnologie più avanzate. Dalle soluzioni AI per il riconoscimento facciale ai sistemi IoT per il controllo remoto, siamo sempre un passo avanti.',
        'chi-siamo-tecnologia-feat1': 'Tecnologie AI e machine learning',
        'chi-siamo-tecnologia-feat2': 'Sistemi IoT e controllo remoto',
        'chi-siamo-tecnologia-feat3': 'App mobile dedicate',
        'chi-siamo-tecnologia-feat4': 'Integrazione con smart home',
        'chi-siamo-tecnologia-feat5': 'Aggiornamenti software continui',
        'chi-siamo-cta-text': 'Vuoi saperne di più sulla nostra esperienza e sui nostri servizi? Contattaci per una consulenza gratuita.',
        'chi-siamo-cta-btn': 'Richiedi Consulenza Gratuita',
        
        // Contact section
        'chi-siamo-contact-title': 'Contatta FB Total Security',
        'chi-siamo-contact-desc': 'Richiedi una consulenza completamente gratuita per valutare le tue esigenze di sicurezza. Sopralluogo e preventivo senza impegno. Verrai ricontattato telefonicamente da uno dei nostri operatori il più presto possibile.',
        'chi-siamo-service-area-title': 'Zona di Servizio',
        'chi-siamo-service-area-text': 'Tutta Italia',
        
        // Footer additional
        'footer-company-name': 'FB Total Security',
        'footer-service-area': 'Tutta Italia',
        'allarmi-form-name': 'Nome e Cognome',
        'allarmi-form-email': 'Email',
        'allarmi-form-phone': 'Telefono',
        'allarmi-form-message': 'Messaggio',
        'allarmi-form-privacy': 'Accetto il trattamento dei dati personali secondo la',
        'allarmi-form-submit': 'Invia Richiesta',
        
        // Meta tags and components for allarmi.html - Italian
        'allarmi-meta-title': 'Sistemi Allarme - Antifurto e Sicurezza | Milano',
        'allarmi-meta-description': 'Sistemi di allarme antifurto professionali, sensori wireless, centrali di controllo. Protezione completa per casa e ufficio. Installazione in tutta Italia.',
        'allarmi-og-title': 'Sistemi di Allarme - Antifurto e Sicurezza Avanzata',
        'allarmi-og-description': 'Sistemi di allarme antifurto professionali con sensori wireless e controllo remoto.',
        'allarmi-component-1': 'Protezione volumetrica avanzata',
        'allarmi-component-2': 'Sistema perimetrale intelligente',
        'allarmi-component-3': 'Controllo ingressi con sensore predinamico',
        'allarmi-component-4': 'Protezione personale e antiaggressione',
        'allarmi-component-5': 'Sintesi vocale e comunicazione GSM',
        'allarmi-component-6': 'Sistema antipanico e telesoccorso',
        'allarmi-component-7': 'Protezione antijammer e antimanomissione',
        'allarmi-component-8': 'Sirene modulabili e sistema trasferibile',
        'itl-official-docs-title': 'Documentazione Ufficiale ITL GROUP',
        'itl-official-docs-desc': 'Accedi alle garanzie ufficiali del nostro partner tecnologico',
        'itl-warranty-btn-title': 'Garanzie ITL GROUP',
        'itl-warranty-btn-desc': 'Garanzia antifurto casa e assistenza completa',
        
        // Missing sorveglianza contact and form translations
        'sorveglianza-contact-address': 'Indirizzo',
        'sorveglianza-video-description': 'Scopri il nostro sistema di videosorveglianza professionale, la soluzione avanzata per la sicurezza totale di privati e aziende in tutta Italia. Tecnologia avanzata con risoluzione 4K, visione notturna, rilevamento intelligente e controllo remoto per proteggere efficacemente la tua proprietà. <a href="#contatti" class="text-link">Richiedi una consulenza gratuita</a>.',
        'sorveglianza-video-transcript': '<p>Il nostro sistema rappresenta l\'eccellenza nella videosorveglianza professionale per privati e aziende. Con telecamere 4K ad alta risoluzione, garantisce immagini cristalline sia di giorno che di notte grazie alla tecnologia di visione notturna avanzata.</p><p>Il sistema include rilevamento intelligente di movimento, notifiche push istantanee e controllo remoto completo tramite app dedicata. Perfetto per abitazioni, uffici e attività commerciali.</p>',


        'contact-form-name': 'Nome e Cognome',
        'contact-form-email': 'Email',

        'contact-form-message': 'Messaggio',
        'contact-form-privacy': 'Accetto il trattamento dei dati personali secondo i <a href="termini-condizioni.html" target="_blank" style="color: #4caf50; text-decoration: underline;">Termini e Condizioni</a>',
        'contact-form-submit': 'Invia Richiesta',
        
        // Missing serramenti translations
        'serramenti-meta-title': 'Serramenti Sicurezza - Porte Blindate | Milano',
        'serramenti-meta-description': 'Serramenti di sicurezza, porte blindate e infissi antieffrazione. Massima protezione per casa e ufficio. Installazione professionale a Milano.',
        'serramenti-og-title': 'Serramenti di Sicurezza - Porte Blindate e Infissi',
        'serramenti-og-description': 'Serramenti di sicurezza, porte blindate e infissi antieffrazione per massima protezione.',
        'serramenti-product-title': 'Porte Blindate di Alta Sicurezza',
        'serramenti-product-desc': 'Le nostre porte blindate rappresentano l\'eccellenza nella sicurezza passiva. Ogni porta è progettata e realizzata secondo le normative europee più severe, offrendo la massima protezione senza compromettere l\'estetica della tua abitazione.',
        'serramenti-feature-5': 'Isolamento termico e acustico',
        'serramenti-feature-6': 'Finiture personalizzabili',
        'serramenti-feature-7': 'Certificazioni CE e conformità normative',
        'serramenti-feature-8': 'Garanzia fino a 10 anni',
        
        // Additional serramenti translations
        'serramenti-product-cta1': 'Caratteristiche',
        'serramenti-product-cta2': 'Preventivo Gratuito',
        'serramenti-partnership-title': 'Partnership Premium',
        'serramenti-partnership-desc': 'Collaboriamo con i leader del settore per offrirti le migliori soluzioni di sicurezza',
        'serramenti-partner-name': 'XECUR',
        'serramenti-partner-desc': 'Grate e inferriate blindate con fissaggio senza opere murarie, processi di produzione interni 100% made in Italy. Innovativi sistemi di apertura senza snodi ed ingombro minimo. Verniciatura a polvere termoindurente per resistenza superiore, tunnel automatizzato di sabbiatura. <strong>Certificazioni UNI EN 1627-1630:2011</strong> (grate certificate anche in Classe IV, V e VI; Classe V record nazionale). Prima grata in Classe V (2013) e prodotto ALICE VI (2018) — unici a livello nazionale.',
        'serramenti-partner-tag-1': '100% Made in Italy',
        'serramenti-partner-tag-2': 'Senza opere murarie',
        'serramenti-partner-tag-3': 'UNI EN 1627-1630:2011',
        'serramenti-partner-tag-4': 'Classe V Record Nazionale',
        'serramenti-partner-tag-5': 'Garanzia fino a 10 anni',
        'serramenti-partner-tag-6': 'ISO 9001:2015',
        
        // Serramenti certifications translations
        'serramenti-certifications-title': 'Certificazioni e Garanzie',
        'serramenti-cert-1-title': 'UNI EN 1627-1630:2011',
        'serramenti-cert-1-desc': 'Classi antieffrazione internazionali',
        'serramenti-cert-2-title': 'Classe V Record',
        'serramenti-cert-2-desc': 'Prima grata Classe V nazionale (2013)',
        'serramenti-cert-3-title': 'Certificazione Saldatura',
        'serramenti-cert-3-desc': 'Processi di saldatura certificati',
        'serramenti-cert-4-title': 'ISO 9001:2015',
        'serramenti-cert-4-desc': 'Sistema produttivo certificato',
        'serramenti-cert-5-title': 'Garanzia fino a 10 anni',
        'serramenti-cert-5-desc': 'Sul funzionamento e certificazione permanente',
        'serramenti-cert-6-title': '100% Made in Italy',
        'serramenti-cert-6-desc': 'Processi di produzione interni',
        
        // Serramenti characteristics translations
        'serramenti-characteristics-title': 'Caratteristiche Tecniche',
        'serramenti-characteristics-subtitle': 'Tecnologia avanzata per la massima sicurezza',
        'serramenti-char-1-title': 'Classe RC6',
        'serramenti-char-1-desc': 'Massimo livello di sicurezza secondo normative europee. Resistenza testata contro attacchi con utensili elettrici.',
        'serramenti-char-2-title': 'Serrature Anti-Bumping',
        'serramenti-char-2-desc': 'Cilindri europei di ultima generazione con protezione contro bumping, picking e trapanatura.',
        'serramenti-char-3-title': 'Cerniere Rinforzate',
        'serramenti-char-3-desc': 'Cerniere antieffrazione in acciaio temprato, invisibili dall\'esterno e con sistema anti-sfilamento.',
        'serramenti-char-4-title': 'Isolamento Termoacustico',
        'serramenti-char-4-desc': 'Eccellenti prestazioni di isolamento termico e acustico per comfort abitativo ottimale.',
        
        // Additional serramenti characteristics and types
        'serramenti-char-5-title': 'Design Personalizzabile',
        'serramenti-char-5-desc': 'Ampia gamma di finiture, colori e stili per adattarsi perfettamente al tuo arredamento.',
        'serramenti-char-6-title': 'Certificazioni',
        'serramenti-char-6-desc': 'Tutti i prodotti sono certificati CE e conformi alle normative italiane ed europee di sicurezza.',
        'serramenti-types-desc': 'Offriamo una vasta gamma di serramenti blindati per soddisfare ogni esigenza di sicurezza e design, dalla residenza privata agli ambienti commerciali più esigenti.',
        'serramenti-type-7': 'Porte tagliafuoco certificate',
        'serramenti-type-8': 'Sistemi di controllo accessi',
        'serramenti-types-cta1': 'Richiedi Consulenza',
        'serramenti-types-cta2': 'Altri Servizi',
        'serramenti-installation-subtitle': 'Servizio completo dalla progettazione alla manutenzione',
        'serramenti-install-1-title': '1. Sopralluogo Gratuito',
        'serramenti-install-1-desc': 'Analisi dettagliata delle tue esigenze e misurazione precisa per la progettazione su misura.',
        'serramenti-install-2-title': '2. Progettazione',
        'serramenti-install-2-desc': 'Sviluppo della soluzione ottimale considerando sicurezza, estetica e budget disponibile.',
        'serramenti-install-3-title': '3. Produzione',
        'serramenti-install-3-desc': 'Realizzazione su misura nei nostri laboratori con materiali certificati e controlli qualità.',
        'serramenti-install-4-title': '4. Installazione',
        'serramenti-install-4-desc': 'Montaggio professionale da parte di tecnici specializzati con minimo disturbo per te.',
        'serramenti-install-5-title': '5. Collaudo',
        'serramenti-install-5-desc': 'Test completo di funzionamento e consegna della documentazione tecnica e garanzie.',
        'serramenti-install-6-title': '6. Assistenza',
        'serramenti-install-6-desc': 'Servizio di manutenzione programmata e assistenza tecnica per tutta la durata della garanzia.',
        'serramenti-contact-desc': 'Contattaci per una consulenza gratuita sui serramenti di sicurezza. I nostri esperti valuteranno le tue esigenze e ti proporranno la soluzione più adatta.',
        'footer-installation': 'Installazione',
        'footer-maintenance': 'Manutenzione',
        'footer-support': 'Assistenza 24/7',
        'page-title': 'Sistemi di Sicurezza e Antifurto | FB Total Security Milano',
        'page-description': 'FB Total Security offre sistemi di sicurezza avanzati: allarmi, videosorveglianza, nebbiogeni e serramenti blindati. Protezione completa per casa e azienda a Milano.',
        'nebbiogeni-page-title': 'Sistemi Nebbiogeni Professionali - Protezione Antifurto Istantanea | FB Total Security Milano',
        'nebbiogeni-page-description': 'Scopri i sistemi nebbiogeni UR Fog: tecnologia avanzata di nebulizzazione antifurto che riduce la visibilità a zero in 10 secondi. Protezione certificata per negozi, uffici e abitazioni a Milano. Consulenza gratuita.',
        'og-title': 'Sistemi di Sicurezza e Antifurto | FB Total Security Milano',
        'og-description': 'FB Total Security offre sistemi di sicurezza avanzati: allarmi, videosorveglianza, nebbiogeni e serramenti blindati. Protezione completa per casa e azienda a Milano.',
        'nebbiogeni-og-title': 'Sistemi Nebbiogeni UR Fog - Protezione Antifurto Avanzata',
        'nebbiogeni-og-description': 'Tecnologia nebbiogeni che riduce la visibilità a zero in 10 secondi. Protezione certificata per la tua attività.',
        'btn-discover': 'Scopri di Più',
        'btn-quote': 'Richiedi Preventivo',
        'security-title': 'Sicurezza Attiva di Nuova Generazione',
        'technology-title': 'Tecnologia Nebbiogeni Avanzata',
        'security-description': 'I nostri sistemi nebbiogeni rappresentano la frontiera più avanzata nella protezione antifurto. In caso di intrusione, il sistema rilascia istantaneamente una densa nebbia che riduce la visibilità a zero, costringendo i malintenzionati ad abbandonare immediatamente i locali.',
        'feature-activation': 'Attivazione istantanea in 10 secondi',
        'feature-fog': 'Nebbia densa e persistente per 45 minuti',
        'feature-safe': 'Completamente sicura per persone e oggetti',
        'feature-integration': 'Integrazione con sistemi di allarme esistenti',
        'feature-remote': 'Controllo remoto via smartphone',
        'feature-maintenance': 'Manutenzione programmata inclusa',
        'feature-certifications': 'Certificazioni CE e conformità normative',
        'feature-warranty': 'Garanzia estesa fino a 2 anni',
        'btn-advantages': 'Vantaggi',
        'btn-free-quote': 'Preventivo Gratuito',
        'partner-urfog-title': 'URfog',
        'partner-urfog-description': 'Prima azienda italiana e mondiale ad aver certificato i sistemi nebbiogeni secondo la <strong>EN 50131-8:2019</strong>. Tecnologie brevettate: FOG STORM, caldaia "LAYER", doppia bombola brevettata, sistema a batteria con 2 brevetti internazionali, scambiatore Compact, ugello antimanomissione orientabile. Formula "White Out" Food Grade certificata per settore alimentare con <strong>zero residui</strong> e totale sicurezza (certificazione EUROFINS).',
        'tag-patented': 'Tecnologia Brevettata',
        'tag-ultrafast': 'Fino a 200 m³ in 15 sec',
        'tag-foodgrade': 'Food Grade',
        'tag-ecofriendly': 'Zero Residui',
        'tag-en50131': 'EN 50131-8:2019',
        'tag-warranty': 'Garanzia 2 anni + Assistenza a vita',
        'certifications-title': 'Certificazioni e Garanzie',
        'cert-en-title': 'EN 50131-8:2019',
        'cert-en-desc': 'Prima certificazione mondiale',
        'cert-emc-title': 'EMC, FCC, CE',
        'cert-emc-desc': 'Conformità Internazionale',
        'cert-food-title': 'Food Grade',
        'cert-food-desc': 'Certificato settore alimentare',
        'cert-eurofins-title': 'EUROFINS',
        'cert-eurofins-desc': 'Atossico per persone e animali',
        'cert-warranty-title': 'Garanzia 2 anni',
        'cert-warranty-desc': 'Assistenza telefonica a vita',
        'cert-iso16000-title': 'EN ISO 16000-1',
        'cert-iso16000-desc': 'Test fluidi certificati',
        'cert-eco-desc': 'Rispetto Ambientale',
        'advantage-instant-title': 'Attivazione Istantanea',
        'advantage-instant-desc': 'Il sistema si attiva in pochi secondi creando una barriera di nebbia impenetrabile',
        'advantage-protection-title': 'Protezione Totale',
        'advantage-protection-desc': 'Riduce la visibilità a zero rendendo impossibile per i ladri completare il furto',
        'advantage-safe-title': 'Completamente Sicuro',
        'advantage-safe-desc': 'La nebbia è atossica, non danneggia persone, animali o oggetti',
        'advantage-remote-title': 'Controllo Remoto',
        'advantage-remote-desc': 'Gestisci il sistema da remoto tramite app dedicata con notifiche in tempo reale',
        'advantage-maintenance-title': 'Manutenzione Inclusa',
        'advantage-maintenance-desc': 'Servizio di manutenzione programmata e assistenza tecnica 24/7',
        'advantage-savings-title': 'Risparmio Assicurativo',
        'advantage-savings-desc': 'Molte compagnie assicurative riconoscono sconti significativi',
        'slide1-title': 'Protezione Istantanea',
        'slide1-desc': 'Il sistema si attiva in pochi secondi creando una barriera impenetrabile',
        'slide2-title': 'Tecnologia Avanzata',
        'slide2-desc': 'Sistemi all\'avanguardia per la massima protezione',
        'btn-prev': 'Precedente',
        'btn-next': 'Successivo',

        'applications-title': 'Applicazioni Ideali',
        'applications-desc': 'I sistemi nebbiogeni sono perfetti per una vasta gamma di ambienti',
        'app-shops': 'Negozi e centri commerciali',
        'app-jewelry': 'Gioiellerie e oreficerie',
        'app-banks': 'Banche e istituti di credito',
        'app-pharmacies': 'Farmacie e parafarmacie',
        'app-offices': 'Uffici e studi professionali',
        'app-warehouses': 'Magazzini e depositi',
        'app-homes': 'Abitazioni di pregio',
        'app-museums': 'Musei e gallerie d\'arte',
        'btn-consultation': 'Richiedi Consulenza',
        'btn-other-services': 'Altri Servizi',
        'partner-urfog-main-title': 'Il Nostro Partner: UR Fog',
        'partner-general-info-title': 'Informazioni Generali',
        'partner-general-info-desc': 'UR Fog è un\'azienda leader mondiale nel mercato dei sistemi di sicurezza nebbiogeni. I loro sistemi bloccano i ladri in pochi secondi, proteggendo da furti in negozi, aziende, case e banche.',
        'partner-services-title': 'Servizi e Innovazione',
        'partner-feature-1': 'Tecnologia brevettata certificata',
        'partner-feature-2': 'Attivazione ultra-veloce in 10 secondi',
        'partner-feature-3': 'Nebbia densa e persistente per 45 minuti',
        'partner-feature-4': 'Completamente sicura per persone e oggetti',
        'partner-feature-5': 'Integrazione con sistemi di allarme esistenti',
        'partner-feature-6': 'Controllo remoto via smartphone',
        'partner-feature-7': 'Manutenzione programmata inclusa',
        'partner-feature-8': 'Certificazioni CE e conformità normative',
        'partner-feature-9': 'Garanzia estesa fino a 2 anni',
        'partner-feature-10': 'Supporto tecnico specializzato 24/7',
        'contact-info-title': 'Informazioni di Contatto',
        'contact-info-desc': 'Contattaci per una consulenza personalizzata sui nostri sistemi di sicurezza',
        'index-meta-title': 'FB Total Security - Sistemi Sicurezza | Milano',
        'index-meta-description': 'Sistemi di sicurezza professionali: nebbiogeni, serramenti blindati, videosorveglianza e allarmi. Protezione completa per casa e azienda a Milano.',
        'index-og-title': 'FB Total Security - Sistemi di Sicurezza',
        'index-og-description': 'Soluzioni di sicurezza avanzate per la protezione di casa e azienda',
        'index-twitter-title': 'FB Total Security - Sistemi di Sicurezza',
        'index-twitter-description': 'Sistemi di sicurezza professionali a Milano',
        'nebbiogeni-section-title': 'Sistemi Nebbiogeni',
        'nebbiogeni-section-desc': 'Protezione istantanea con tecnologia nebbiogena avanzata',
        'serramenti-section-title': 'Serramenti Blindati',
        'serramenti-section-desc': 'Porte e finestre blindate per la massima sicurezza',
        'svg-serramenti-text': 'Serramenti',
        'sorveglianza-section-title': 'Videosorveglianza',
        'sorveglianza-section-desc': 'Sistemi di monitoraggio avanzati con AI',
        'sorveglianza-feature-5': 'Analisi comportamentale intelligente',
        'svg-sorveglianza-text': 'Sorveglianza',
        'allarmi-section-title': 'Sistemi di Allarme',
        'allarmi-section-desc': 'Allarmi intelligenti connessi 24/7',
        'allarmi-feature-5': 'Integrazione domotica completa',
        'svg-allarmi-text': 'Allarmi',
        'why-choose-feature-1-title': 'Esperienza Consolidata',
        'why-choose-feature-1-desc': 'Oltre 20 anni di esperienza nel settore della sicurezza',
        'why-choose-feature-2-title': 'Tecnologie Avanzate',
        'why-choose-feature-2-desc': 'Utilizziamo solo le tecnologie più innovative e certificate',
        'why-choose-feature-3-title': 'Assistenza 24/7',
        'why-choose-feature-3-desc': 'Supporto tecnico sempre disponibile per ogni necessità',
        'clients-title': 'I Nostri Clienti',
        'clients-subtitle': 'Aziende e privati che si affidano alla nostra esperienza',
        'clients-business-title': 'Settore Business',
        'clients-business-desc': 'Proteggiamo negozi, uffici, banche e strutture commerciali',
        'clients-business-feature-1': 'Sistemi nebbiogeni per negozi e centri commerciali',
        'clients-business-feature-2': 'Videosorveglianza avanzata per uffici e aziende',
        'clients-business-feature-3': 'Serramenti blindati per banche e istituti di credito',
        'clients-business-feature-4': 'Allarmi intelligenti per farmacie e parafarmacie',
        'clients-business-feature-5': 'Soluzioni integrate per magazzini e depositi',
        'clients-residential-title': 'Settore Residenziale',
        'clients-residential-desc': 'Protezione completa per abitazioni private e ville di lusso',
        'clients-residential-feature-1': 'Sistemi di allarme perimetrali avanzati',
        'clients-residential-feature-2': 'Videosorveglianza discreta e intelligente',
        'clients-residential-feature-3': 'Serramenti blindati su misura per abitazioni',
        'clients-residential-feature-4': 'Sistemi nebbiogeni per ville e case di lusso',
        'clients-residential-feature-5': 'Controllo accessi intelligente per abitazioni',
        'clients-residential-feature-6': 'Monitoraggio 24/7 con centrale operativa',
        'clients-cta-text': 'Richiedi un preventivo gratuito per la tua sicurezza',
        'clients-cta-btn': 'Contattaci Ora',
        'terms-title': 'Termini e Condizioni',
        'terms-subtitle': 'Condizioni di utilizzo del sito web FB Total Security',
        'terms-section-1-title': '1. Informazioni Generali',
        'terms-section-1-content': 'Il presente sito web è di proprietà di FB Total Security, con sede legale in Milano. L\'utilizzo del sito è soggetto ai seguenti termini e condizioni.',
        'terms-section-2-title': '2. Utilizzo del Sito',
        'terms-section-2-content': 'L\'accesso e l\'utilizzo di questo sito web sono consentiti esclusivamente per scopi leciti. È vietato utilizzare il sito per:',
        'terms-section-2-item-1': 'Attività illegali o non autorizzate',
        'terms-section-2-item-2': 'Trasmissione di contenuti dannosi o virus',
        'terms-section-2-item-3': 'Violazione dei diritti di proprietà intellettuale',
        'terms-section-2-item-4': 'Interferenza con il normale funzionamento del sito',
        'terms-section-3-title': '3. Proprietà Intellettuale',
        'terms-section-3-content': 'Tutti i contenuti presenti sul sito, inclusi testi, immagini, loghi, grafica e software, sono di proprietà di FB Total Security o dei rispettivi proprietari e sono protetti dalle leggi sul diritto d\'autore.',
        'terms-section-4-title': '4. Privacy e Trattamento Dati',
        'terms-section-4-content': 'Il trattamento dei dati personali avviene in conformità al Regolamento UE 2016/679 (GDPR). I dati raccolti attraverso i moduli di contatto vengono utilizzati esclusivamente per:',
        'terms-section-4-item-1': 'Rispondere alle richieste di informazioni',
        'terms-section-4-item-2': 'Fornire preventivi personalizzati',
        'terms-section-4-item-3': 'Comunicazioni commerciali (solo con consenso esplicito)',
        'terms-section-5-title': '5. Limitazione di Responsabilità',
        'terms-section-5-content': 'FB Total Security non può essere ritenuta responsabile per:',
        'terms-section-5-item-1': 'Interruzioni temporanee del servizio',
        'terms-section-5-item-2': 'Errori o omissioni nei contenuti',
        'terms-section-5-item-3': 'Danni derivanti dall\'utilizzo del sito',
        'terms-section-5-item-4': 'Collegamenti a siti web di terze parti',
        'terms-section-6-title': '6. Modifiche ai Termini',
        'terms-section-6-content': 'FB Total Security si riserva il diritto di modificare questi termini e condizioni in qualsiasi momento. Le modifiche entreranno in vigore dalla data di pubblicazione sul sito.',
        'terms-section-7-title': '7. Legge Applicabile',
        'terms-section-7-content': 'I presenti termini e condizioni sono regolati dalla legge italiana. Per qualsiasi controversia sarà competente il Foro di Milano.',
        'terms-section-8-title': '8. Contatti',
        'terms-section-8-content': 'Per qualsiasi domanda relativa ai presenti termini e condizioni, è possibile contattare FB Total Security attraverso i canali indicati nella sezione contatti del sito.',
        'terms-last-update': 'Ultimo aggiornamento:',
        'terms-update-date': 'Settembre 2025',
        'footer-description': 'Creatori di sicurezza specializzati in sistemi di protezione avanzati. La tua sicurezza è la nostra priorità.',
        'footer-services-title': 'Servizi',
        'footer-service-1': 'Sistemi Nebbiogeni',
        'footer-service-2': 'Serramenti di Sicurezza',
        'footer-service-3': 'Videosorveglianza',
        'footer-service-4': 'Sistemi di Allarme',
        'footer-company-title': 'Azienda',
        'footer-company-1': 'Chi Siamo',
        'footer-company-2': 'Contatti',
        'footer-company-3': 'Termini e Condizioni',
        'footer-contacts-title': 'Contatti',
        'footer-location': '📍 Tutta Italia',

        'footer-email': '✉️ postmaster@fbtotalsecurity.com',
        'footer-copyright': '© 2024 FB Total Security. Tutti i diritti riservati.'
    },
    en: {
        // Navigation
        'nav-home': 'Home',
        'nav-services': 'Services',
        'nav-about': 'About Us',
        'nav-contact': 'Contact',
        'nav-quote': 'Free Quote',
        'tagline': 'Security Creators',
        'nav-nebbiogeni': 'Fog Systems',
        'nav-serramenti': 'Security Doors',
        'nav-sorveglianza': 'Surveillance',
        'nav-allarmi': 'Alarms',
        'nav-chi-siamo': 'About Us',
        'nav-contatti': 'Contact',
        
        // Hero section
        'hero-tagline': 'Your security is our priority',
        'hero-title': 'Advanced Security Solutions for Your Protection',
        'hero-subtitle': 'Fog systems, armored doors and windows, video surveillance and smart alarms. Protect what matters most with cutting-edge technologies.',
        'hero-cta': 'Discover Our Services',
        'hero-cta-primary': 'Discover Our Services',
        'hero-cta-secondary': 'Request Quote',
        
        // Mission Section
        'mission-title': 'Your security, our mission',
        'mission-description': 'In an ever-evolving world, protecting your assets and loved ones is a priority. FB Security was born with the goal of offering you total peace of mind, thanks to a multi-sector security service that adapts to your every need. From armed surveillance to the most advanced video surveillance systems, from physical protection of bars and gratings to modern fog systems, we offer you 360° Protection. We are your trusted partner for a safe existence, day and night.',
        
        // Services Overview
        'services-title': 'Our Security Services',
        'services-subtitle': 'Complete solutions for every protection need',
        'service-nebbiogeni-title': 'Fog Systems',
        'service-nebbiogeni-desc': 'Instant protection with dense fog that neutralizes any intrusion',
        'service-serramenti-title': 'Armored Doors & Windows',
        'service-serramenti-desc': 'High-security certified doors and windows for maximum protection',
        'service-sorveglianza-title': 'Video Surveillance',
        'service-sorveglianza-desc': 'Advanced monitoring systems with artificial intelligence',
        'service-allarmi-title': 'Alarm Systems',
        'service-allarmi-desc': 'Smart connected alarms for 24/7 protection',
        'services-cta': 'Request Free Consultation',
        'service-nebbiogeni-link': 'Fog Systems Milan',
        'service-serramenti-link': 'Armored Doors Milan',
        'service-sorveglianza-link': 'Video Surveillance Milan',
        'service-allarmi-link': 'Alarm Systems Milan',
        
        // Partnership
        'partnership-title': 'Our Technology Partners',
        'partnership-subtitle': 'We collaborate with global security leaders to offer you the best solutions',
        'partnerships-title': 'Our Technology Partners',
        'partnerships-subtitle': 'We collaborate with world security leaders to offer you the best solutions',
        
        // Nebbiogeni Section
        'nebbiogeni-title': 'Advanced Fog Systems',
        'nebbiogeni-subtitle': 'Instant and invisible protection',
        'nebbiogeni-desc': 'Our fog systems represent the evolution of passive security. In case of intrusion, the system instantly releases a dense and safe fog that reduces visibility to zero, forcing intruders to flee immediately.',
        'nebbiogeni-feature-1': 'Activation in 2-3 seconds',
        'nebbiogeni-feature-2': 'Safe and non-toxic fog',
        'nebbiogeni-feature-3': 'Coverage up to 500m²',
        'nebbiogeni-feature-4': 'Integration with existing systems',
        'nebbiogeni-cta': 'Discover Fog Systems',
        
        // Serramenti Section
        'serramenti-title': 'Armored Security Doors & Windows',
        'serramenti-subtitle': 'Impenetrable physical barrier',
        'serramenti-desc': 'Armored doors and windows certified according to the most severe European standards. Each fixture is custom-designed to ensure the highest level of protection without compromising the aesthetics of your home.',
        'serramenti-feature-1': 'Anti-burglary up to Class 6 (UNI EN 1627-1630)',
        'serramenti-feature-2': 'Internal production (closed cycle)',
        'serramenti-feature-3': 'Customizable (made to measure, various classes and models)',
        'serramenti-feature-4': 'Installation without masonry work',
        'serramenti-feature-5': 'ISO 9001:2015 certification',
        'serramenti-feature-6': 'Modern design (finishes, colors, special shapes)',
        'serramenti-feature-7': 'European cylinder or double map locks',
        'serramenti-feature-8': 'Patented systems',
        'serramenti-feature-9': 'Armored structure (steel, reinforced tubes, anti-cut plates)',
        'serramenti-feature-10': 'Anti-corrosion (oven painting and primer)',
        'serramenti-feature-11': 'Site survey and dedicated consultation',
        'serramenti-feature-12': 'Technical assistance',
        'serramenti-feature-13': 'Post-sales support',
        'serramenti-cta': 'Configure Your Fixtures',
        
        // Sorveglianza Section
        'sorveglianza-title': 'Advanced Video Surveillance Systems',
        'sorveglianza-subtitle': 'Smart eyes that never sleep',
        'sorveglianza-desc': 'Latest generation cameras with integrated artificial intelligence for automatic recognition of anomalous situations. 24/7 remote monitoring with instant smartphone notifications.',
        'sorveglianza-feature-1': 'Video surveillance and intelligent video analysis',
        'sorveglianza-feature-2': 'Remote control from app and operations center',
        'sorveglianza-feature-3': 'Event management with blockchain',
        'sorveglianza-feature-4': 'Rapid intervention and armed patrols',
        'sorveglianza-feature-5': '24h/365 service',
        'sorveglianza-feature-6': 'Anti-tampering',
        'sorveglianza-feature-7': 'Anti-robbery/anti-panic',
        'sorveglianza-feature-8': 'Connectable to 112 (public ops.)',
        'sorveglianza-feature-9': 'Telecare',
        'sorveglianza-feature-10': 'Anti-jammer systems',
        'sorveglianza-feature-11': 'Modular on customer request',
        'sorveglianza-feature-12': 'h24 support and assistance',
        'sorveglianza-feature-13': 'Personalized security consulting',
        'sorveglianza-cta': 'Design Your System',
        
        // Allarmi Section
        'allarmi-title': 'Smart Alarm Systems',
        'allarmi-subtitle': 'Smart and connected protection',
        'allarmi-desc': 'Next-generation alarm control panels with wireless sensors and IoT connectivity. Complete control via mobile app with instant push notifications and integration with security services.',
        'allarmi-feature-1': 'Advanced volumetric and perimeter protection',
        'allarmi-feature-2': 'Entrance control with predynamic sensor',
        'allarmi-feature-3': 'Integrated anti-aggression and panic system',
        'allarmi-feature-4': 'GSM modem with dedicated APP and voice synthesis',
        'allarmi-feature-5': 'Direct connection to 112 and telecare',
        'allarmi-feature-6': 'Anti-jammer and anti-tampering system',
        'allarmi-feature-7': 'Modular and transferable as needed',
        'allarmi-cta': 'Customize Your Alarm',
        
        // Nebbiogeni Page Translations
        'nebbiogeni-hero-subtitle': 'Instant protection with security fogging. Stop thieves in seconds with the most advanced technology.',
        'nebbiogeni-hero-cta1': 'Learn More',
        'nebbiogeni-hero-cta2': 'Request Quote',
        'nebbiogeni-tech-title': 'Advanced Fog Technology',
        'nebbiogeni-tech-description': 'Our fog systems represent the most advanced frontier in anti-theft protection. In case of intrusion, the system instantly releases a dense fog that reduces visibility to zero, forcing intruders to immediately abandon the premises.',
        'nebbiogeni-feature-1': 'Anti-intrusion fog system certified EN 50131-8:2019',
        'nebbiogeni-feature-2': 'Rapid start (fog delivery in seconds)',
        'nebbiogeni-feature-3': 'Volumetric protection',
        'nebbiogeni-feature-4': 'Non-toxic and harmless fluid (certified and residue-free)',
        'nebbiogeni-feature-5': 'Anti-tampering systems',
        'nebbiogeni-feature-6': 'Scheduled maintenance included',
        'nebbiogeni-feature-7': 'CE certifications and regulatory compliance',
        'nebbiogeni-feature-8': 'Extended warranty up to 2 years',
        'nebbiogeni-feature-9': 'Modular for small/large environments',
        'nebbiogeni-feature-10': 'Adjustable nozzles',
        'nebbiogeni-feature-11': 'Simplified installation',
        'nebbiogeni-feature-12': 'Patented technology (layer boiler, FOG STORM pump)',
        'nebbiogeni-feature-13': 'Pre and post-sales support',
        'nebbiogeni-cta-vantaggi': 'Advantages',
        'nebbiogeni-cta-preventivo': 'Free Quote',
        'nebbiogeni-why-title': 'Why Choose Fog Systems',
        'nebbiogeni-why-subtitle': 'The most effective solution to protect your business',
        'nebbiogeni-advantage-1-title': 'Instant Activation',
        'nebbiogeni-advantage-1-desc': 'The system activates in less than 10 seconds, immediately creating an impenetrable barrier of dense fog.',
        'nebbiogeni-advantage-2-title': 'Total Protection',
        'nebbiogeni-advantage-2-desc': 'Reduces visibility to zero making it impossible for thieves to navigate and complete the theft.',
        'nebbiogeni-advantage-3-title': 'Completely Safe',
        'nebbiogeni-advantage-3-desc': 'The fog is non-toxic, does not harm people, animals or objects. Certified for use in closed environments.',
        'nebbiogeni-advantage-4-title': 'Remote Control',
        'nebbiogeni-advantage-4-desc': 'Manage the system remotely through dedicated app. Receive real-time notifications.',
        'nebbiogeni-advantage-5-title': 'Maintenance Included',
        'nebbiogeni-advantage-5-desc': 'Scheduled maintenance service and 24/7 technical assistance to always ensure maximum operation.',
        'nebbiogeni-advantage-6-title': 'Insurance Savings',
        'nebbiogeni-advantage-6-desc': 'Many insurance companies recognize significant discounts for properties protected by fog systems.',
        'urfog-official-docs-title': 'UR FOG Official Documentation',
        'urfog-official-docs-desc': 'Access complete technical documentation and UR FOG system specifications',
        'urfog-cert-btn-title': 'UR FOG Certifications',
        'urfog-cert-btn-desc': 'View all certifications and regulatory compliance of UR FOG products',
        'urfog-warranty-btn-title': 'UR FOG Warranties',
        'urfog-warranty-btn-desc': 'Complete information on warranty and UR FOG after-sales assistance',
        'xecur-official-docs-title': 'XECUR Official Documentation',
        'xecur-official-docs-desc': 'Access complete technical documentation and XECUR system specifications',
        'xecur-cert-btn-title': 'XECUR Certifications',
        'xecur-cert-btn-desc': 'View all certifications and regulatory compliance of XECUR products',
        'xecur-quality-btn-title': 'XECUR Quality',
        'xecur-quality-btn-desc': 'Complete information on quality standards and XECUR excellence',
        'civis-official-docs-title': 'CIVIS Official Documentation',
        'civis-official-docs-desc': 'Access complete technical documentation and CIVIS system specifications',
        'civis-cert-btn-title': 'CIVIS Certifications',
        'civis-cert-btn-desc': 'View all certifications and regulatory compliance of CIVIS products',
        'nebbiogeni-applications-title': 'Ideal Applications',
        'nebbiogeni-applications-description': 'Fog systems are the perfect solution for a wide range of commercial and residential environments that require the highest level of protection.',
        'nebbiogeni-app-1': 'Shops and shopping centers',
        'nebbiogeni-app-2': 'Jewelry stores and goldsmiths',
        'nebbiogeni-app-3': 'Banks and credit institutions',
        'nebbiogeni-app-4': 'Pharmacies and parapharmacies',
        'nebbiogeni-app-5': 'Offices and professional studios',
        'nebbiogeni-app-6': 'Warehouses and storage facilities',
        'nebbiogeni-app-7': 'Luxury residences',
        'nebbiogeni-app-8': 'Museums and art galleries',
        'nebbiogeni-cta-consulenza': 'Request Consultation',
        'nebbiogeni-cta-servizi': 'Other Services',
        'nebbiogeni-partner-title': 'Our Partner: UR Fog',
        'nebbiogeni-partner-info-title': 'General Information',
        'nebbiogeni-partner-info-desc': 'UR Fog is a world-leading company in the fog security systems market. Their systems stop thieves in seconds, protecting from theft in shops, businesses, homes and banks.',
        'nebbiogeni-partner-services-title': 'Services and Innovation',
        'nebbiogeni-contact-title': 'Request Information',
        'nebbiogeni-contact-description': 'Contact us for a completely free consultation on fog systems. Our experts will evaluate your needs and propose the most suitable solution. You will be contacted by phone by one of our operators as soon as possible.',
        
        // Serramenti Page
        'serramenti-hero-title': 'Armored Security Doors & Windows',
        'serramenti-hero-subtitle': 'Impenetrable physical protection with elegant design. Certified armored doors and windows for maximum security.',
        'serramenti-hero-cta1': 'Learn More',
        'serramenti-hero-cta2': 'Request Quote',
        'serramenti-products-title': 'Main Products',
        'serramenti-products-description': 'Our complete range of armored doors and windows combines maximum security and refined design, with customized solutions for every residential and commercial need.',
        'serramenti-product-1-title': 'Residential Armored Doors',
        'serramenti-product-1-desc': 'Certified class 3 and 4 armored doors with customizable design for private homes.',
        'serramenti-product-2-title': 'Anti-Burglary Windows',
        'serramenti-product-2-desc': 'Windows with laminated glass and reinforced frames for total protection.',
        'serramenti-product-3-title': 'Commercial Doors & Windows',
        'serramenti-product-3-desc': 'Professional solutions for shops, offices and commercial activities.',
        'serramenti-tech-title': 'Technical Features',
        'serramenti-tech-description': 'Each door and window is designed according to the highest European security standards, using top-quality materials and cutting-edge technologies.',
        'serramenti-tech-1': 'Anti-burglary certification class 4',
        'serramenti-tech-2': 'European multipoint locks',
        'serramenti-tech-3': 'Laminated shatterproof glass',
        'serramenti-tech-4': 'Reinforced steel frames',
        'serramenti-tech-5': 'Thermal-acoustic seals',
        'serramenti-tech-6': 'Anti-lifting hinges',
        'serramenti-tech-7': 'Security defenders and spurs',
        'serramenti-tech-8': 'Insulated panels',
        'serramenti-types-title': 'Types of Doors & Windows',
        'serramenti-types-description': 'We offer a wide range of armored doors and windows to meet every security and design need, from private residences to the most demanding commercial environments.',
        'serramenti-type-1': 'Armored doors for apartments',
        'serramenti-type-2': 'Armored doors for villas',
        'serramenti-type-3': 'Armored windows and shutters',
        'serramenti-type-4': 'Shop security doors',
        'serramenti-type-5': 'Certified fire doors',
        'serramenti-type-6': 'Gates and fencing',
        'serramenti-installation-title': 'Installation Process',
        'serramenti-installation-description': 'Our installation process guarantees millimeter precision and respect for deadlines, with a complete service from design to final testing.',
        'serramenti-install-1': 'Site survey and personalized design',
        'serramenti-install-2': 'Custom factory production',
        'serramenti-install-3': 'Certified professional installation',
        'serramenti-install-4': 'Final testing and warranty',
        'serramenti-cta-consulenza': 'Request Consultation',
        'serramenti-cta-catalogo': 'Download Catalog',
        'serramenti-partner-title': 'Our Partner: Xecur Srl',
        'serramenti-partner-info-title': 'General Information',
        'serramenti-partner-info-desc': 'Xecur Srl is a leading company in the production of armored doors and passive security systems. With over 30 years of experience, it guarantees the highest quality products certified according to the most severe European standards.',
        'serramenti-partner-services-title': 'Services and Innovations',
        'serramenti-partner-service-1': 'Custom design and production',
        'serramenti-partner-service-2': 'Anti-burglary certifications class 1-6',
        'serramenti-partner-service-3': 'Continuous research and development',
        'serramenti-partner-service-4': 'Specialized technical assistance',
        'serramenti-partner-service-5': 'Extended warranty on all products',
        'serramenti-contact-title': 'Request Information',
        'serramenti-contact-description': 'Contact us for a completely free consultation on armored doors and windows. Our experts will evaluate your needs and propose the most suitable solution. You will be contacted by phone by one of our operators as soon as possible.',
        'serramenti-form-name': 'Full Name',
        'serramenti-form-email': 'Email',
        'serramenti-form-phone': 'Phone',
        'serramenti-form-message': 'Message',
        'serramenti-form-privacy': 'I accept the processing of personal data according to the',
        'serramenti-form-submit': 'Send Request',
        
        // Why Choose Us
        'why-choose-title': 'Why Choose FB Total Security',
        'why-choose-subtitle': 'Your security is our absolute priority',
        'why-choose-feature-1': 'Twenty years of experience in the security sector',
        'why-choose-feature-2': 'Certified and cutting-edge technologies',
        'why-choose-feature-3': 'Specialized 24/7 technical assistance',
        'why-choose-feature-4': 'Total warranty on all installed products',
        'feature-experience-title': 'Years of Multi-sector Experience',
        'feature-experience-desc': 'Over 20 years in the security sector with thousands of completed installations',
        'feature-certifications-title': 'Professional Certifications',
        'feature-certifications-desc': 'Certified technicians updated on the latest security technologies',
        'feature-support-title': '24/7 Support',
        'feature-support-desc': 'Continuous technical support and rapid interventions to always guarantee your protection',
        
        // Client Solutions Section
        'client-solutions-title': 'Tailored Solutions for Every Need',
        'client-solutions-subtitle': 'From private residence to company, we design the perfect security for you',
        'client-residential': 'Residential Clients',
        'client-residential-desc': 'Protect your family and home with discreet and effective security systems',
        'client-residential-feature-1': 'Invisible integrated systems',
        'client-residential-feature-2': 'Smartphone control',
        'client-residential-feature-3': 'Non-invasive installation',
        'client-commercial': 'Commercial Clients',
        'client-commercial-desc': 'Professional solutions for offices, shops and commercial activities',
        'client-commercial-feature-1': 'Multi-site monitoring',
        'client-commercial-feature-2': 'Advanced reporting',
        'client-commercial-feature-3': 'Management integration',
        'client-industrial': 'Industrial Clients',
        'client-industrial-desc': 'Perimeter protection and access control for plants and warehouses',
        'client-industrial-feature-1': 'Perimeter protection',
        'client-industrial-feature-2': 'Biometric access control',
        'client-industrial-feature-3': 'Anti-intrusion systems',
        'client-solutions-cta': 'Request Personalized Consultation',
        
        // Contact Section
        'contact-title': 'Contact FB Total Security',
        'contact-subtitle': 'Request a completely free consultation to evaluate your security needs. Site inspection and quote without obligation. You will be contacted by phone by one of our operators as soon as possible.',
        'contact-phone-label': 'Phone',
        'contact-email-label': 'Email',
        'contact-area-label': 'Service Area',
        'contact-area-text': 'All Italy',
        'contact-name': 'Full Name',
        'contact-email': 'Email',

        'contact-service': 'Service of Interest',
        'contact-service-option-1': 'Fog Security System',
        'contact-service-option-2': 'Armored Doors',
        'contact-service-option-3': 'Video Surveillance',
        'contact-service-option-4': 'Alarm Systems',
        'contact-service-option-5': 'General Consultation',
        'contact-message': 'Message',
        'contact-privacy': 'I accept the processing of personal data according to the',
        'contact-privacy-link': 'Privacy Policy',
        'contact-submit': 'Send Request',
        
        // Contact Form
        'form-title': 'Request Information',
        'form-name-label': 'Name and Surname',
        'form-email-label': 'Email',
        'form-phone-label': 'Phone',
        'form-message-label': 'Message',
        'form-name-placeholder': 'Name and Surname',
        'form-email-placeholder': 'Email',

        'form-service-label': 'Service of interest',
        'form-service-default': 'Select the service of interest',
        'form-service-nebbiogeni': 'Fog Systems',
        'form-service-serramenti': 'Security Doors & Windows',
        'form-service-sorveglianza': 'Video Surveillance',
        'form-service-allarmi': 'Alarm Systems',
        'form-service-consulenza': 'General Consultation',
        'form-message-placeholder': 'Describe your security needs',
        'form-privacy-label': 'I accept the processing of personal data according to the <a href="termini-condizioni.html" target="_blank" style="color: #4caf50; text-decoration: underline;">Terms and Conditions</a>',
        'form-submit-btn': 'Send Request',
        
        // Footer
        'footer-description': 'Security creators specialized in advanced protection systems. Your security is our priority.',
        'footer-services-title': 'Services',
        'footer-service-nebbiogeni': 'Fog Systems',
        'footer-service-serramenti': 'Armored Doors & Windows',
        'footer-service-sorveglianza': 'Video Surveillance',
        'footer-service-allarmi': 'Alarm Systems',
        'footer-contacts-title': 'Contacts',
        'footer-info-title': 'Information',
        'footer-social-title': 'Follow Us',
        'footer-copyright': '© 2024 FB Total Security. All rights reserved. | VAT: 12345678901',
        'footer-company': 'FB Total Security',
        'footer-company-desc': 'Security creators since 2003. Specialized in advanced protection systems for businesses and individuals.',
        'footer-services': 'Services',
        'footer-company-info': 'Company',
        'footer-contact': 'Contact',
        
        // Sorveglianza Page
        'sorveglianza-hero-title': 'Advanced Video Surveillance Systems',
        'sorveglianza-hero-subtitle': 'Intelligent 24/7 protection with latest generation technologies. Monitor and protect your spaces with cutting-edge video surveillance systems.',
        'sorveglianza-hero-cta1': 'Learn More',
        'sorveglianza-hero-cta2': 'Request Quote',
        'sorveglianza-tech-title': 'Advanced Surveillance Technologies',
        'sorveglianza-tech-description': 'Our video surveillance systems integrate the most modern artificial intelligence and computer vision technologies to offer complete and intelligent protection of your spaces.',
        'sorveglianza-tech-feature-1': '4K Ultra HD cameras with optical zoom',
        'sorveglianza-tech-feature-2': 'Advanced night vision up to 50 meters',
        'sorveglianza-tech-feature-3': 'Automatic facial and license plate recognition',
        'sorveglianza-tech-feature-4': 'Behavioral analysis with integrated AI',
        'sorveglianza-tech-feature-5': 'Secure cloud storage and automatic backup',
        'sorveglianza-tech-feature-6': 'Remote access from smartphone and tablet',
        'sorveglianza-tech-cta1': 'Advantages',
        'sorveglianza-tech-cta2': 'Free Quote',
        'sorveglianza-features-title': 'Advanced Features',
        'sorveglianza-features-subtitle': 'Cutting-edge technologies for maximum security',
        'sorveglianza-feature-1-title': '4K Resolution',
        'sorveglianza-feature-1-desc': 'Crystal clear high-definition images for every detail',
        'sorveglianza-feature-2-title': 'Night Vision',
        'sorveglianza-feature-2-desc': 'Effective monitoring even in low light conditions',
        'sorveglianza-feature-3-title': 'Artificial Intelligence',
        'sorveglianza-feature-3-desc': 'Automatic recognition of people, vehicles and anomalous behaviors',
        'sorveglianza-feature-4-title': 'Cloud Storage',
        'sorveglianza-feature-4-desc': 'Secure cloud storage with access from any device',
        'sorveglianza-systems-title': 'Types of Systems',
        'sorveglianza-systems-description': 'We offer different video surveillance solutions to adapt to every specific need, from residential protection to complex industrial systems.',
        'sorveglianza-systems-feature-1': 'Latest generation IP systems',
        'sorveglianza-systems-feature-2': 'Professional dome and bullet cameras',
        'sorveglianza-systems-feature-3': 'Integration with existing alarm systems',
        'sorveglianza-systems-feature-4': 'Integrated access control',
        'sorveglianza-systems-feature-5': 'Advanced perimeter monitoring',
        'sorveglianza-systems-cta1': 'Discover Types',
        'sorveglianza-systems-cta2': 'Request Consultation',
        'sorveglianza-advantages-title': 'Video Surveillance Advantages',
        'sorveglianza-advantages-subtitle': 'Complete protection for your peace of mind',
        'sorveglianza-advantage-1-title': 'Visual Deterrent',
        'sorveglianza-advantage-1-desc': 'The visible presence of cameras discourages malicious individuals',
        'sorveglianza-advantage-2-title': 'Remote Monitoring',
        'sorveglianza-advantage-2-desc': 'Control your spaces from anywhere via smartphone',
        'sorveglianza-advantage-3-title': 'Legal Evidence',
        'sorveglianza-advantage-3-desc': 'High-quality recordings usable as legal evidence',
        'sorveglianza-advantage-4-title': 'Instant Notifications',
        'sorveglianza-advantage-4-desc': 'Real-time alerts for suspicious events or alarms',
        'sorveglianza-installation-title': 'Professional Installation',
        'sorveglianza-installation-description': 'Our team of specialized technicians guarantees professional installation and optimal configuration of the video surveillance system.',
        'sorveglianza-installation-feature-1': 'Free site survey and personalized design',
        'sorveglianza-installation-feature-2': 'Certified installation by qualified technicians',
        'sorveglianza-installation-feature-3': 'Complete system configuration and testing',
        'sorveglianza-installation-feature-4': 'Training on use and maintenance',
        'sorveglianza-installation-cta1': 'Book Site Survey',
        'sorveglianza-partner-title': 'Partner CIVIS',
        'sorveglianza-partner-description': 'We collaborate with CIVIS, leader in the professional video surveillance sector, to guarantee the highest quality products and cutting-edge technologies.',
        'sorveglianza-partner-service-1': 'Advanced IP video surveillance systems',
        'sorveglianza-partner-service-2': 'Cameras with integrated artificial intelligence',
        'sorveglianza-partner-service-3': 'Professional management software',
        'sorveglianza-partner-service-4': 'Specialized 24/7 technical support',
        'sorveglianza-partner-service-5': 'Extended warranty on all products',
        'sorveglianza-contact-title': 'Request Information',
        'sorveglianza-contact-description': 'Contact us for a completely free consultation on video surveillance systems. Our experts will evaluate your needs and propose the most suitable solution. You will be contacted by phone by one of our operators as soon as possible.',
        'sorveglianza-form-name': 'Full Name',
        'sorveglianza-form-email': 'Email',
        'sorveglianza-form-phone': 'Phone',
        'sorveglianza-form-message': 'Message',
        'sorveglianza-form-privacy': 'I accept the processing of personal data according to the',
        'sorveglianza-form-submit': 'Send Request',
        
        // Allarmi page translations
        'allarmi-hero-title': 'Intelligent Alarm Systems',
        'allarmi-hero-subtitle': 'Smart and connected protection with latest generation technologies. Control and monitor your spaces with advanced alarm systems.',
        'allarmi-hero-cta1': 'Learn More',
        'allarmi-hero-cta2': 'Request Quote',
        'allarmi-components-title': 'System Components',
        'allarmi-components-description': 'Our alarm systems integrate the most advanced components to offer complete and reliable protection of your spaces.',
        'allarmi-components-feature-1': 'Wireless sensors with long-range technology',
        'allarmi-components-feature-2': 'Control panels with touch display',
        'allarmi-components-feature-3': 'Motion detectors with pet immunity',
        'allarmi-components-feature-4': 'Magnetic contacts for doors and windows',
        'allarmi-components-feature-5': 'Glass break detectors with dual technology',
        'allarmi-components-feature-6': 'Outdoor sirens with anti-tampering',
        'allarmi-components-cta1': 'Components',
        'allarmi-components-cta2': 'Free Quote',
        'allarmi-tech-title': 'Advanced Technologies',
        'allarmi-tech-subtitle': 'Innovation at the service of your security',
        'allarmi-tech-feature-1-title': 'Wireless Technology',
        'allarmi-tech-feature-1-desc': 'Wireless sensors with encrypted communication and long battery life',
        'allarmi-tech-feature-2-title': 'Mobile App',
        'allarmi-tech-feature-2-desc': 'Complete control via smartphone with real-time notifications',
        'allarmi-tech-feature-3-title': 'Artificial Intelligence',
        'allarmi-tech-feature-3-desc': 'Smart algorithms to reduce false alarms and improve detection',
        'allarmi-tech-feature-4-title': 'Cloud Integration',
        'allarmi-tech-feature-4-desc': 'Secure cloud storage and remote access from any device',
        'allarmi-systems-title': 'Types of Systems',
        'allarmi-systems-description': 'We offer different alarm solutions to adapt to every specific need, from residential protection to complex commercial systems.',
        'allarmi-systems-feature-1': 'Wireless systems with encrypted communication',
        'allarmi-systems-feature-2': 'Hybrid systems with wired and wireless sensors',
        'allarmi-systems-feature-3': 'Integration with video surveillance systems',
        'allarmi-systems-feature-4': 'Connection to 24/7 monitoring centers',
        'allarmi-systems-feature-5': 'Home automation integration',
        'allarmi-systems-cta1': 'Discover Types',
        'allarmi-systems-cta2': 'Request Consultation',
        'allarmi-advantages-title': 'Advantages of Our Systems',
        'allarmi-advantages-subtitle': 'Complete protection for your peace of mind',
        'allarmi-advantage-1-title': 'Instant Detection',
        'allarmi-advantage-1-desc': 'Immediate detection of intrusions with instant notifications',
        'allarmi-advantage-2-title': 'Remote Control',
        'allarmi-advantage-2-desc': 'Arm and disarm the system from anywhere via smartphone',
        'allarmi-advantage-3-title': 'Smart Notifications',
        'allarmi-advantage-3-desc': 'Real-time alerts with photos and videos of detected events',
        'allarmi-advantage-4-title': '24/7 Monitoring',
        'allarmi-advantage-4-desc': 'Connection to professional monitoring centers for immediate intervention',
        'allarmi-installation-title': 'Installation Process',
        'allarmi-installation-description': 'Our team of specialized technicians guarantees professional installation and optimal configuration of the alarm system.',
        'allarmi-installation-feature-1': 'Free site survey and security analysis',
        'allarmi-installation-feature-2': 'Certified installation by qualified technicians',
        'allarmi-installation-feature-3': 'Complete system configuration and testing',
        'allarmi-installation-feature-4': 'Training on use and mobile app',
        'allarmi-installation-cta1': 'Book Site Survey',
        'allarmi-partner-title': 'Partner Gruppo ITL',
        'allarmi-partner-description': 'We collaborate with Gruppo ITL, leader in the professional security sector, to guarantee the highest quality products and cutting-edge technologies.',
        'allarmi-partner-service-1': 'Advanced wireless alarm systems',
        'allarmi-partner-service-2': 'Professional monitoring centers',
        'allarmi-partner-service-3': 'Mobile applications and cloud platforms',
        'allarmi-partner-service-4': 'Specialized 24/7 technical support',
        'allarmi-partner-service-5': 'Extended warranty on all products',
        'allarmi-contact-title': 'Request Information',
        'allarmi-contact-description': 'Contact us for a completely free consultation on alarm systems. Our experts will evaluate your needs and propose the most suitable solution. You will be contacted by phone by one of our operators as soon as possible.',
        'allarmi-form-name': 'Full Name',
        'allarmi-form-email': 'Email',
        'allarmi-form-phone': 'Phone',
        'allarmi-form-message': 'Message',
        'allarmi-form-privacy': 'I accept the processing of personal data according to the',
        'allarmi-form-submit': 'Send Request',
        
        // Chi Siamo page - English
        'chi-siamo-meta-title': 'About Us - FB Total Security | Milan',
        'chi-siamo-meta-description': 'Discover FB Total Security: authorized and certified agency in professional security. Specialists in fog systems, armored fixtures, video surveillance and alarms with direct partnerships from industry leaders.',
        'chi-siamo-og-title': 'About Us - FB Total Security | Security Creators',
        'chi-siamo-og-description': 'Discover FB Total Security, authorized and certified agency in professional security throughout Italy with direct partnerships from industry leaders.',
        'chi-siamo-hero-title': 'About Us',
        'chi-siamo-hero-subtitle': 'FB Total Security: authorized and certified agency with direct partnerships from industry leaders. Discover our values and certifications that make us the ideal partner for your security.',
        'chi-siamo-hero-cta1': 'Our Story',
        'chi-siamo-hero-cta2': 'Contact Us',
        'chi-siamo-storia-title': 'Our Story',
        'chi-siamo-storia-desc1': 'FB Total Security was born from the passion and experience of security sector professionals with over 20 years of activity. Our mission is to protect people, assets and activities through cutting-edge technological solutions and excellent service.',
        'chi-siamo-storia-desc2': 'Our strength lies in professional certifications, official authorizations and direct relationships with the best international brands. We offer integrated multi-sector solutions with a single agency. This allows us to offer cutting-edge solutions and guarantee maximum quality in every intervention, building our reputation on the certified technical competence of our team.',
        
        // Values section - English
        'chi-siamo-valori-title': 'Our Values',
        'chi-siamo-valori-subtitle': 'Principles that guide every our intervention',
        'chi-siamo-valore1-title': 'Authorized Agency',
        'chi-siamo-valore1-desc': 'We are an officially authorized agency with all the necessary certifications to operate in the security sector. Our expertise ranges from residential to commercial and industrial systems, always in compliance with current regulations.',
        'chi-siamo-valore2-title': 'Exclusive Partnerships',
        'chi-siamo-valore2-desc': 'We maintain direct relationships and exclusive partnerships with world leaders in the security sector. These direct mandates allow us to access the most advanced technologies and offer certified products with extended warranties and specialized technical support.',
        'chi-siamo-valore3-title': 'Continuous Assistance',
        'chi-siamo-valore3-desc': 'Our support does not end with installation. We offer continuous technical assistance, 24/7 emergency interventions and scheduled maintenance to always guarantee maximum efficiency of your systems.',
        
        // Specializations section - English
        'chi-siamo-specializzazioni-title': 'Our Specializations',
        'chi-siamo-specializzazioni-subtitle': 'Four areas of excellence for your total security',
        'chi-siamo-spec1-title': 'Fog Systems',
        'chi-siamo-spec1-desc': 'Cutting-edge technology for immediate protection against intrusions. Our fog systems create a dense fog barrier in seconds, making it impossible for criminals to orient themselves and continue criminal action.',
        'chi-siamo-spec1-link': 'Learn more',
        'chi-siamo-spec2-title': 'Armored Fixtures',
        'chi-siamo-spec2-desc': 'Armored doors, security windows and latest generation anti-burglary fixtures. We design and install tailor-made solutions that combine maximum security and refined aesthetics for any type of environment.',
        'chi-siamo-spec2-link': 'Learn more',
        'chi-siamo-spec3-title': 'Video Surveillance',
        'chi-siamo-spec3-desc': 'Intelligent video surveillance systems with integrated AI technologies. 4K cameras, night vision, facial recognition and behavioral analysis for complete and automated control of your property.',
        'chi-siamo-spec3-link': 'Learn more',
        'chi-siamo-spec4-title': 'Alarm Systems',
        'chi-siamo-spec4-desc': 'Latest generation wireless and wired alarms with intelligent sensors, panic buttons and remote control. Modular and scalable systems that adapt perfectly to your specific security needs.',
        'chi-siamo-spec4-link': 'Learn more',
        
        // Why choose us section - English
        'chi-siamo-perche-title': 'Why Choose FB Total Security',
        'chi-siamo-perche-subtitle': 'The difference that makes the difference',
        'chi-siamo-approccio-title': 'Personalized Approach',
        'chi-siamo-approccio-desc': 'Every customer is unique, as are their security needs. We always start with a free site survey to understand your specific needs and design the most suitable solution. We don\'t sell standard products, we create tailor-made systems.',
        'chi-siamo-approccio-feat1': 'Free site survey and consultation',
        'chi-siamo-approccio-feat2': 'Personalized design',
        'chi-siamo-approccio-feat3': 'Detailed and transparent quotes',
        'chi-siamo-approccio-feat4': 'Modular and scalable solutions',
        'chi-siamo-tecnologia-title': 'Technology and Innovation',
        'chi-siamo-tecnologia-desc': 'We constantly invest in research and development to always offer you the most advanced technologies. From AI solutions for facial recognition to IoT systems for remote control, we are always one step ahead.',
        'chi-siamo-tecnologia-feat1': 'AI and machine learning technologies',
        'chi-siamo-tecnologia-feat2': 'IoT systems and remote control',
        'chi-siamo-tecnologia-feat3': 'Dedicated mobile apps',
        'chi-siamo-tecnologia-feat4': 'Smart home integration',
        'chi-siamo-tecnologia-feat5': 'Continuous software updates',
        'chi-siamo-cta-text': 'Want to know more about our experience and services? Contact us for a free consultation.',
        'chi-siamo-cta-btn': 'Request Free Consultation',
        
        // Contact section - English
        'chi-siamo-contact-title': 'Contact FB Total Security',
        'chi-siamo-contact-desc': 'Request a free consultation to evaluate your security needs. Site survey and quote without obligation.',
        'chi-siamo-service-area-title': 'Service Area',
        'chi-siamo-service-area-text': 'All Italy',
        
        // Footer additional - English
        'footer-company-name': 'FB Total Security',
        'footer-service-area': 'All Italy',
        
        // Meta tags and components for allarmi.html - English
        'allarmi-meta-title': 'Alarm Systems - Anti-theft & Security | Milan',
        'allarmi-meta-description': 'Professional anti-theft alarm systems, wireless sensors, control panels. Complete protection for home and office. Installation in Milan and province.',
        'allarmi-og-title': 'Alarm Systems - Advanced Anti-theft and Security',
        'allarmi-og-description': 'Professional anti-theft alarm systems with wireless sensors and remote control.',
        'allarmi-component-1': 'Advanced volumetric protection',
        'allarmi-component-2': 'Intelligent perimeter system',
        'allarmi-component-3': 'Entrance control with predynamic sensor',
        'allarmi-component-4': 'Personal and anti-aggression protection',
        'allarmi-component-5': 'Voice synthesis and GSM communication',
        'allarmi-component-6': 'Anti-panic and telecare system',
        'allarmi-component-7': 'Anti-jammer and anti-tampering protection',
        'allarmi-component-8': 'Modular sirens and transferable system',
        'itl-official-docs-title': 'Official ITL GROUP Documentation',
        'itl-official-docs-desc': 'Access official warranties from our technology partner',
        'itl-warranty-btn-title': 'ITL GROUP Warranties',
        'itl-warranty-btn-desc': 'Home anti-theft warranty and complete assistance',
        'allarmi-partnership-title': 'Premium Partnership',
        'allarmi-partnership-desc': 'We collaborate with industry leaders to offer you the best security solutions',
        'allarmi-partner-name': 'ITL Group',
        'allarmi-partner-desc': 'Blue Lock alarm systems with wireless control and installation without masonry work. Exclusive predynamic sensors with protection up to 500sqm on multiple levels. Smartphone management app, direct connectivity to Law Enforcement, automatic discrimination technology between false alarms and real threats. Integrated Overlook video surveillance service. <strong>Standard 24-month warranty</strong>, extendable for life with annual "Protected & Safe" maintenance.',
        'allarmi-partner-feature-1': 'Wireless Control',
        'allarmi-partner-feature-2': 'Predynamic Sensors',
        'allarmi-partner-feature-3': '500sqm Protection',
        'allarmi-partner-feature-4': 'Smartphone App',
        'allarmi-partner-feature-5': 'Overlook Integrated',
        'allarmi-partner-feature-6': 'Lifetime Warranty Extension',
        'allarmi-certifications-title': 'Certifications and Warranties',
        'allarmi-cert-1-title': 'Regulatory Compliance',
        'allarmi-cert-1-desc': 'Italy and Europe',
        'allarmi-cert-2-title': 'Predynamic Sensor',
        'allarmi-cert-2-desc': 'Patented Integrated',
        'allarmi-cert-3-title': '24-Month Warranty',
        'allarmi-cert-3-desc': 'Extendable for Life',
        'allarmi-cert-4-title': 'Protected & Safe',
        'allarmi-cert-4-desc': 'Complete Approach',
        
        // Alarm technologies
        'allarmi-tech-1-title': 'Advanced Wireless',
        'allarmi-tech-1-desc': 'Bidirectional wireless communication with advanced encryption for maximum security and reliability.',
        'allarmi-tech-2-title': 'Long-Life Batteries',
        'allarmi-tech-2-desc': 'Lithium batteries with up to 5-year lifespan and automatic replacement notifications.',
        'allarmi-tech-3-title': 'Internet Control',
        'allarmi-tech-3-desc': 'Complete internet management with push notifications and control from anywhere in the world.',
        'allarmi-tech-4-title': 'Anti-Sabotage',
        'allarmi-tech-4-desc': 'Anti-tampering protection on all components with immediate signaling of attempts.',
        'allarmi-tech-5-title': 'Energy Backup',
        'allarmi-tech-5-desc': 'Integrated backup batteries for continuous operation even during blackouts.',
        'allarmi-tech-6-title': 'Precise Detection',
        'allarmi-tech-6-desc': 'Pet-immune technology sensors to avoid false alarms caused by domestic animals.',
        'allarmi-types-title': 'System Types',
        'allarmi-types-description': 'Customized solutions for every security need, from residential protection to advanced commercial systems.',
        'allarmi-type-1': 'Volumetric system with motion detection',
        'allarmi-type-2': 'Advanced perimeter protection',
        'allarmi-type-3': 'Entrance control with predynamic technology',
        'allarmi-type-4': 'Personal and anti-aggression protection',
        'allarmi-type-5': 'Anti-panic system with 112 connection',
        'allarmi-type-6': 'GSM communication with APP and voice synthesis',
        'allarmi-type-7': 'Anti-jammer and anti-tampering protection',
        'allarmi-type-8': 'Modular and transferable system',
        'allarmi-types-cta1': 'Discover the Advantages',
        'allarmi-types-cta2': 'Other Services',
        'allarmi-advantage-5-title': 'Insurance Savings',
        'allarmi-advantage-5-desc': 'Significant reductions on insurance premiums thanks to system certification.',
        'allarmi-advantage-6-title': 'Minimal Maintenance',
        'allarmi-advantage-6-desc': 'Wireless systems with self-diagnostics and minimal maintenance requirements.',
        'allarmi-installation-1': 'Free technical survey',
        'allarmi-installation-2': 'Customized design',
        'allarmi-installation-3': 'Certified installation',
        'allarmi-installation-4': 'Complete configuration and testing',
        'allarmi-installation-5': 'Usage training',
        'allarmi-installation-6': 'Compliance certification',
        'allarmi-installation-7': 'After-sales support',
        'allarmi-installation-8': 'Scheduled maintenance',
        'contact-description': 'Contact us for a completely free consultation on alarm systems. Our experts will evaluate your needs and propose the most suitable anti-theft solution. You will be contacted by phone by one of our operators as soon as possible.',

        'contact-email-title': 'Email',
        'contact-address-title': 'Address',


        'form-name': 'Full Name',
        'form-email': 'Email',

        'form-message': 'Message',
        'form-privacy': 'I accept the processing of personal data according to the <a href="termini-condizioni.html" target="_blank" style="color: #4caf50; text-decoration: underline;">Terms and Conditions</a>',
        'form-submit': 'Send Request',
        'footer-name': 'FB Total Security',

        'footer-email': '📧 postmaster@fbtotalsecurity.com',
        'footer-address': '📍 Corso Sempione, Milan (MI)',

        'footer-service-area-title': 'Service Area',
        'footer-service-area-location': 'All Italy',
        'footer-service-installation': 'Installation',
        'footer-service-maintenance': 'Maintenance',
        'footer-service-support': '24/7 Support',
        'footer-info-about': 'About Us',
        'footer-info-terms': 'Terms and Conditions',
        
        // Video descriptions and transcriptions
        'video-transcription-title': 'Video Transcription',
        'nebbiogeni-video-description': 'Watch our professional fog system in action, providing immediate protection against intrusions. Advanced technology creates an impenetrable fog barrier in seconds, preventing intruders from navigating and effectively protecting your assets. <a href="#contatti" class="text-link">Contact us for a demonstration</a>.',
        'nebbiogeni-video-transcription': 'The video demonstrates the effectiveness of security fog systems in action. Within seconds of activation, the device releases dense fog that completely fills the environment, reducing visibility to zero and making it impossible for intruders to navigate or locate valuable items. The fog is completely safe for people, animals and objects, leaves no residue and dissipates naturally after a predetermined period.',
        'serramenti-video-description': 'Discover the quality and innovation of Xecur security doors and windows. Our anti-burglary systems offer protection from level IV to level VI, including the highest European security standard (RC6) with Alice V grating. Armored doors, anti-burglary windows and custom solutions to protect your home with style and modern design. <a href="#contatti" class="text-link">Contact us for consultation</a>.',
        'serramenti-video-transcription': 'The video presents the complete range of Xecur security doors and windows, showcasing superior class armored doors with protection from level IV to level VI (RC6 standard), anti-burglary windows with Alice V grating and advanced locking systems. Each product combines maximum security with elegant design, using certified materials and cutting-edge technologies to ensure lasting protection over time.',
        
        // Sorveglianza page
        'sorveglianza-meta-title': 'Video Surveillance - Control & Monitoring | Milan',
        'sorveglianza-meta-description': 'Professional video surveillance systems, IP cameras, remote control. 24/7 monitoring for home and office. Installation in Milan.',
        'sorveglianza-og-title': 'Video Surveillance - Control and Monitoring Systems',
        'sorveglianza-og-description': 'Professional video surveillance systems with IP cameras and 24/7 remote control.',
        'sorveglianza-partnership-title': 'Premium Partnership',
        'sorveglianza-partnership-desc': 'We collaborate with industry leaders to offer you the best security solutions',
        'sorveglianza-civis-title': 'CIVIS',
        'sorveglianza-civis-desc': 'Italian leader in private security and professional 24/7 video surveillance with AI NOD (Neural Object Detection) technologies for intelligent recognition of objects and people. Integrated systems with Blockchain certifications for traceability and authenticity of surveillance data, ensuring maximum security and regulatory compliance.',
        'sorveglianza-civis-ai-nod': 'AI NOD Technology',
        'sorveglianza-civis-blockchain': 'Blockchain Certifications',
        'sorveglianza-civis-neural': 'Neural Recognition',
        'sorveglianza-civis-traceability': 'Data Traceability',
        'sorveglianza-civis-compliance': 'Regulatory Compliance',
        'sorveglianza-certifications-title': 'Certifications and Warranties',
        'sorveglianza-cert-ai-nod': 'AI NOD Certified',
        'sorveglianza-cert-neural': 'Neural Recognition',
        'sorveglianza-cert-blockchain': 'Blockchain Security',
        'sorveglianza-cert-traceability': 'Guaranteed Traceability',
        'sorveglianza-cert-data-integrity': 'Data Integrity',
        'sorveglianza-cert-authenticity': 'Certified Authenticity',
        'sorveglianza-cert-compliance': 'GDPR Compliance',
        'sorveglianza-cert-privacy': 'Protected Privacy',
        'sorveglianza-tech-1': 'High-resolution IP cameras',
        'sorveglianza-tech-2': 'Advanced night vision',
        'sorveglianza-tech-3': 'AI facial recognition',
        'sorveglianza-tech-4': 'Intelligent behavioral analysis',
        'sorveglianza-tech-5': 'Secure encrypted cloud storage',
        'sorveglianza-tech-6': 'Remote smartphone control',
        'sorveglianza-tech-7': 'Instant push notifications',
        'sorveglianza-tech-8': 'Integration with existing systems',
        'sorveglianza-cta-caratteristiche': 'Features',
        'sorveglianza-cta-preventivo': 'Free Quote',
        'sorveglianza-feature-5-title': 'Cloud Storage',
        'sorveglianza-feature-5-desc': 'Secure cloud recordings with automatic backup and access from any device.',
        'sorveglianza-feature-6-title': 'Instant Notifications',
        'sorveglianza-feature-6-desc': 'Immediate push alerts on smartphone for every event detected by the system.',
        'sorveglianza-types-title': 'System Types',
        'sorveglianza-types-description': 'Customized solutions for every security need, from residential protection to advanced commercial systems.',
        'sorveglianza-type-1': 'Systems for private homes',
        'sorveglianza-type-2': 'Commercial video surveillance',
        'sorveglianza-type-3': 'Industrial monitoring',
        'sorveglianza-type-4': 'Perimeter control',
        'sorveglianza-type-5': 'Construction site surveillance',
        'sorveglianza-type-6': 'Anti-vandalism systems',
        'sorveglianza-type-7': 'Integrated access control',
        'sorveglianza-type-8': '24/7 remote monitoring',
        'sorveglianza-cta-consulenza': 'Request Consultation',
        'sorveglianza-cta-servizi': 'Other Services',
        'sorveglianza-advantage-5-title': 'Cost Reduction',
        'sorveglianza-advantage-5-desc': 'Reduce physical security costs and get discounts on insurance policies.',
        'sorveglianza-advantage-6-title': 'Behavioral Analysis',
        'sorveglianza-advantage-6-desc': 'Study people flows and optimize commercial space management.',
        'sorveglianza-installation-1': 'Free site survey and design',
        'sorveglianza-installation-2': 'Certified installation',
        'sorveglianza-installation-3': 'Network and access configuration',
        'sorveglianza-installation-4': 'Complete system testing',
        'sorveglianza-installation-5': 'Usage training',
        'sorveglianza-installation-6': 'After-sales support',
        'sorveglianza-installation-7': 'Scheduled maintenance',
        'sorveglianza-installation-8': 'Software updates included',
        'sorveglianza-cta-sopralluogo': 'Book Site Survey',
        'sorveglianza-cta-assistenza': 'Technical Support',
        'sorveglianza-partner-general-title': 'General Information',
        'sorveglianza-partner-general-desc': 'CIVIS is a private Security Institute with over 50 years of experience in the surveillance and security sector. It offers customized security solutions for homes, shops, offices, companies and public administration.',
        'sorveglianza-partner-services-title': 'Services and Innovation',
        'sorveglianza-partner-service-6': '<strong>Risk analysis:</strong> CIVIS security consultants propose solutions after careful risk analysis.',
        'sorveglianza-partner-service-7': '<strong>Advanced technology and solid experience:</strong> combination of cutting-edge technology and experienced professionals.',
        'sorveglianza-partner-service-8': '<strong>Existing systems adaptation:</strong> possibility to connect existing alarm systems to the CIVIS Operations Center.',

        'sorveglianza-contact-email': 'Email',
        'sorveglianza-contact-address': 'Address',
        'sorveglianza-video-description': 'Discover our professional video surveillance system, the advanced solution for total security for individuals and businesses throughout Italy. Advanced technology with 4K resolution, night vision, intelligent detection and remote control to effectively protect your property. <a href="#contatti" class="text-link">Request a free consultation</a>.',
        'sorveglianza-video-transcript': '<p>Our system represents excellence in professional video surveillance for individuals and businesses. With 4K high-resolution cameras, it guarantees crystal-clear images both day and night thanks to advanced night vision technology.</p><p>The system includes intelligent motion detection, instant push notifications and complete remote control via dedicated app. Perfect for homes, offices and commercial activities.</p>',
        'sorveglianza-contact-hours': 'Hours',
        'sorveglianza-contact-schedule': 'Mon-Fri: 8:00-18:00<br>Sat: 9:00-13:00',
        'contact-form-name': 'Full Name',
        'contact-form-email': 'Email',

        'contact-form-message': 'Message',
        'contact-form-privacy': 'I accept the processing of personal data according to the <a href="termini-condizioni.html" target="_blank" style="color: #4caf50; text-decoration: underline;">Terms and Conditions</a>',
        'contact-form-submit': 'Send Request',
        
        // Missing serramenti translations
        'serramenti-meta-title': 'Security Doors & Windows - Armored Doors | Milan',
        'serramenti-meta-description': 'Security doors and windows, armored doors and anti-burglary fixtures. Maximum protection for home and office. Professional installation in Milan.',
        'serramenti-og-title': 'Security Doors and Windows - Armored Doors and Fixtures',
        'serramenti-og-description': 'Security doors and windows, armored doors and anti-burglary fixtures for maximum protection.',
        'serramenti-product-title': 'High Security Armored Doors',
        'serramenti-product-desc': 'Our armored doors represent the excellence in passive security. Each door is designed and manufactured according to the strictest European standards, offering maximum protection without compromising the aesthetics of your home.',
        'serramenti-feature-5': 'Thermal and acoustic insulation',
        'serramenti-feature-6': 'Customizable finishes',
        'serramenti-feature-7': 'CE certifications and regulatory compliance',
        'serramenti-feature-8': 'Warranty up to 10 years',
        
        // Additional serramenti translations
        'serramenti-product-cta1': 'Features',
        'serramenti-product-cta2': 'Free Quote',
        'serramenti-partnership-title': 'Premium Partnership',
        'serramenti-partnership-desc': 'We collaborate with industry leaders to offer you the best security solutions',
        'serramenti-partner-name': 'XECUR',
        'serramenti-partner-desc': 'Armored grilles and security bars with installation without masonry work, 100% made in Italy internal production processes. Innovative opening systems without joints and minimal space requirements. Thermosetting powder coating for superior resistance, automated sandblasting tunnel. <strong>UNI EN 1627-1630:2011 Certifications</strong> (grilles certified also in Class IV, V and VI; Class V national record). First Class V grille (2013) and ALICE VI product (2018) — unique at national level.',
        'serramenti-partner-tag-1': '100% Made in Italy',
        'serramenti-partner-tag-2': 'No masonry work',
        'serramenti-partner-tag-3': 'UNI EN 1627-1630:2011',
        'serramenti-partner-tag-4': 'Class V National Record',
        'serramenti-partner-tag-5': 'Warranty up to 10 years',
        'serramenti-partner-tag-6': 'ISO 9001:2015',
        
        // Serramenti certifications translations
        'serramenti-certifications-title': 'Certifications and Warranties',
        'serramenti-cert-1-title': 'UNI EN 1627-1630:2011',
        'serramenti-cert-1-desc': 'International anti-burglary classes',
        'serramenti-cert-2-title': 'Class V Record',
        'serramenti-cert-2-desc': 'First national Class V grille (2013)',
        'serramenti-cert-3-title': 'Welding Certification',
        'serramenti-cert-3-desc': 'Certified welding processes',
        'serramenti-cert-4-title': 'ISO 9001:2015',
        'serramenti-cert-4-desc': 'Certified production system',
        'serramenti-cert-5-title': 'Warranty up to 10 years',
        'serramenti-cert-5-desc': 'On operation and permanent certification',
        'serramenti-cert-6-title': '100% Made in Italy',
        'serramenti-cert-6-desc': 'Internal production processes',
        
        // Serramenti characteristics translations
        'serramenti-characteristics-title': 'Technical Characteristics',
        'serramenti-characteristics-subtitle': 'Advanced technology for maximum security',
        'serramenti-char-1-title': 'RC6 Class',
        'serramenti-char-1-desc': 'Maximum security level according to European standards. Tested resistance against attacks with power tools.',
        'serramenti-char-2-title': 'Anti-Bumping Locks',
        'serramenti-char-2-desc': 'Latest generation European cylinders with protection against bumping, picking and drilling.',
        'serramenti-char-3-title': 'Reinforced Hinges',
        'serramenti-char-3-desc': 'Anti-burglary hinges in tempered steel, invisible from the outside and with anti-removal system.',
        'serramenti-char-4-title': 'Thermal-Acoustic Insulation',
        'serramenti-char-4-desc': 'Excellent thermal and acoustic insulation performance for optimal living comfort.',
        
        // Additional serramenti characteristics and types
        'serramenti-char-5-title': 'Customizable Design',
        'serramenti-char-5-desc': 'Wide range of finishes, colors and styles to perfectly match your furniture.',
        'serramenti-char-6-title': 'Certifications',
        'serramenti-char-6-desc': 'All products are CE certified and comply with Italian and European safety regulations.',
        'serramenti-types-desc': 'We offer a wide range of armored doors and windows to meet every security and design need, from private residences to the most demanding commercial environments.',
        'serramenti-type-7': 'Certified fire doors',
        'serramenti-type-8': 'Access control systems',
        'serramenti-types-cta1': 'Request Consultation',
        'serramenti-types-cta2': 'Other Services',
        'serramenti-installation-subtitle': 'Complete service from design to maintenance',
        'serramenti-install-1-title': '1. Free Survey',
        'serramenti-install-1-desc': 'Detailed analysis of your needs and precise measurement for custom design.',
        'serramenti-install-2-title': '2. Design',
        'serramenti-install-2-desc': 'Development of the optimal solution considering security, aesthetics and available budget.',
        'serramenti-install-3-title': '3. Production',
        'serramenti-install-3-desc': 'Custom manufacturing in our workshops with certified materials and quality controls.',
        'serramenti-install-4-title': '4. Installation',
        'serramenti-install-4-desc': 'Professional assembly by specialized technicians with minimal disturbance to you.',
        'serramenti-install-5-title': '5. Testing',
        'serramenti-install-5-desc': 'Complete functionality test and delivery of technical documentation and warranties.',
        'serramenti-install-6-title': '6. Support',
        'serramenti-install-6-desc': 'Scheduled maintenance service and technical assistance for the entire warranty period.',
        'serramenti-contact-desc': 'Contact us for a free consultation on security doors and windows. Our experts will evaluate your needs and propose the most suitable solution.',
        'footer-installation': 'Installation',
        'footer-maintenance': 'Maintenance',
        'footer-support': '24/7 Support',
        'page-title': 'Security and Alarm Systems | FB Total Security Milan',
        'page-description': 'FB Total Security offers advanced security systems: alarms, video surveillance, fog systems and armored fixtures. Complete protection for home and business in Milan.',
        'nebbiogeni-page-title': 'Professional Fog Systems - Instant Anti-Theft Protection | FB Total Security Milan',
        'nebbiogeni-page-description': 'Discover UR Fog systems: advanced fog technology that reduces visibility to zero in 10 seconds. Certified protection for shops, offices and homes in Milan. Free consultation.',
        'og-title': 'Security and Alarm Systems | FB Total Security Milan',
        'og-description': 'FB Total Security offers advanced security systems: alarms, video surveillance, fog systems and armored fixtures. Complete protection for home and business in Milan.',
        'nebbiogeni-og-title': 'UR Fog Systems - Advanced Anti-Theft Protection',
        'nebbiogeni-og-description': 'Fog technology that reduces visibility to zero in 10 seconds. Certified protection for your business.',
        'btn-discover': 'Discover More',
        'btn-quote': 'Request Quote',
        'security-title': 'Next Generation Active Security',
        'technology-title': 'Advanced Fog System Technology',
        'security-description': 'Our fog systems represent the most advanced frontier in anti-theft protection. In case of intrusion, the system instantly releases a dense fog that reduces visibility to zero, forcing criminals to immediately abandon the premises.',
        'feature-activation': 'Instant activation in 10 seconds',
        'feature-fog': 'Dense and persistent fog for 45 minutes',
        'feature-safe': 'Completely safe for people and objects',
        'feature-integration': 'Integration with existing alarm systems',
        'feature-remote': 'Remote control via smartphone',
        'feature-maintenance': 'Scheduled maintenance included',
        'feature-certifications': 'CE certifications and regulatory compliance',
        'feature-warranty': 'Extended warranty up to 2 years',
        'btn-advantages': 'Advantages',
        'btn-free-quote': 'Free Quote',
        'partner-urfog-title': 'URfog',
        'partner-urfog-description': 'First Italian and worldwide company to certify fog systems according to <strong>EN 50131-8:2019</strong>. Patented technologies: FOG STORM, "LAYER" boiler, patented double cylinder, battery system with 2 international patents, Compact exchanger, adjustable anti-tampering nozzle. "White Out" Food Grade formula certified for food sector with <strong>zero residues</strong> and total safety (EUROFINS certification).',
        'tag-patented': 'Patented Technology',
        'tag-ultrafast': 'Up to 200 m³ in 15 sec',
        'tag-foodgrade': 'Food Grade',
        'tag-ecofriendly': 'Zero Residues',
        'tag-en50131': 'EN 50131-8:2019',
        'tag-warranty': '2-year warranty + Lifetime support',
        'certifications-title': 'Certifications and Warranties',
        'cert-en-title': 'EN 50131-8:2019',
        'cert-en-desc': 'First worldwide certification',
        'cert-emc-title': 'EMC, FCC, CE',
        'cert-emc-desc': 'International Compliance',
        'cert-food-title': 'Food Grade',
        'cert-food-desc': 'Food sector certified',
        'cert-eurofins-title': 'EUROFINS',
        'cert-eurofins-desc': 'Non-toxic for people and animals',
        'cert-warranty-title': '2-year warranty',
        'cert-warranty-desc': 'Lifetime phone support',
        'cert-iso16000-title': 'EN ISO 16000-1',
        'cert-iso16000-desc': 'Certified fluid tests',
        'cert-eco-desc': 'Environmental Respect',
        'advantage-instant-title': 'Instant Activation',
        'advantage-instant-desc': 'The system activates in seconds creating an impenetrable fog barrier',
        'advantage-protection-title': 'Total Protection',
        'advantage-protection-desc': 'Reduces visibility to zero making it impossible for thieves to complete the theft',
        'advantage-safe-title': 'Completely Safe',
        'advantage-safe-desc': 'The fog is non-toxic, does not damage people, animals or objects',
        'advantage-remote-title': 'Remote Control',
        'advantage-remote-desc': 'Manage the system remotely via dedicated app with real-time notifications',
        'advantage-maintenance-title': 'Maintenance Included',
        'advantage-maintenance-desc': 'Scheduled maintenance service and 24/7 technical assistance',
        'advantage-savings-title': 'Insurance Savings',
        'advantage-savings-desc': 'Many insurance companies recognize significant discounts',
        'slide1-title': 'Instant Protection',
        'slide1-desc': 'The system activates in seconds creating an impenetrable barrier',
        'slide2-title': 'Advanced Technology',
        'slide2-desc': 'State-of-the-art systems for maximum protection',
        'btn-prev': 'Previous',
        'btn-next': 'Next',

        'applications-title': 'Ideal Applications',
        'applications-desc': 'Fog systems are perfect for a wide range of environments',
        'app-shops': 'Shops and shopping centers',
        'app-jewelry': 'Jewelry stores and goldsmiths',
        'app-banks': 'Banks and credit institutions',
        'app-pharmacies': 'Pharmacies and drugstores',
        'app-offices': 'Offices and professional studios',
        'app-warehouses': 'Warehouses and storage facilities',
        'app-homes': 'Luxury residences',
        'app-museums': 'Museums and art galleries',
        'btn-consultation': 'Request Consultation',
        'btn-other-services': 'Other Services',
        'partner-urfog-main-title': 'Our Partner: UR Fog',
        'partner-general-info-title': 'General Information',
        'partner-general-info-desc': 'UR Fog is a world-leading company in the fog security systems market. Their systems stop thieves in seconds, protecting against theft in shops, businesses, homes and banks.',
        'partner-services-title': 'Services and Innovation',
        'partner-feature-1': 'Certified patented technology',
        'partner-feature-2': 'Ultra-fast activation in 10 seconds',
        'partner-feature-3': 'Dense and persistent fog for 45 minutes',
        'partner-feature-4': 'Completely safe for people and objects',
        'partner-feature-5': 'Integration with existing alarm systems',
        'partner-feature-6': 'Remote control via smartphone',
        'partner-feature-7': 'Scheduled maintenance included',
        'partner-feature-8': 'CE certifications and regulatory compliance',
        'partner-feature-9': 'Extended warranty up to 2 years',
        'partner-feature-10': 'Specialized 24/7 technical support',
        'contact-info-title': 'Contact Information',
        'contact-info-desc': 'Contact us for personalized consultation on our security systems',
        'index-meta-title': 'FB Total Security - Security Systems | Milan',
        'index-meta-description': 'Professional security systems: fog systems, armored doors, surveillance and alarms. Complete protection for home and business in Rome.',
        'index-og-title': 'FB Total Security - Security Systems',
        'index-og-description': 'Advanced security solutions for home and business protection',
        'index-twitter-title': 'FB Total Security - Security Systems',
        'index-twitter-description': 'Professional security systems in Rome',
        'nebbiogeni-section-title': 'Fog Systems',
        'nebbiogeni-section-desc': 'Instant protection with advanced fog technology',
        'serramenti-section-title': 'Armored Doors',
        'serramenti-section-desc': 'Armored doors and windows for maximum security',
        'svg-serramenti-text': 'Doors',
        'sorveglianza-section-title': 'Video Surveillance',
        'sorveglianza-section-desc': 'Advanced monitoring systems with AI',
        'sorveglianza-feature-5': 'Intelligent behavioral analysis',
        'svg-sorveglianza-text': 'Surveillance',
        'allarmi-section-title': 'Alarm Systems',
        'allarmi-section-desc': 'Smart connected alarms 24/7',
        'allarmi-feature-5': 'Complete home automation integration',
        'svg-allarmi-text': 'Alarms',
        'why-choose-feature-1-title': 'Proven Experience',
        'why-choose-feature-1-desc': 'Over 20 years of experience in the security sector',
        'why-choose-feature-2-title': 'Advanced Technologies',
        'why-choose-feature-2-desc': 'We use only the most innovative and certified technologies',
        'why-choose-feature-3-title': '24/7 Support',
        'why-choose-feature-3-desc': 'Technical support always available for every need',
        'clients-title': 'Our Clients',
        'clients-subtitle': 'Companies and individuals who trust our experience',
        'clients-business-title': 'Business Sector',
        'clients-business-desc': 'We protect shops, offices, banks and commercial structures',
        'clients-business-feature-1': 'Fog systems for shops and shopping centers',
        'clients-business-feature-2': 'Advanced video surveillance for offices and companies',
        'clients-business-feature-3': 'Armored fixtures for banks and credit institutions',
        'clients-business-feature-4': 'Smart alarms for pharmacies and parapharmacies',
        'clients-business-feature-5': 'Integrated solutions for warehouses and storage facilities',
        'clients-residential-title': 'Residential Sector',
        'clients-residential-desc': 'Complete protection for private homes and luxury villas',
        'clients-residential-feature-1': 'Advanced perimeter alarm systems',
        'clients-residential-feature-2': 'Discreet and intelligent video surveillance',
        'clients-residential-feature-3': 'Custom armored fixtures for homes',
        'clients-residential-feature-4': 'Fog systems for villas and luxury homes',
        'clients-residential-feature-5': 'Smart access control for residences',
        'clients-residential-feature-6': '24/7 monitoring with operations center',
        'clients-cta-text': 'Request a free quote for your security',
        'clients-cta-btn': 'Contact Us Now',
        'terms-title': 'Terms and Conditions',
        'terms-subtitle': 'Terms of use for FB Total Security website',
        'terms-section-1-title': '1. General Information',
        'terms-section-1-content': 'This website is owned by FB Total Security, with registered office in Milan. The use of the site is subject to the following terms and conditions.',
        'terms-section-2-title': '2. Website Usage',
        'terms-section-2-content': 'Access and use of this website are permitted exclusively for lawful purposes. It is prohibited to use the site for:',
        'terms-section-2-item-1': 'Illegal or unauthorized activities',
        'terms-section-2-item-2': 'Transmission of harmful content or viruses',
        'terms-section-2-item-3': 'Violation of intellectual property rights',
        'terms-section-2-item-4': 'Interference with normal site operation',
        'terms-section-3-title': '3. Intellectual Property',
        'terms-section-3-content': 'All content on the site, including texts, images, logos, graphics and software, are owned by FB Total Security or their respective owners and are protected by copyright laws.',
        'terms-section-4-title': '4. Privacy and Data Processing',
        'terms-section-4-content': 'Personal data processing is carried out in compliance with EU Regulation 2016/679 (GDPR). Data collected through contact forms is used exclusively for:',
        'terms-section-4-item-1': 'Responding to information requests',
        'terms-section-4-item-2': 'Providing personalized quotes',
        'terms-section-4-item-3': 'Commercial communications (only with explicit consent)',
        'terms-section-5-title': '5. Limitation of Liability',
        'terms-section-5-content': 'FB Total Security cannot be held responsible for:',
        'terms-section-5-item-1': 'Temporary service interruptions',
        'terms-section-5-item-2': 'Errors or omissions in content',
        'terms-section-5-item-3': 'Damages arising from site usage',
        'terms-section-5-item-4': 'Links to third-party websites',
        'terms-section-6-title': '6. Terms Modifications',
        'terms-section-6-content': 'FB Total Security reserves the right to modify these terms and conditions at any time. Changes will take effect from the date of publication on the site.',
        'terms-section-7-title': '7. Applicable Law',
        'terms-section-7-content': 'These terms and conditions are governed by Italian law. For any dispute, the Court of Milan shall have jurisdiction.',
        'terms-section-8-title': '8. Contacts',
        'terms-section-8-content': 'For any questions regarding these terms and conditions, you can contact FB Total Security through the channels indicated in the contacts section of the site.',
        'terms-last-update': 'Last update:',
        'terms-update-date': 'September 2025',
        'footer-description': 'Security creators specialized in advanced protection systems. Your security is our priority.',
        'footer-services-title': 'Services',
        'footer-service-1': 'Fog Systems',
        'footer-service-2': 'Security Fixtures',
        'footer-service-3': 'Video Surveillance',
        'footer-service-4': 'Alarm Systems',
        'footer-company-title': 'Company',
        'footer-company-1': 'About Us',
        'footer-company-2': 'Contacts',
        'footer-company-3': 'Terms and Conditions',
        'footer-contacts-title': 'Contacts',
        'footer-location': '📍 Milan and Province',

        'footer-email': '✉️ postmaster@fbtotalsecurity.com',
        'footer-copyright': '© 2024 FB Total Security. All rights reserved.',
        'form-contact-description': 'Fill out the form below to request a free quote or get more information about our security systems. Our team will contact you within 24 hours.'
    }
};

// Language Management Functions
function initLanguageSelector() {
    console.log('🌐 Initializing language selector...');
    const langButtons = document.querySelectorAll('.lang-btn');
    console.log('🔍 Found language buttons:', langButtons.length);
    const currentLang = localStorage.getItem('selectedLanguage') || 'it';
    console.log('🏁 Current language:', currentLang);
    
    // Check if we're on homepage to determine initialization behavior
    const currentPath = window.location.pathname;
    const isHomepage = currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('index.html');
    
    if (isHomepage) {
        // Set initial language for homepage (full translation)
        setLanguage(currentLang);
    } else {
        // For non-homepage pages, only update language attributes without translating content
        updatePageLanguageAttributes(currentLang);
    }
    updateActiveLanguageButton(currentLang);
    
    // Add event listeners to language buttons
    langButtons.forEach((button, index) => {
        console.log(`🔘 Adding listener to button ${index + 1}:`, button.getAttribute('data-lang'));
        button.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            console.log('🖱️ Language button clicked:', selectedLang);
            setLanguage(selectedLang);
            updateActiveLanguageButton(selectedLang);
            localStorage.setItem('selectedLanguage', selectedLang);
        });
    });
}

function setLanguage(lang) {
    console.log('🔄 Setting language to:', lang);
    const elements = document.querySelectorAll('[data-translate]');
    console.log('📝 Found elements with data-translate:', elements.length);
    
    let translatedCount = 0;
    let missingTranslations = [];
    
    // Check if we're on homepage to determine if meta tags should be translated
    const currentPath = window.location.pathname;
    const isHomepage = currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('index.html');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        
        // Skip meta tags translation if not on homepage
        if (!isHomepage && element.tagName === 'META' && element.hasAttribute('data-translate')) {
            return;
        }
        
        // Skip title translation if not on homepage
        if (!isHomepage && element.tagName === 'TITLE') {
            return;
        }
        
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[lang][key];
            } else if (element.tagName === 'OPTION') {
                element.textContent = translations[lang][key];
            } else {
                element.innerHTML = translations[lang][key];
            }
            translatedCount++;
        } else {
            missingTranslations.push(key);
        }
    });
    
    console.log(`✅ Translated ${translatedCount} elements`);
    if (missingTranslations.length > 0) {
        console.warn('⚠️ Missing translations for keys:', missingTranslations.slice(0, 10));
    }
    
    // Update placeholders with specific data attribute
    const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Save language preference
    localStorage.setItem('selectedLanguage', lang);
    
    // Update meta tags for SEO (only for homepage)
    if (isHomepage) {
        updateMetaTags(lang);
    } else {
        // For non-homepage pages, only update HTML lang attribute and hreflang tags
        updatePageLanguageAttributes(lang);
    }
}

function updateActiveLanguageButton(lang) {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-lang') === lang) {
            button.classList.add('active');
        }
    });
}

function updatePageLanguageAttributes(lang) {
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update or create hreflang tags
    const existingHreflang = document.querySelectorAll('link[hreflang]');
    existingHreflang.forEach(link => link.remove());
    
    // Get current page without query parameters
    const currentPath = window.location.pathname;
    const baseUrl = window.location.origin;
    
    // Add hreflang for both languages
    const languages = ['it', 'en'];
    languages.forEach(language => {
        const link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = language;
        link.href = `${baseUrl}${currentPath}`;
        document.head.appendChild(link);
    });
    
    // Add x-default hreflang (defaults to Italian)
    const defaultLink = document.createElement('link');
    defaultLink.rel = 'alternate';
    defaultLink.hreflang = 'x-default';
    defaultLink.href = `${baseUrl}${currentPath}`;
    document.head.appendChild(defaultLink);
    
    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
    }
    canonical.href = `${baseUrl}${currentPath}`;
    
    // Update og:locale
    let ogLocale = document.querySelector('meta[property="og:locale"]');
    if (!ogLocale) {
        ogLocale = document.createElement('meta');
        ogLocale.setAttribute('property', 'og:locale');
        document.head.appendChild(ogLocale);
    }
    ogLocale.content = lang === 'en' ? 'en_US' : 'it_IT';
    
    // Add alternate locales
    const existingAlternates = document.querySelectorAll('meta[property="og:locale:alternate"]');
    existingAlternates.forEach(meta => meta.remove());
    
    const alternateLocale = lang === 'en' ? 'it_IT' : 'en_US';
    const ogAlternate = document.createElement('meta');
    ogAlternate.setAttribute('property', 'og:locale:alternate');
    ogAlternate.content = alternateLocale;
    document.head.appendChild(ogAlternate);
    
    // Update og:url
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
        ogUrl = document.createElement('meta');
        ogUrl.setAttribute('property', 'og:url');
        document.head.appendChild(ogUrl);
    }
    ogUrl.content = `${baseUrl}${currentPath}`;
}

function updateMetaTags(lang) {
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update or create hreflang tags
    const existingHreflang = document.querySelectorAll('link[hreflang]');
    existingHreflang.forEach(link => link.remove());
    
    // Get current page without query parameters
    const currentPath = window.location.pathname;
    const baseUrl = window.location.origin;
    
    // Add hreflang for both languages
    const languages = ['it', 'en'];
    languages.forEach(language => {
        const link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = language;
        // Use clean URLs without query parameters
        link.href = `${baseUrl}${currentPath}`;
        document.head.appendChild(link);
    });
    
    // Add x-default hreflang (defaults to Italian)
    const defaultLink = document.createElement('link');
    defaultLink.rel = 'alternate';
    defaultLink.hreflang = 'x-default';
    defaultLink.href = `${baseUrl}${currentPath}`;
    document.head.appendChild(defaultLink);
    
    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
    }
    canonical.href = `${baseUrl}${currentPath}`;
    
    // Update page title based on language (only for homepage)
    const isHomepage = currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('index.html');
    
    // Title is now managed directly in HTML without JavaScript override
    
    // Update meta description (only for homepage)
    if (isHomepage) {
        const metaDescriptions = {
            it: 'Specialisti in sistemi di sicurezza avanzati: nebbiogeni, serramenti blindati, videosorveglianza e allarmi. Oltre 20 anni di esperienza. Servizi in tutta Italia.',
            en: 'Specialists in advanced security systems: fog systems, armored doors, video surveillance and alarms. Over 20 years of experience. Services in Milan and province.'
        };
        
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = metaDescriptions[lang] || metaDescriptions['it'];
    }
    
    // Update meta keywords (only for homepage)
    if (isHomepage) {
        const metaKeywords = {
            it: 'sistemi sicurezza, nebbiogeni, serramenti blindati, videosorveglianza, allarmi, Milano, sicurezza casa, antifurto',
            en: 'security systems, fog systems, armored doors, video surveillance, alarms, Milan, home security, anti-theft'
        };
        
        let metaKeys = document.querySelector('meta[name="keywords"]');
        if (!metaKeys) {
            metaKeys = document.createElement('meta');
            metaKeys.name = 'keywords';
            document.head.appendChild(metaKeys);
        }
        metaKeys.content = metaKeywords[lang] || metaKeywords['it'];
    }
    
    // Update Open Graph tags (only for homepage)
    if (isHomepage) {
        const ogTitles = {
            it: 'FB Total Security - Sistemi di Sicurezza Avanzati',
            en: 'FB Total Security - Advanced Security Systems'
        };
        
        const metaDescriptions = {
            it: 'Specialisti in sistemi di sicurezza avanzati: nebbiogeni, serramenti blindati, videosorveglianza e allarmi. Oltre 20 anni di esperienza. Servizi in tutta Italia.',
            en: 'Specialists in advanced security systems: fog systems, armored doors, video surveillance and alarms. Over 20 years of experience. Services in Milan and province.'
        };
        
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (!ogTitle) {
            ogTitle = document.createElement('meta');
            ogTitle.setAttribute('property', 'og:title');
            document.head.appendChild(ogTitle);
        }
        ogTitle.content = ogTitles[lang] || ogTitles['it'];
        
        let ogDesc = document.querySelector('meta[property="og:description"]');
        if (!ogDesc) {
            ogDesc = document.createElement('meta');
            ogDesc.setAttribute('property', 'og:description');
            document.head.appendChild(ogDesc);
        }
        ogDesc.content = metaDescriptions[lang] || metaDescriptions['it'];
    }
    
    // Update og:locale
    let ogLocale = document.querySelector('meta[property="og:locale"]');
    if (!ogLocale) {
        ogLocale = document.createElement('meta');
        ogLocale.setAttribute('property', 'og:locale');
        document.head.appendChild(ogLocale);
    }
    ogLocale.content = lang === 'en' ? 'en_US' : 'it_IT';
    
    // Add alternate locales
    const existingAlternates = document.querySelectorAll('meta[property="og:locale:alternate"]');
    existingAlternates.forEach(meta => meta.remove());
    
    const alternateLocale = lang === 'en' ? 'it_IT' : 'en_US';
    const ogAlternate = document.createElement('meta');
    ogAlternate.setAttribute('property', 'og:locale:alternate');
    ogAlternate.content = alternateLocale;
    document.head.appendChild(ogAlternate);
    
    // Update og:url
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
        ogUrl = document.createElement('meta');
        ogUrl.setAttribute('property', 'og:url');
        document.head.appendChild(ogUrl);
    }
    ogUrl.content = `${baseUrl}${currentPath}`;
    
    // Add Twitter Card meta tags (only for homepage)
    if (isHomepage) {
        const ogTitles = {
            it: 'FB Total Security - Sistemi di Sicurezza Avanzati',
            en: 'FB Total Security - Advanced Security Systems'
        };
        
        const metaDescriptions = {
            it: 'Specialisti in sistemi di sicurezza avanzati: nebbiogeni, serramenti blindati, videosorveglianza e allarmi. Oltre 20 anni di esperienza. Servizi in tutta Italia.',
            en: 'Specialists in advanced security systems: fog systems, armored doors, video surveillance and alarms. Over 20 years of experience. Services in Milan and province.'
        };
        
        let twitterCard = document.querySelector('meta[name="twitter:card"]');
        if (!twitterCard) {
            twitterCard = document.createElement('meta');
            twitterCard.name = 'twitter:card';
            twitterCard.content = 'summary_large_image';
            document.head.appendChild(twitterCard);
        }
        
        let twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (!twitterTitle) {
            twitterTitle = document.createElement('meta');
            twitterTitle.name = 'twitter:title';
            document.head.appendChild(twitterTitle);
        }
        twitterTitle.content = ogTitles[lang] || ogTitles['it'];
        
        let twitterDesc = document.querySelector('meta[name="twitter:description"]');
        if (!twitterDesc) {
            twitterDesc = document.createElement('meta');
            twitterDesc.name = 'twitter:description';
            document.head.appendChild(twitterDesc);
        }
        twitterDesc.content = metaDescriptions[lang] || metaDescriptions['it'];
    }
}

// Add CSS for mobile menu and animations
const additionalStyles = `
<style>
/* Mobile Menu Styles */
@media (max-width: 768px) {
    .hamburger {
        z-index: 1002 !important;
    }
    
    .hamburger span {
        background: #ffffff !important;
    }
    
    .nav-menu {
        position: fixed;
        top: 80px;
        left: 0;
        right: 0;
        background: rgba(30, 30, 30, 0.98);
        backdrop-filter: blur(10px);
        flex-direction: column;
        padding: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        transform: translateY(-100%);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 999;
    }
    
    .nav-menu.active {
        display: flex;
        transform: translateY(0);
        opacity: 1;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    body.menu-open {
        overflow: hidden;
    }
}

/* Animation Classes */
.animate-in {
    animation: fadeInUp 0.6s ease-out forwards;
}

.service-text,
.service-image {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease-out;
}

.service-text.animate-in,
.service-image.animate-in {
    opacity: 1;
    transform: translateY(0);
}

/* Header Scroll Effect */
.header {
    transition: transform 0.3s ease, background-color 0.3s ease;
}

.header.scrolled {
    background: rgba(30, 30, 30, 0.98);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

/* Form Error States */
.form-group input.error,
.form-group select.error,
.form-group textarea.error {
    border-color: #ff6b6b;
    background: rgba(255, 107, 107, 0.1);
}

/* Service Card Transitions */
.service-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Smooth Scrolling Fallback */
html {
    scroll-behavior: smooth;
}

/* Focus Indicators */
.btn:focus-visible,
.nav-link:focus-visible {
    outline: 2px solid #667eea;
    outline-offset: 2px;
    border-radius: 4px;
}
</style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Email obfuscation function
function initEmailObfuscation() {
    // Find all email elements that need obfuscation
    const emailElements = document.querySelectorAll('[data-email]');
    
    emailElements.forEach(element => {
        const obfuscatedEmail = element.getAttribute('data-email');
        if (obfuscatedEmail) {
            // Convert [at] and [dot] back to @ and .
            const realEmail = obfuscatedEmail
                .replace(/\[at\]/g, '@')
                .replace(/\[dot\]/g, '.');
            
            // Update the element content
            if (element.tagName.toLowerCase() === 'a') {
                element.href = `mailto:${realEmail}`;
                element.textContent = realEmail;
            } else {
                element.textContent = realEmail;
            }
        }
    });
    
    // Also handle any email spans with obfuscated format
    const emailSpans = document.querySelectorAll('.email-obfuscated');
    emailSpans.forEach(span => {
        const text = span.textContent;
        if (text.includes('[at]') || text.includes('[dot]')) {
            const realEmail = text
                .replace(/\[at\]/g, '@')
                .replace(/\[dot\]/g, '.');
            span.textContent = realEmail;
        }
    });
}

// Export functions for potential external use
window.FrancoSite = {
    showNotification,
    updateActiveNavLink,
    validateForm,
    debounce,
    throttle,
    initEmailObfuscation
};

// Console welcome message
console.log('%c🔒 FB Total Security - Sistemi di Sicurezza', 'color: #667eea; font-size: 16px; font-weight: bold;');
console.log('%cSito web ottimizzato per performance e SEO', 'color: #666; font-size: 12px;');