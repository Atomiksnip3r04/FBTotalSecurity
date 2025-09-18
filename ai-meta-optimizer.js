/**
 * AI Meta Optimizer
 * Dynamically optimizes meta descriptions and tags for better AI search engine visibility
 */

class AIMetaOptimizer {
    constructor() {
        this.aiKeywords = {
            'nebbiogeni': [
                'sistema nebbiogeno antifurto',
                'nebbia densa protezione',
                'deterrente visivo immediato',
                'sicurezza innovativa casa',
                'protezione istantanea ladri'
            ],
            'serramenti': [
                'grate e inferriate blindate certificate',
                'grate e inferriate sicurezza RC',
                'protezione antieffrazione',
                'sicurezza perimetrale casa'
            ],
            'videosorveglianza': [
                'telecamere intelligenza artificiale',
                'videosorveglianza AI smart',
                'riconoscimento facciale sicurezza',
                'monitoraggio remoto avanzato',
                'analisi comportamentale video'
            ],
            'allarmi': [
                'sistemi allarme wireless',
                'allarme casa senza fili',
                'protezione antifurto moderna',
                'sensori movimento avanzati',
                'centrale allarme smart'
            ]
        };
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.optimize());
        } else {
            this.optimize();
        }
    }

    optimize() {
        this.optimizeMetaDescriptions();
        this.addAISpecificMetas();
        this.enhanceOpenGraphTags();
        this.addTwitterCardOptimizations();
        this.createDynamicKeywords();
    }

    optimizeMetaDescriptions() {
        const currentPage = this.detectCurrentPage();
        const optimizedDescriptions = this.getOptimizedDescriptions();
        
        if (optimizedDescriptions[currentPage]) {
            this.updateMetaDescription(optimizedDescriptions[currentPage]);
        }
    }

    detectCurrentPage() {
        const path = window.location.pathname;
        const title = document.title.toLowerCase();
        
        if (path.includes('nebbiogen') || title.includes('nebbiogen')) return 'nebbiogeni';
        if (path.includes('serramento') || title.includes('serramento') || title.includes('blindat')) return 'serramenti';
        if (path.includes('sorveglianza') || title.includes('videosorveglianza') || title.includes('telecamer')) return 'videosorveglianza';
        if (path.includes('allarmi') || title.includes('allarme')) return 'allarmi';
        
        return 'home';
    }

    getOptimizedDescriptions() {
        return {
            'home': 'FB Total Security: leader sistemi sicurezza avanzati con AI. Nebbiogeni antifurto, Grate e Inferriate blindate certificate, videosorveglianza intelligente e allarmi wireless. Consulenza gratuita in tutta Italia. Tecnologie innovative per protezione casa e azienda.',
            'nebbiogeni': 'Sistemi nebbiogeni antifurto FB Total Security: protezione istantanea con nebbia densa atossica. Deterrente visivo immediato contro ladri. Installazione professionale, attivazione in 10 secondi. Consulenza gratuita per casa e azienda.',
            'Grate e Inferriate': 'Grate e inferriate blindate di sicurezza FB Total Security: certificazioni RC2-RC6, protezione antieffrazione garantita. Grate e inferriate blindate su misura con tecnologie avanzate. Installazione professionale in tutta Italia.',
            'videosorveglianza': 'Videosorveglianza intelligente con AI FB Total Security: telecamere 4K, riconoscimento facciale, analisi comportamentale. Monitoraggio remoto h24, notifiche smart. Sistemi avanzati per casa e azienda.',
            'allarmi': 'Sistemi allarme wireless FB Total Security: sensori movimento avanzati, centrale smart, app mobile. Protezione antifurto senza fili con tecnologie innovative. Installazione rapida, monitoraggio professionale.'
        };
    }

    updateMetaDescription(newDescription) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', newDescription);
    }

    addAISpecificMetas() {
        const aiMetas = [
            {
                name: 'ai-content-type',
                content: 'security-systems-guide'
            },
            {
                name: 'ai-expertise-level',
                content: 'professional-expert'
            },
            {
                name: 'ai-content-freshness',
                content: new Date().toISOString().split('T')[0]
            },
            {
                name: 'ai-geographic-focus',
                content: 'Italia, Milano, Lombardia'
            },
            {
                name: 'ai-industry-vertical',
                content: 'security-technology-home-business'
            },
            {
                name: 'ai-content-intent',
                content: 'informational-commercial-transactional'
            },
            {
                name: 'ai-user-journey-stage',
                content: 'awareness-consideration-decision'
            }
        ];

        aiMetas.forEach(meta => {
            if (!document.querySelector(`meta[name="${meta.name}"]`)) {
                const metaTag = document.createElement('meta');
                metaTag.setAttribute('name', meta.name);
                metaTag.setAttribute('content', meta.content);
                document.head.appendChild(metaTag);
            }
        });
    }

    enhanceOpenGraphTags() {
        const currentPage = this.detectCurrentPage();
        const ogEnhancements = {
            'home': {
                title: 'FB Total Security - Sistemi Sicurezza Avanzati con AI | Nebbiogeni, Videosorveglianza, Allarmi',
                description: 'Leader in sistemi sicurezza innovativi: nebbiogeni antifurto, videosorveglianza AI, grade e inferriate blindate certificate. Tecnologie avanzate per protezione casa e azienda in tutta Italia.'
            },
            'nebbiogeni': {
                title: 'Sistemi Nebbiogeni Antifurto | Protezione Istantanea FB Total Security',
                description: 'Nebbiogeni antifurto: nebbia densa in 10 secondi, deterrente visivo immediato. Sistema atossico per casa e azienda. Consulenza gratuita e installazione professionale.'
            },
            'videosorveglianza': {
                title: 'Videosorveglianza Intelligente AI | Telecamere Smart FB Total Security',
                description: 'Videosorveglianza con intelligenza artificiale: riconoscimento facciale, analisi comportamentale, monitoraggio remoto 24/7. Tecnologie avanzate per sicurezza totale.'
            }
        };

        if (ogEnhancements[currentPage]) {
            this.updateOpenGraphTag('og:title', ogEnhancements[currentPage].title);
            this.updateOpenGraphTag('og:description', ogEnhancements[currentPage].description);
        }

        // Add AI-specific OG tags
        this.updateOpenGraphTag('og:type', 'website');
        this.updateOpenGraphTag('og:locale', 'it_IT');
        this.updateOpenGraphTag('article:section', 'Security Technology');
        this.updateOpenGraphTag('article:tag', this.aiKeywords[currentPage]?.join(', ') || 'sistemi sicurezza');
    }

    updateOpenGraphTag(property, content) {
        let ogTag = document.querySelector(`meta[property="${property}"]`);
        if (!ogTag) {
            ogTag = document.createElement('meta');
            ogTag.setAttribute('property', property);
            document.head.appendChild(ogTag);
        }
        ogTag.setAttribute('content', content);
    }

    addTwitterCardOptimizations() {
        const twitterMetas = [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@FBTotalSecurity' },
            { name: 'twitter:creator', content: '@FBTotalSecurity' },
            { name: 'twitter:domain', content: 'fbtotalsecurity.com' }
        ];

        twitterMetas.forEach(meta => {
            let twitterTag = document.querySelector(`meta[name="${meta.name}"]`);
            if (!twitterTag) {
                twitterTag = document.createElement('meta');
                twitterTag.setAttribute('name', meta.name);
                document.head.appendChild(twitterTag);
            }
            twitterTag.setAttribute('content', meta.content);
        });
    }

    createDynamicKeywords() {
        const currentPage = this.detectCurrentPage();
        const baseKeywords = [
            'sistemi sicurezza',
            'protezione casa',
            'sicurezza aziendale',
            'antifurto professionale',
            'tecnologie innovative',
            'consulenza gratuita',
            'installazione professionale',
            'Italia',
            'Milano',
            'Lombardia'
        ];

        const pageSpecificKeywords = this.aiKeywords[currentPage] || [];
        const allKeywords = [...baseKeywords, ...pageSpecificKeywords];

        // Update keywords meta tag
        let keywordsMeta = document.querySelector('meta[name="keywords"]');
        if (!keywordsMeta) {
            keywordsMeta = document.createElement('meta');
            keywordsMeta.setAttribute('name', 'keywords');
            document.head.appendChild(keywordsMeta);
        }
        keywordsMeta.setAttribute('content', allKeywords.join(', '));

        // Keywords are now handled through structured data instead of custom meta tags
        console.log('🎯 Keywords integrated into unified structured data');
    }

    generateAIKeywordVariations(keywords) {
        const variations = [];
        const modifiers = [
            'come funziona',
            'migliore',
            'professionale',
            'innovativo',
            'avanzato',
            'smart',
            'intelligente',
            'efficace',
            'affidabile',
            'certificato'
        ];

        keywords.forEach(keyword => {
            modifiers.forEach(modifier => {
                variations.push(`${modifier} ${keyword}`);
                variations.push(`${keyword} ${modifier}`);
            });
        });

        return variations.slice(0, 50); // Limit to 50 variations
    }
}

// Initialize AI Meta Optimizer
new AIMetaOptimizer();

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIMetaOptimizer;
}