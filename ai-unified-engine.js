/**
 * AI Unified SEO Engine
 * Consolidated engine for meta optimization, semantic enhancement, and cross-linking
 * Combines functionality from ai-meta-optimizer.js, ai-semantic-enhancement.js, and ai-semantic-crosslinks.js
 */

class AIUnifiedEngine {
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
                'porte blindate certificate',
                'serramenti sicurezza RC',
                'protezione antieffrazione',
                'sicurezza perimetrale casa',
                'porte resistenti scasso'
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

        this.semanticMap = new Map();
        this.crossLinkPatterns = {
            'nebbiogeno': ['nebbia', 'deterrente', 'protezione istantanea', 'antifurto innovativo'],
            'serramenti': ['porte blindate', 'RC2', 'RC3', 'antieffrazione', 'sicurezza perimetrale'],
            'videosorveglianza': ['telecamere', 'AI', 'riconoscimento', 'monitoraggio', 'analisi comportamentale'],
            'allarmi': ['wireless', 'sensori', 'centrale', 'antifurto', 'protezione casa']
        };

        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.runFullOptimization());
        } else {
            this.runFullOptimization();
        }
    }

    runFullOptimization() {
        console.log('🚀 AI Unified Engine: Starting comprehensive optimization...');
        
        // Phase 1: Meta Optimization
        this.optimizeMeta();
        
        // Phase 2: Semantic Enhancement
        this.enhanceSemantics();
        
        // Phase 3: Cross-Linking
        this.implementCrossLinking();
        
        // Phase 4: Schema.org Integration
        this.integrateStructuredData();
        
        console.log('✅ AI Unified Engine: Optimization complete');
    }

    // META OPTIMIZATION MODULE
    optimizeMeta() {
        console.log('🔧 Optimizing meta tags...');
        
        this.optimizeMetaDescription();
        this.addAISpecificTags();
        this.enhanceOpenGraph();
        this.addTwitterCards();
    }

    optimizeMetaDescription() {
        const currentSection = this.detectCurrentSection();
        const metaDesc = document.querySelector('meta[name="description"]');
        
        if (metaDesc && currentSection) {
            const keywords = this.aiKeywords[currentSection];
            if (keywords) {
                const optimizedDesc = this.generateAIOptimizedDescription(metaDesc.content, keywords);
                metaDesc.setAttribute('content', optimizedDesc);
            }
        }
    }

    generateAIOptimizedDescription(original, keywords) {
        const keywordPhrase = keywords[Math.floor(Math.random() * keywords.length)];
        return `${original} Specializzati in ${keywordPhrase} con tecnologie avanzate e certificazioni europee.`;
    }

    addAISpecificTags() {
        const aiTags = [
            { name: 'ai-content-type', content: 'security-services' },
            { name: 'ai-expertise-level', content: 'expert' },
            { name: 'ai-content-freshness', content: new Date().toISOString() },
            { name: 'ai-semantic-topics', content: Object.keys(this.aiKeywords).join(',') }
        ];

        aiTags.forEach(tag => {
            if (!document.querySelector(`meta[name="${tag.name}"]`)) {
                const meta = document.createElement('meta');
                meta.name = tag.name;
                meta.content = tag.content;
                document.head.appendChild(meta);
            }
        });
    }

    // SEMANTIC ENHANCEMENT MODULE
    enhanceSemantics() {
        console.log('🧠 Enhancing semantic markup...');
        
        this.addSemanticMarkup();
        this.enhanceExistingContent();
        this.addContextualData();
    }

    addSemanticMarkup() {
        const sections = {
            'nebbiogeni': {
                itemscope: true,
                itemtype: 'https://schema.org/Service',
                'data-ai-topic': 'sistemi-nebbiogeni-antifurto',
                'data-ai-category': 'security-innovation'
            },
            'serramenti': {
                itemscope: true,
                itemtype: 'https://schema.org/Service',
                'data-ai-topic': 'serramenti-blindati-sicurezza',
                'data-ai-category': 'perimeter-security'
            },
            'sorveglianza': {
                itemscope: true,
                itemtype: 'https://schema.org/Service',
                'data-ai-topic': 'videosorveglianza-intelligente-ai',
                'data-ai-category': 'smart-surveillance'
            },
            'allarmi': {
                itemscope: true,
                itemtype: 'https://schema.org/Service',
                'data-ai-topic': 'sistemi-allarme-wireless',
                'data-ai-category': 'wireless-security'
            }
        };

        Object.keys(sections).forEach(sectionId => {
            const element = document.getElementById(sectionId);
            if (element) {
                Object.keys(sections[sectionId]).forEach(attr => {
                    element.setAttribute(attr, sections[sectionId][attr]);
                });
            }
        });
    }

    enhanceExistingContent() {
        // Add semantic meaning to key terms
        const keyTerms = {
            'RC2': { type: 'SecurityStandard', definition: 'Classe di resistenza antieffrazione secondo EN 1627' },
            'RC3': { type: 'SecurityStandard', definition: 'Classe di resistenza antieffrazione avanzata' },
            'AI': { type: 'Technology', definition: 'Intelligenza Artificiale per analisi comportamentale' },
            'wireless': { type: 'Technology', definition: 'Tecnologia senza fili per sistemi di sicurezza' }
        };

        Object.keys(keyTerms).forEach(term => {
            this.wrapTermsWithSemantics(term, keyTerms[term]);
        });
    }

    wrapTermsWithSemantics(term, metadata) {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.includes(term)) {
                textNodes.push(node);
            }
        }

        textNodes.forEach(textNode => {
            const parent = textNode.parentNode;
            if (parent.tagName !== 'SCRIPT' && parent.tagName !== 'STYLE') {
                const content = textNode.textContent;
                const regex = new RegExp(`\\b${term}\\b`, 'gi');
                if (regex.test(content)) {
                    const newContent = content.replace(regex, 
                        `<span itemscope itemtype="https://schema.org/${metadata.type}" title="${metadata.definition}">${term}</span>`
                    );
                    parent.innerHTML = parent.innerHTML.replace(content, newContent);
                }
            }
        });
    }

    // CROSS-LINKING MODULE
    implementCrossLinking() {
        console.log('🔗 Implementing semantic cross-linking...');
        
        this.buildSemanticMap();
        this.createContextualRelations();
        this.injectSmartLinks();
    }

    buildSemanticMap() {
        Object.keys(this.crossLinkPatterns).forEach(category => {
            this.crossLinkPatterns[category].forEach(term => {
                if (!this.semanticMap.has(term)) {
                    this.semanticMap.set(term, []);
                }
                this.semanticMap.get(term).push({
                    category,
                    anchor: `#${category}`,
                    context: this.getContextForTerm(term, category)
                });
            });
        });
    }

    getContextForTerm(term, category) {
        const contexts = {
            'nebbiogeno': 'Scopri i sistemi nebbiogeni più avanzati',
            'serramenti': 'Esplora le nostre porte blindate certificate',
            'videosorveglianza': 'Vedi le telecamere con intelligenza artificiale',
            'allarmi': 'Conosci i nostri sistemi di allarme wireless'
        };
        return contexts[category] || `Maggiori informazioni su ${term}`;
    }

    createContextualRelations() {
        const relations = {
            'nebbiogeno': ['videosorveglianza', 'allarmi'],
            'serramenti': ['allarmi', 'videosorveglianza'],
            'videosorveglianza': ['allarmi', 'nebbiogeno'],
            'allarmi': ['videosorveglianza', 'serramenti']
        };

        Object.keys(relations).forEach(primary => {
            const element = document.getElementById(primary);
            if (element) {
                const relatedServices = relations[primary];
                const relatedLinks = relatedServices.map(service => 
                    `<a href="#${service}" class="ai-semantic-link" data-relation="complementary">${this.getServiceDisplayName(service)}</a>`
                ).join(', ');
                
                const relatedSection = document.createElement('div');
                relatedSection.className = 'ai-related-services';
                relatedSection.innerHTML = `<p><strong>Servizi correlati:</strong> ${relatedLinks}</p>`;
                element.appendChild(relatedSection);
            }
        });
    }

    getServiceDisplayName(service) {
        const displayNames = {
            'nebbiogeno': 'Sistemi Nebbiogeni',
            'serramenti': 'Serramenti Blindati',
            'videosorveglianza': 'Videosorveglianza',
            'allarmi': 'Sistemi di Allarme'
        };
        return displayNames[service] || service;
    }

    injectSmartLinks() {
        this.semanticMap.forEach((links, term) => {
            const elements = document.querySelectorAll('p, li, div');
            elements.forEach(element => {
                if (element.textContent.includes(term) && !element.querySelector('a')) {
                    const regex = new RegExp(`\\b${term}\\b`, 'gi');
                    element.innerHTML = element.innerHTML.replace(regex, 
                        `<a href="${links[0].anchor}" class="ai-auto-link" title="${links[0].context}">${term}</a>`
                    );
                }
            });
        });
    }

    // STRUCTURED DATA INTEGRATION
    integrateStructuredData() {
        console.log('📊 Integrating structured data...');
        
        this.loadExternalSchemas();
    }

    async loadExternalSchemas() {
        const schemas = [
            './ai-seo-enhanced.json',
            './ai-knowledge-base.json',
            './ai-services-schema.json',
            './ai-person-eeat.json',
            './ai-authoritative-sources.json',
            './ai-context-sitemap.json'
        ];

        const unifiedGraph = [];

        for (const schema of schemas) {
            try {
                const response = await fetch(schema);
                if (response.ok) {
                    const data = await response.json();
                    console.log(`✅ Loaded schema: ${schema}`);
                    
                    // Extract entities from @graph or add the entire object
                    if (data['@graph']) {
                        unifiedGraph.push(...data['@graph']);
                    } else if (data['@type']) {
                        unifiedGraph.push(data);
                    }
                } else {
                    console.debug(`⚠️ Schema not available: ${schema} (${response.status})`);
                }
            } catch (error) {
                console.debug(`⚠️ Could not load schema ${schema}:`, error.message);
            }
        }

        // Add enhanced local business data
        unifiedGraph.push(this.getEnhancedLocalBusiness());
        
        // Add breadcrumb data
        unifiedGraph.push(this.getBreadcrumbData());

        // Create unified JSON-LD with single @graph
        const unifiedSchema = {
            "@context": "https://schema.org",
            "@graph": unifiedGraph
        };

        this.injectUnifiedStructuredData(unifiedSchema);
    }

    injectUnifiedStructuredData(data) {
        // Remove existing JSON-LD scripts
        const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
        existingScripts.forEach(script => script.remove());

        // Inject unified schema
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'ai-unified-structured-data';
        script.textContent = JSON.stringify(data, null, 2);
        document.head.appendChild(script);
        
        console.log('🎯 Unified JSON-LD @graph injected with', data['@graph'].length, 'entities');
    }

    getEnhancedLocalBusiness() {
        return {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": "https://www.fbtotalsecurity.com/#organization",
            "name": "Franco Benedetto - Sistemi di Sicurezza",
            "description": "Specialisti in sistemi di sicurezza avanzati: nebbiogeni, serramenti blindati, videosorveglianza AI e allarmi wireless",
            "url": window.location.origin,
            "telephone": "+393802647367",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Italia"
            },
            "openingHours": "Mo-Fr 09:00-18:00",
            "priceRange": "€€€",
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Servizi di Sicurezza",
                "itemListElement": Object.keys(this.aiKeywords).map(service => ({
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": this.getServiceDisplayName(service)
                    }
                }))
            }
        };
    }

    getBreadcrumbData() {
        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "@id": "https://www.fbtotalsecurity.com/#breadcrumb",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": window.location.origin
                },
                {
                    "@type": "ListItem", 
                    "position": 2,
                    "name": "Servizi di Sicurezza",
                    "item": `${window.location.origin}#servizi`
                }
            ]
        };
    }

    // UTILITY METHODS
    detectCurrentSection() {
        const sections = ['nebbiogeni', 'serramenti', 'videosorveglianza', 'allarmi'];
        const currentHash = window.location.hash.substring(1);
        return sections.find(section => currentHash.includes(section)) || sections[0];
    }

    enhanceOpenGraph() {
        const ogTags = [
            { property: 'og:type', content: 'website' },
            { property: 'og:site_name', content: 'Franco Benedetto - Sistemi di Sicurezza' },
            { property: 'og:locale', content: 'it_IT' }
        ];

        ogTags.forEach(tag => {
            if (!document.querySelector(`meta[property="${tag.property}"]`)) {
                const meta = document.createElement('meta');
                meta.setAttribute('property', tag.property);
                meta.content = tag.content;
                document.head.appendChild(meta);
            }
        });
    }

    addTwitterCards() {
        const twitterTags = [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@francosicurezza' }
        ];

        twitterTags.forEach(tag => {
            if (!document.querySelector(`meta[name="${tag.name}"]`)) {
                const meta = document.createElement('meta');
                meta.name = tag.name;
                meta.content = tag.content;
                document.head.appendChild(meta);
            }
        });
    }

    addContextualData() {
        // Add contextual AI data attributes
        const contextualElements = document.querySelectorAll('h1, h2, h3, section, article');
        contextualElements.forEach((element, index) => {
            element.setAttribute('data-ai-context-id', `ctx-${index}`);
            element.setAttribute('data-ai-semantic-weight', this.calculateSemanticWeight(element));
        });
    }

    calculateSemanticWeight(element) {
        const tagWeights = { 'H1': 10, 'H2': 8, 'H3': 6, 'SECTION': 7, 'ARTICLE': 9 };
        const baseWeight = tagWeights[element.tagName] || 5;
        const keywordBonus = Object.keys(this.aiKeywords).some(keyword => 
            element.textContent.toLowerCase().includes(keyword)
        ) ? 3 : 0;
        return Math.min(baseWeight + keywordBonus, 10);
    }
}

