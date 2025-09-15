/**
 * AI Semantic Cross-Linking Engine
 * Implementa collegamenti semantici intelligenti tra FAQ, glossario e pagine servizi
 * per migliorare la comprensione AI e l'esperienza utente
 */

class AISemanticCrossLinker {
    constructor() {
        this.semanticMap = new Map();
        this.contextualRelations = new Map();
        this.init();
    }

    init() {
        this.buildSemanticMap();
        this.createContextualRelations();
        this.injectCrossLinks();
        this.enhanceWithStructuredData();
    }

    buildSemanticMap() {
        // Mappa semantica dei termini e concetti
        this.semanticMap.set('nebbiogeni', {
            mainPage: '/nebbiogeni',
            relatedFAQ: [
                'Come funziona esattamente un sistema nebbiogeno',
                'Qual è la differenza tra un sistema di allarme tradizionale e uno con intelligenza artificiale'
            ],
            glossaryTerms: ['Sistema Nebbiogeno', 'Sicurezza Perimetrale'],
            relatedServices: ['allarmi', 'videosorveglianza'],
            keywords: ['nebbia antifurto', 'deterrente visivo', 'protezione istantanea', 'sistema attivo'],
            contextualLinks: [
                {
                    anchor: 'sistemi di allarme wireless',
                    url: '/allarmi',
                    context: 'Integrazione perfetta con sistemi nebbiogeni per protezione completa'
                },
                {
                    anchor: 'videosorveglianza intelligente',
                    url: '/videosorveglianza', 
                    context: 'Verifica visiva automatica degli eventi nebbiogeni'
                }
            ]
        });

        this.semanticMap.set('serramenti', {
            mainPage: '/serramenti',
            relatedFAQ: [
                'Come scegliere la classe di resistenza giusta per porte blindate',
                'Quali sono i vantaggi della videosorveglianza con riconoscimento facciale'
            ],
            glossaryTerms: ['Serramenti Blindati', 'Classe di Resistenza RC', 'Controllo Accessi'],
            relatedServices: ['videosorveglianza', 'allarmi'],
            keywords: ['porte blindate', 'finestre antieffrazione', 'EN 1627', 'RC2 RC3', 'protezione fisica'],
            contextualLinks: [
                {
                    anchor: 'controllo accessi biometrico',
                    url: '/videosorveglianza',
                    context: 'Integrazione con serramenti per accesso automatizzato sicuro'
                },
                {
                    anchor: 'sistemi di allarme perimetrali',
                    url: '/allarmi',
                    context: 'Protezione completa con sensori su serramenti'
                }
            ]
        });

        this.semanticMap.set('videosorveglianza', {
            mainPage: '/videosorveglianza',
            relatedFAQ: [
                'Quali sono i vantaggi della videosorveglianza con riconoscimento facciale',
                'È possibile integrare diversi sistemi di sicurezza in un\'unica piattaforma'
            ],
            glossaryTerms: ['Videosorveglianza Intelligente', 'Riconoscimento Facciale', 'Analisi Comportamentale', 'Monitoraggio Remoto 24/7'],
            relatedServices: ['allarmi', 'nebbiogeni', 'serramenti'],
            keywords: ['telecamere AI', 'riconoscimento facciale', 'analisi comportamentale', '4K', 'cloud'],
            contextualLinks: [
                {
                    anchor: 'sistemi nebbiogeni intelligenti',
                    url: '/nebbiogeni',
                    context: 'Attivazione automatica nebbiogeni tramite analisi video AI'
                },
                {
                    anchor: 'serramenti con controllo accessi',
                    url: '/serramenti',
                    context: 'Apertura automatica serramenti tramite riconoscimento facciale'
                }
            ]
        });

        this.semanticMap.set('allarmi', {
            mainPage: '/allarmi',
            relatedFAQ: [
                'Qual è la differenza tra un sistema di allarme tradizionale e uno con intelligenza artificiale',
                'È possibile integrare diversi sistemi di sicurezza in un\'unica piattaforma'
            ],
            glossaryTerms: ['Sistema di Allarme Wireless', 'Sicurezza Perimetrale', 'Monitoraggio Remoto 24/7'],
            relatedServices: ['videosorveglianza', 'nebbiogeni', 'serramenti'],
            keywords: ['allarme wireless', 'sensori intelligenti', 'app smartphone', 'centrale operativa'],
            contextualLinks: [
                {
                    anchor: 'videosorveglianza con verifica',
                    url: '/videosorveglianza',
                    context: 'Verifica automatica allarmi tramite analisi video intelligente'
                },
                {
                    anchor: 'attivazione nebbiogeni',
                    url: '/nebbiogeni',
                    context: 'Risposta automatica con nebbiogeni su allarme confermato'
                }
            ]
        });
    }

