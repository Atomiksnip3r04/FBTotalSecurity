// Fix per i bottoni "Scopri di più" nella pagina chi-siamo.html

(function() {
    'use strict';
    
    console.log('🔧 Fix buttons script loaded');
    
    function fixServiceButtons() {
        console.log('🔧 Attempting to fix service buttons...');
        
        // Trova tutti i bottoni service-link
        const serviceLinks = document.querySelectorAll('.service-link');
        console.log('🔧 Found service-link buttons:', serviceLinks.length);
        
        serviceLinks.forEach((link, index) => {
            console.log(`🔧 Processing button ${index + 1}:`, link.href);
            
            // Rimuovi tutti gli event listener esistenti clonando l'elemento
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
            
            // Aggiungi un nuovo event listener pulito
            newLink.addEventListener('click', function(e) {
                console.log(`🔧 Button ${index + 1} clicked:`, this.href);
                
                // Assicurati che il link funzioni
                if (this.href && this.href !== '#') {
                    console.log('🔧 Navigating to:', this.href);
                    window.location.href = this.href;
                } else {
                    console.error('🔧 Invalid href:', this.href);
                }
            });
            
            // Aggiungi stili per assicurarsi che sia cliccabile
            newLink.style.pointerEvents = 'auto';
            newLink.style.cursor = 'pointer';
            newLink.style.zIndex = '1000';
            newLink.style.position = 'relative';
            
            console.log(`🔧 Button ${index + 1} fixed successfully`);
        });
    }
    
    // Esegui il fix quando il DOM è pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixServiceButtons);
    } else {
        fixServiceButtons();
    }
    
    // Esegui il fix anche dopo un breve delay per essere sicuri
    setTimeout(fixServiceButtons, 1000);
    
})();

// Aggiungi anche un fix per eventuali problemi di CSS
const fixCSS = `
<style>
.service-link {
    pointer-events: auto !important;
    cursor: pointer !important;
    z-index: 1000 !important;
    position: relative !important;
    display: inline-block !important;
}

.service-card {
    pointer-events: auto !important;
}

.service-card * {
    pointer-events: auto !important;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', fixCSS);
console.log('🔧 CSS fix applied');