/**
 * AI-Optimized Sitemap Generator
 * Generates dynamic sitemaps with AI-friendly metadata and structured information
 */

class AISitemapGenerator {
    constructor() {
        this.baseUrl = 'https://www.fbtotalsecurity.com';
        this.pages = [
            {
                url: '/',
                priority: 1.0,
                changefreq: 'weekly',
                aiTopics: ['sistemi sicurezza', 'nebbiogeni', 'videosorveglianza', 'serramenti blindati', 'allarmi'],
                contentType: 'homepage',
                expertise: 'security-systems-overview'
            },
            {
                url: '/nebbiogeni.html',
                priority: 0.9,
                changefreq: 'monthly',
                aiTopics: ['nebbiogeni antifurto', 'sistema nebbia densa', 'protezione istantanea'],
                contentType: 'product-service',
                expertise: 'fog-security-systems'
            },
            {
                url: '/serramenti.html',
                priority: 0.9,
                changefreq: 'monthly',
                aiTopics: ['porte blindate', 'serramenti sicurezza', 'protezione antieffrazione'],
                contentType: 'product-service',
                expertise: 'armored-doors-windows'
            },
            {
                url: '/sorveglianza.html',
                priority: 0.9,
                changefreq: 'monthly',
                aiTopics: ['videosorveglianza AI', 'telecamere intelligenti', 'monitoraggio remoto'],
                contentType: 'product-service',
                expertise: 'ai-surveillance-systems'
            },
            {
                url: '/allarmi.html',
                priority: 0.9,
                changefreq: 'monthly',
                aiTopics: ['sistemi allarme', 'allarme wireless', 'sensori movimento'],
                contentType: 'product-service',
                expertise: 'alarm-systems'
            },
            {
                url: '/chi-siamo.html',
                priority: 0.7,
                changefreq: 'quarterly',
                aiTopics: ['azienda sicurezza', 'esperienza settore', 'team professionale'],
                contentType: 'about-company',
                expertise: 'company-information'
            }
        ];
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.generate());
        } else {
            this.generate();
        }
    }

    generate() {
        this.generateXMLSitemap();
        this.generateJSONSitemap();
        this.generateAIContextSitemap();
        this.addSitemapReferences();
    }

    generateXMLSitemap() {
        const xmlContent = this.createXMLSitemap();
        this.createDownloadableFile('sitemap.xml', xmlContent, 'application/xml');
    }

    createXMLSitemap() {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ';
        xml += 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ';
        xml += 'xmlns:ai="https://schema.org/AIContext">\n';

        this.pages.forEach(page => {
            xml += '  <url>\n';
            xml += `    <loc>${this.baseUrl}${page.url}</loc>\n`;
            xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
            xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
            xml += `    <priority>${page.priority}</priority>\n`;
            
            // AI-specific extensions
            xml += `    <ai:topics>${page.aiTopics.join(', ')}</ai:topics>\n`;
            xml += `    <ai:contentType>${page.contentType}</ai:contentType>\n`;
            xml += `    <ai:expertise>${page.expertise}</ai:expertise>\n`;
            
            xml += '  </url>\n';
        });

        xml += '</urlset>';
        return xml;
    }

    generateJSONSitemap() {
        const jsonSitemap = {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            'name': 'FB Total Security',
            'url': this.baseUrl,
            'potentialAction': {
                '@type': 'SearchAction',
                'target': `${this.baseUrl}/search?q={search_term_string}`,
                'query-input': 'required name=search_term_string'
            },
            'mainEntity': this.pages.map(page => ({
                '@type': 'WebPage',
                'url': `${this.baseUrl}${page.url}`,
                'name': this.getPageTitle(page),
                'description': this.getPageDescription(page),
                'keywords': page.aiTopics,
                'about': page.aiTopics.map(topic => ({
                    '@type': 'Thing',
                    'name': topic
                })),
                'expertise': page.expertise,
                'contentType': page.contentType,
                'lastModified': new Date().toISOString()
            }))
        };

        const jsonContent = JSON.stringify(jsonSitemap, null, 2);
        this.createDownloadableFile('sitemap.json', jsonContent, 'application/json');
    }

    generateAIContextSitemap() {
        const aiContext = {
            '@context': 'https://schema.org',
            '@type': 'Dataset',
            'name': 'FB Total Security - AI Context Sitemap',
            'description': 'Structured data for AI understanding of security systems content',
            'creator': {
                '@type': 'Organization',
                'name': 'FB Total Security'
            },
            'dateCreated': new Date().toISOString(),
            'keywords': this.getAllUniqueTopics(),
            'distribution': this.pages.map(page => ({
                '@type': 'DataDownload',
                'contentUrl': `${this.baseUrl}${page.url}`,
                'encodingFormat': 'text/html',
                'about': page.aiTopics,
                'expertise': page.expertise,
                'contentType': page.contentType,
                'aiReadability': 'high',
                'semanticAnnotations': true
            })),
            'topicCategories': {
                'security-systems': ['nebbiogeni', 'allarmi', 'videosorveglianza', 'serramenti'],
                'technologies': ['intelligenza artificiale', 'wireless', 'smart home', 'IoT'],
                'services': ['consulenza', 'installazione', 'manutenzione', 'monitoraggio'],
                'geographic': ['Italia', 'Milano', 'Lombardia']
            }
        };

        const aiContent = JSON.stringify(aiContext, null, 2);
        this.createDownloadableFile('ai-context-sitemap.json', aiContent, 'application/json');
    }

    getPageTitle(page) {
        const titles = {
            '/': 'FB Total Security - Sistemi Sicurezza Avanzati',
            '/nebbiogeni.html': 'Sistemi Nebbiogeni Antifurto',
            '/serramenti.html': 'Porte Blindate e Serramenti Sicurezza',
            '/sorveglianza.html': 'Videosorveglianza Intelligente AI',
            '/allarmi.html': 'Sistemi Allarme Wireless',
            '/chi-siamo.html': 'Chi Siamo - FB Total Security'
        };
        return titles[page.url] || 'FB Total Security';
    }

    getPageDescription(page) {
        const descriptions = {
            '/': 'Leader in sistemi sicurezza avanzati con tecnologie AI',
            '/nebbiogeni.html': 'Sistemi nebbiogeni per protezione istantanea antifurto',
            '/serramenti.html': 'Porte blindate certificate e serramenti di sicurezza',
            '/sorveglianza.html': 'Videosorveglianza con intelligenza artificiale',
            '/allarmi.html': 'Sistemi allarme wireless e sensori avanzati',
            '/chi-siamo.html': 'Azienda leader nel settore sicurezza dal 2000'
        };
        return descriptions[page.url] || 'FB Total Security - Sistemi di sicurezza';
    }

    getAllUniqueTopics() {
        const allTopics = this.pages.flatMap(page => page.aiTopics);
        return [...new Set(allTopics)];
    }

    createDownloadableFile(filename, content, mimeType) {
        // Create a blob and download link for the file
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        // Create a hidden download link
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = filename;
        downloadLink.style.display = 'none';
        
        // Add to document, click, and remove
        document.body.appendChild(downloadLink);
        
        // Store reference for potential manual download
        window.aiSitemapFiles = window.aiSitemapFiles || {};
        window.aiSitemapFiles[filename] = {
            url: url,
            content: content,
            mimeType: mimeType
        };
        
        console.log(`AI Sitemap: ${filename} generated and ready for download`);
    }

    addSitemapReferences() {
        // Add sitemap references to the page head
        const sitemapLink = document.createElement('link');
        sitemapLink.rel = 'sitemap';
        sitemapLink.type = 'application/xml';
        sitemapLink.href = '/sitemap.xml';
        document.head.appendChild(sitemapLink);

        // Add robots meta for sitemap
        const robotsMeta = document.createElement('meta');
        robotsMeta.name = 'robots';
        robotsMeta.content = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
        document.head.appendChild(robotsMeta);

        // Sitemap reference is now handled through structured data
        console.log('🎯 Sitemap reference integrated into unified structured data');
    }
}

// Initialize AI Sitemap Generator
new AISitemapGenerator();

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AISitemapGenerator;
}