    createContextualRelations() {
        // Relazioni contestuali per AI e motori di ricerca
        this.contextualRelations.set('sicurezza-integrata', {
            concept: 'Ecosistema di Sicurezza Integrato',
            description: 'Sinergia tra tutti i sistemi di protezione per massima efficacia',
            components: ['nebbiogeni', 'serramenti', 'videosorveglianza', 'allarmi'],
            benefits: [
                'Riduzione falsi allarmi attraverso verifica multipla',
                'Risposta automatica coordinata agli eventi',
                'Gestione unificata da singola piattaforma',
                'Ottimizzazione costi attraverso integrazione'
            ]
        });

        this.contextualRelations.set('ai-security', {
            concept: 'Intelligenza Artificiale per la Sicurezza',
            description: 'Applicazione AI per analisi predittiva e risposta automatica',
            applications: [
                'Riconoscimento pattern comportamentali anomali',
                'Classificazione automatica minacce vs. falsi allarmi', 
                'Ottimizzazione tempi di risposta emergenze',
                'Apprendimento continuo da eventi passati'
            ]
        });
    }

    injectCrossLinks() {
        // Inietta collegamenti semantici nel contenuto esistente
        document.addEventListener('DOMContentLoaded', () => {
            this.processTextContent();
            this.enhanceFAQSection();
            this.createGlossaryTooltips();
            this.addContextualSidebar();
        });
    }

    processTextContent() {
        const contentElements = document.querySelectorAll('p, li, dd, .content-text');
        
        contentElements.forEach(element => {
            let content = element.innerHTML;
            
            // Processa ogni termine nella mappa semantica
            this.semanticMap.forEach((data, term) => {
                data.keywords.forEach(keyword => {
                    const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
                    content = content.replace(regex, (match) => {
                        if (!element.querySelector(`a[href="${data.mainPage}"]`)) {
                            return `<a href="${data.mainPage}" class="semantic-link" data-term="${term}" title="Scopri di più su ${match}">${match}</a>`;
                        }
                        return match;
                    });
                });
            });
            
            element.innerHTML = content;
        });
    }

    enhanceFAQSection() {
        const faqItems = document.querySelectorAll('.faq-item, [itemtype*="Question"]');
        
        faqItems.forEach(faq => {
            const question = faq.querySelector('h3, .question, [itemprop="name"]');
            const answer = faq.querySelector('.answer, [itemprop="text"]');
            
            if (question && answer) {
                const questionText = question.textContent;
                
                // Trova collegamenti semantici per questa FAQ
                this.semanticMap.forEach((data, term) => {
                    if (data.relatedFAQ.some(faqText => questionText.includes(faqText.substring(0, 20)))) {
                        // Aggiungi collegamenti contestuali alla risposta
                        const relatedLinks = this.createRelatedLinksHTML(data.contextualLinks);
                        answer.innerHTML += relatedLinks;
                        
                        // Aggiungi structured data per la relazione
                        this.addFAQStructuredData(faq, data);
                    }
                });
            }
        });
    }

    createRelatedLinksHTML(contextualLinks) {
        if (!contextualLinks || contextualLinks.length === 0) return '';
        
        let html = '<div class="semantic-related-links"><h4>Approfondimenti correlati:</h4><ul>';
        
        contextualLinks.forEach(link => {
            html += `<li><a href="${link.url}" class="contextual-link" title="${link.context}">${link.anchor}</a> - ${link.context}</li>`;
        });
        
        html += '</ul></div>';
        return html;
    }

    createGlossaryTooltips() {
        // Crea tooltip interattivi per termini del glossario
        const glossaryTerms = [
            'Sistema Nebbiogeno', 'Serramenti Blindati', 'Videosorveglianza Intelligente',
            'Riconoscimento Facciale', 'Analisi Comportamentale', 'Classe di Resistenza RC'
        ];
        
        glossaryTerms.forEach(term => {
            const regex = new RegExp(`\\b(${term})\\b`, 'gi');
            document.body.innerHTML = document.body.innerHTML.replace(regex, 
                `<span class="glossary-term" data-term="${term}" title="Clicca per definizione">${term}</span>`
            );
        });
        
        // Aggiungi event listeners per tooltip
        document.querySelectorAll('.glossary-term').forEach(term => {
            term.addEventListener('mouseenter', this.showGlossaryTooltip.bind(this));
            term.addEventListener('mouseleave', this.hideGlossaryTooltip.bind(this));
        });
    }

    addContextualSidebar() {
        // Crea sidebar con collegamenti contestuali intelligenti
        const currentPage = window.location.pathname;
        let currentService = null;
        
        this.semanticMap.forEach((data, term) => {
            if (currentPage.includes(data.mainPage)) {
                currentService = { term, data };
            }
        });
        
        if (currentService) {
            const sidebar = this.createContextualSidebarHTML(currentService);
            document.body.insertAdjacentHTML('beforeend', sidebar);
        }
    }

