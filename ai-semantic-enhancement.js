/**
 * AI Semantic Enhancement Script
 * Dynamically adds semantic markup and context for better AI search engine understanding
 */

class AISemanticEnhancer {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.enhance());
        } else {
            this.enhance();
        }
    }

    enhance() {
        this.addSemanticMarkup();
        this.enhanceExistingContent();
        this.addContextualData();
        this.optimizeForAI();
    }

    addSemanticMarkup() {
        // Add semantic markup to key sections
        const sections = {
            'nebbiogeni': {
                itemscope: true,
                itemtype: 'https://schema.org/Service',
                'data-ai-topic': 'sistemi-nebbiogeni-antifurto'
            },
            'serramenti': {
                itemscope: true,
                itemtype: 'https://schema.org/Service',
                'data-ai-topic': 'serramenti-blindati-sicurezza'
            },
            'sorveglianza': {
                itemscope: true,
                itemtype: 'https://schema.org/Service',
                'data-ai-topic': 'videosorveglianza-intelligente-ai'
            },
            'allarmi': {
                itemscope: true,
                itemtype: 'https://schema.org/Service',
                'data-ai-topic': 'sistemi-allarme-wireless'
            }
        };

        Object.entries(sections).forEach(([id, attributes]) => {
            const element = document.getElementById(id);
            if (element) {
                Object.entries(attributes).forEach(([attr, value]) => {
                    element.setAttribute(attr, value);
                });
            }
        });
    }

    enhanceExistingContent() {
        // Add semantic meaning to existing content
        this.enhanceHeadings();
        this.enhanceFeatureLists();
        this.enhanceContactInfo();
        this.enhanceServiceDescriptions();
    }

    enhanceHeadings() {
        const headings = document.querySelectorAll('h1, h2, h3, h4');
        headings.forEach(heading => {
            const text = heading.textContent.toLowerCase();
            
            // Add semantic context based on content
            if (text.includes('nebbiogen') || text.includes('fog')) {
                heading.setAttribute('data-ai-concept', 'sistema-nebbiogeno');
                heading.setAttribute('itemprop', 'name');
            } else if (text.includes('serramento') || text.includes('blindat') || text.includes('porta')) {
                heading.setAttribute('data-ai-concept', 'serramenti-blindati');
                heading.setAttribute('itemprop', 'name');
            } else if (text.includes('videosorveglianza') || text.includes('telecamer') || text.includes('surveillance')) {
                heading.setAttribute('data-ai-concept', 'videosorveglianza-ai');
                heading.setAttribute('itemprop', 'name');
            } else if (text.includes('allarme') || text.includes('alarm')) {
                heading.setAttribute('data-ai-concept', 'sistemi-allarme');
                heading.setAttribute('itemprop', 'name');
            }
        });
    }

    enhanceFeatureLists() {
        const lists = document.querySelectorAll('ul, ol');
        lists.forEach(list => {
            const parent = list.closest('[data-ai-topic]');
            if (parent) {
                list.setAttribute('itemscope', '');
                list.setAttribute('itemtype', 'https://schema.org/ItemList');
                
                const items = list.querySelectorAll('li');
                items.forEach((item, index) => {
                    item.setAttribute('itemprop', 'itemListElement');
                    item.setAttribute('itemscope', '');
                    item.setAttribute('itemtype', 'https://schema.org/ListItem');
                    
                    // Add position for better structure
                    const positionSpan = document.createElement('meta');
                    positionSpan.setAttribute('itemprop', 'position');
                    positionSpan.setAttribute('content', (index + 1).toString());
                    item.appendChild(positionSpan);
                    
                    // Wrap text content
                    const textContent = item.textContent;
                    item.innerHTML = `<span itemprop="name">${textContent}</span>`;
                    item.appendChild(positionSpan);
                });
            }
        });
    }

    enhanceContactInfo() {
        // Enhance contact information with schema markup
        const contactSection = document.querySelector('#contatti, .contact-section');
        if (contactSection) {
            contactSection.setAttribute('itemscope', '');
            contactSection.setAttribute('itemtype', 'https://schema.org/ContactPoint');
            
            // Find and enhance email links
            const emailLinks = contactSection.querySelectorAll('a[href^="mailto:"]');
            emailLinks.forEach(link => {
                link.setAttribute('itemprop', 'email');
            });
            
            // Find and enhance phone links
            const phoneLinks = contactSection.querySelectorAll('a[href^="tel:"]');
            phoneLinks.forEach(link => {
                link.setAttribute('itemprop', 'telephone');
            });
        }
    }

    enhanceServiceDescriptions() {
        // Add detailed semantic markup to service descriptions
        const serviceDescriptions = document.querySelectorAll('[data-ai-topic] p, [data-ai-topic] .description');
        serviceDescriptions.forEach(desc => {
            desc.setAttribute('itemprop', 'description');
        });
    }

    addContextualData() {
        // Add hidden contextual data for AI understanding
        const contextData = {
            'sistemi-sicurezza': [
                'protezione antifurto',
                'sicurezza domestica',
                'sicurezza aziendale',
                'prevenzione crimini',
                'tecnologie innovative'
            ],
            'nebbiogeni': [
                'nebbia densa',
                'attivazione istantanea',
                'deterrente visivo',
                'protezione immediata',
                'sistema atossico'
            ],
            'videosorveglianza': [
                'intelligenza artificiale',
                'riconoscimento facciale',
                'analisi comportamentale',
                'monitoraggio remoto',
                'telecamere 4K'
            ],
            'serramenti': [
                'porte blindate',
                'classe resistenza RC',
                'certificazioni europee',
                'antieffrazione',
                'sicurezza perimetrale'
            ]
        };

        Object.entries(contextData).forEach(([topic, keywords]) => {
            // Context data is now handled through unified structured data
            console.log(`🎯 Context for ${topic} integrated into unified structured data`);
        });
    }

    optimizeForAI() {
        // Add AI-specific optimization tags
        this.addAIReadabilityMarkers();
        this.addTopicClusters();
        this.addEntityRelationships();
    }

    addAIReadabilityMarkers() {
        // Mark content sections for better AI parsing
        const contentSections = document.querySelectorAll('section, article, .content-block');
        contentSections.forEach((section, index) => {
            section.setAttribute('data-ai-section', `content-${index + 1}`);
            section.setAttribute('data-ai-readability', 'high');
            
            // Add reading time estimate
            const wordCount = section.textContent.split(' ').length;
            const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
            section.setAttribute('data-reading-time', `${readingTime} min`);
        });
    }

    addTopicClusters() {
        // Create topic clusters for better AI understanding
        const topicClusters = {
            'sicurezza-domestica': ['casa', 'famiglia', 'abitazione', 'residenziale'],
            'sicurezza-aziendale': ['ufficio', 'azienda', 'commerciale', 'business'],
            'tecnologie-ai': ['intelligenza artificiale', 'machine learning', 'riconoscimento', 'analisi'],
            'protezione-fisica': ['barriere', 'porte', 'finestre', 'perimetro']
        };

        Object.entries(topicClusters).forEach(([cluster, terms]) => {
            const clusterMeta = document.createElement('meta');
            clusterMeta.setAttribute('name', `topic-cluster-${cluster}`);
            clusterMeta.setAttribute('content', terms.join(', '));
            document.head.appendChild(clusterMeta);
        });
    }

    addEntityRelationships() {
        // Define entity relationships for knowledge graph
        const entityRelationships = {
            'FB Total Security': {
                'type': 'Organization',
                'specializes_in': ['sistemi sicurezza', 'nebbiogeni', 'videosorveglianza'],
                'serves': ['Italia', 'Milano', 'Lombardia'],
                'offers': ['consulenza gratuita', 'installazione professionale', 'manutenzione']
            }
        };

        const relationshipScript = document.createElement('script');
        relationshipScript.type = 'application/ld+json';
        relationshipScript.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': 'FB Total Security',
            'expertise': Object.values(entityRelationships['FB Total Security']).flat()
        });
        document.head.appendChild(relationshipScript);
    }
}

// Initialize AI Semantic Enhancement
new AISemanticEnhancer();

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AISemanticEnhancer;
}