// CSS Styles for enhanced links
const aiStyles = `
<style>
.ai-semantic-link {
    color: #2563eb;
    text-decoration: none;
    border-bottom: 1px dotted #2563eb;
    transition: all 0.3s ease;
}

.ai-semantic-link:hover {
    color: #1d4ed8;
    border-bottom-style: solid;
}

.ai-auto-link {
    color: #059669;
    text-decoration: none;
    font-weight: 500;
    position: relative;
}

.ai-auto-link:hover {
    color: #047857;
}

.ai-auto-link:hover::after {
    content: "🔗";
    position: absolute;
    right: -15px;
    font-size: 0.8em;
}

.ai-related-services {
    margin-top: 1.5rem;
    padding: 1rem;
    background: rgba(26, 26, 26, 0.8);
    border-left: 4px solid #4caf50;
    border-radius: 8px;
    font-size: 0.95em;
    border: 1px solid rgba(76, 175, 80, 0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.ai-related-services:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.15);
}

.ai-related-services strong {
    color: #ffffff;
    font-weight: 600;
}

.ai-related-services p {
    margin: 0;
    color: #b0b0b0;
    line-height: 1.6;
}

.ai-semantic-link {
    color: #4caf50 !important;
    text-decoration: none !important;
    font-weight: 500;
    transition: color 0.3s ease;
    border-bottom: none !important;
}

.ai-semantic-link:hover {
    color: #66bb6a !important;
    text-decoration: none !important;
    border-bottom: 1px solid #66bb6a;
}

@media (prefers-reduced-motion: reduce) {
    .ai-semantic-link, .ai-auto-link {
        transition: none;
    }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', aiStyles);

// Initialize the unified engine
new AIUnifiedEngine();