    createContextualSidebarHTML(service) {
        const { term, data } = service;
        
        return `
            <div class="ai-contextual-sidebar" id="semantic-sidebar">
                <h3>Soluzioni Correlate</h3>
                <div class="related-services">
                    ${data.relatedServices.map(relatedTerm => {
                        const relatedData = this.semanticMap.get(relatedTerm);
                        return `
                            <div class="related-service-card">
                                <a href="${relatedData.mainPage}" class="service-link">
                                    <h4>${this.getServiceTitle(relatedTerm)}</h4>
                                    <p>${this.getServiceDescription(relatedTerm)}</p>
                                </a>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="contextual-faq">
                    <h4>FAQ Correlate</h4>
                    <ul>
                        ${data.relatedFAQ.map(faq => 
                            `<li><a href="#faq" class="faq-link">${faq}</a></li>`
                        ).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    enhanceWithStructuredData() {
        // Aggiunge structured data per collegamenti semantici
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "mainEntity": {
                "@type": "ItemList",
                "name": "Collegamenti Semantici Sicurezza",
                "itemListElement": []
            }
        };
        
        let position = 1;
        this.semanticMap.forEach((data, term) => {
            structuredData.mainEntity.itemListElement.push({
                "@type": "ListItem",
                "position": position++,
                "item": {
                    "@type": "Service",
                    "name": this.getServiceTitle(term),
                    "url": `https://www.fbtotalsecurity.com${data.mainPage}`,
                    "description": this.getServiceDescription(term),
                    "relatedLink": data.contextualLinks.map(link => ({
                        "@type": "WebPage",
                        "url": `https://www.fbtotalsecurity.com${link.url}`,
                        "name": link.anchor,
                        "description": link.context
                    }))
                }
            });
        });
        
        // Inietta structured data
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    getServiceTitle(term) {
        const titles = {
            'nebbiogeni': 'Sistemi Nebbiogeni Antifurto',
            'serramenti': 'Serramenti Blindati Certificati', 
            'videosorveglianza': 'Videosorveglianza Intelligente',
            'allarmi': 'Sistemi di Allarme Wireless'
        };
        return titles[term] || term;
    }

    getServiceDescription(term) {
        const descriptions = {
            'nebbiogeni': 'Protezione istantanea con nebbia densa atossica',
            'serramenti': 'Porte e finestre blindate certificate EN 1627-1630',
            'videosorveglianza': 'Telecamere AI con riconoscimento facciale',
            'allarmi': 'Sensori wireless intelligenti con app mobile'
        };
        return descriptions[term] || '';
    }

    showGlossaryTooltip(event) {
        const term = event.target.dataset.term;
        // Implementa tooltip con definizione dal glossario
        console.log(`Mostra tooltip per: ${term}`);
    }

    hideGlossaryTooltip(event) {
        // Nasconde tooltip
        console.log('Nascondi tooltip');
    }

    addFAQStructuredData(faqElement, data) {
        // Aggiunge structured data specifici per FAQ correlate
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Question",
            "about": data.glossaryTerms.map(term => ({
                "@type": "DefinedTerm",
                "name": term,
                "inDefinedTermSet": {
                    "@type": "DefinedTermSet",
                    "name": "Terminologia Sistemi di Sicurezza"
                }
            }))
        };
        
        faqElement.setAttribute('data-structured', JSON.stringify(structuredData));
    }
}

// Inizializza il sistema di cross-linking semantico
document.addEventListener('DOMContentLoaded', () => {
    new AISemanticCrossLinker();
});

// CSS per styling dei collegamenti semantici
const semanticStyles = `
<style>
.semantic-link {
    color: #2563eb;
    text-decoration: underline;
    text-decoration-style: dotted;
    transition: all 0.3s ease;
}

.semantic-link:hover {
    color: #1d4ed8;
    text-decoration-style: solid;
}

.contextual-link {
    color: #059669;
    font-weight: 500;
}

.semantic-related-links {
    margin-top: 1rem;
    padding: 1rem;
    background: #f8fafc;
    border-left: 4px solid #3b82f6;
    border-radius: 0 8px 8px 0;
}

.semantic-related-links h4 {
    margin: 0 0 0.5rem 0;
    color: #1e40af;
    font-size: 0.9rem;
}

.semantic-related-links ul {
    margin: 0;
    padding-left: 1rem;
}

.semantic-related-links li {
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
}

.glossary-term {
    border-bottom: 1px dotted #6b7280;
    cursor: help;
    position: relative;
}

.ai-contextual-sidebar {
    position: fixed;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 300px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    z-index: 1000;
    max-height: 70vh;
    overflow-y: auto;
}

.related-service-card {
    margin-bottom: 1rem;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.related-service-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.service-link {
    text-decoration: none;
    color: inherit;
}

.related-service-card h4 {
    margin: 0 0 0.5rem 0;
    color: #1f2937;
    font-size: 0.9rem;
}

.related-service-card p {
    margin: 0;
    color: #6b7280;
    font-size: 0.8rem;
}

@media (max-width: 1200px) {
    .ai-contextual-sidebar {
        display: none;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', semanticStyles);