#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script per risolvere il Cumulative Layout Shift (CLS) di 0.347
Identifica e corregge le cause principali del CLS negli elementi body
"""

import re
import os
from pathlib import Path

def add_image_dimensions(html_content, file_path):
    """
    Aggiunge dimensioni esplicite alle immagini che ne sono prive
    """
    changes_made = []
    
    # Definisci le dimensioni note per le immagini specifiche
    image_dimensions = {
        'logo_sito_franco.webp': {'width': 50, 'height': 50},
        'logo_sito_franco_small.webp': {'width': 50, 'height': 50},
        'CIVIS-copertina-optimized.webp': {'width': 800, 'height': 600},
        'placeholder1-svg-ITLgroup-optimized.webp': {'width': 400, 'height': 300},
        'placeholder2-svg-ITLgroup-optimized.webp': {'width': 400, 'height': 300},
        'thumbnail-xecur-super-optimized.webp': {'width': 320, 'height': 240},
        'assistenza.webp': {'width': 80, 'height': 80},
        'esperienza.webp': {'width': 80, 'height': 80},
        'tecnologie.webp': {'width': 80, 'height': 80},
        'allarmi.webp': {'width': 80, 'height': 80},
        'sorveglianza.webp': {'width': 80, 'height': 80},
        'serramenti.webp': {'width': 80, 'height': 80},
        'nebbiogeni.webp': {'width': 80, 'height': 80}
    }
    
    # Pattern per trovare tag img senza width/height
    img_pattern = r'<img([^>]*?)src=["\']([^"\'>]*?)(["\'][^>]*?)>'
    
    def fix_img_tag(match):
        before_src = match.group(1)
        src_value = match.group(2)
        after_src = match.group(3)
        
        # Estrai il nome del file dall'src
        filename = os.path.basename(src_value)
        
        # Controlla se ha già width e height
        has_width = 'width=' in before_src or 'width=' in after_src
        has_height = 'height=' in before_src or 'height=' in after_src
        
        if has_width and has_height:
            return match.group(0)  # Già ha dimensioni
        
        # Cerca dimensioni note per questo file
        dimensions = None
        for known_file, dims in image_dimensions.items():
            if known_file in filename:
                dimensions = dims
                break
        
        if not dimensions:
            # Dimensioni di default basate sul contesto
            if 'logo' in filename.lower():
                dimensions = {'width': 50, 'height': 50}
            elif 'icon' in filename.lower() or any(service in filename for service in ['allarmi', 'sorveglianza', 'serramenti', 'nebbiogeni', 'assistenza', 'esperienza', 'tecnologie']):
                dimensions = {'width': 80, 'height': 80}
            elif 'placeholder' in filename.lower() or 'copertina' in filename.lower():
                dimensions = {'width': 400, 'height': 300}
            else:
                dimensions = {'width': 300, 'height': 200}  # Default
        
        # Aggiungi dimensioni se mancanti
        width_attr = f' width="{dimensions["width"]}"' if not has_width else ''
        height_attr = f' height="{dimensions["height"]}"' if not has_height else ''
        
        if width_attr or height_attr:
            changes_made.append(f"Aggiunto {width_attr}{height_attr} a {filename}")
            return f'<img{before_src}src="{src_value}"{after_src}{width_attr}{height_attr}>'
        
        return match.group(0)
    
    # Applica le correzioni
    updated_content = re.sub(img_pattern, fix_img_tag, html_content)
    
    return updated_content, changes_made

def add_font_preload_optimization(html_content):
    """
    Ottimizza il preload dei font per ridurre il CLS
    """
    changes_made = []
    
    # Cerca se esiste già un preload per Inter
    if 'preload' in html_content and 'Inter' in html_content:
        return html_content, ["Font preload già presente"]
    
    # Trova la sezione head
    head_pattern = r'(<head[^>]*>)(.*?)(</head>)'
    head_match = re.search(head_pattern, html_content, re.DOTALL)
    
    if head_match:
        head_start = head_match.group(1)
        head_content = head_match.group(2)
        head_end = head_match.group(3)
        
        # Aggiungi preload per font critici dopo i meta tag
        font_preload = '''\n    <!-- Critical font preload to prevent CLS -->
    <link rel="preload" href="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuBWYAZ9hiA.woff2" as="font" type="font/woff2" crossorigin>'''
        
        # Inserisci dopo i meta tag viewport
        if 'viewport' in head_content:
            head_content = re.sub(
                r'(<meta name="viewport"[^>]*>)',
                r'\1' + font_preload,
                head_content
            )
            changes_made.append("Aggiunto preload per font Inter critici")
        else:
            # Inserisci all'inizio del head se non c'è viewport
            head_content = font_preload + head_content
            changes_made.append("Aggiunto preload per font Inter critici all'inizio del head")
        
        html_content = head_start + head_content + head_end
    
    return html_content, changes_made

def add_layout_stability_css(html_content):
    """
    Aggiunge CSS per stabilizzare il layout e prevenire CLS
    """
    changes_made = []
    
    # CSS per prevenire CLS
    stability_css = '''\n<style>
/* CLS Prevention Styles */
.logo-image {
    width: 50px !important;
    height: 50px !important;
    display: block;
}

.service-icon img {
    width: 80px !important;
    height: 80px !important;
    display: block;
}

.hero-container {
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    contain: layout style;
}

.nav-menu {
    min-height: 40px;
    contain: layout style;
}

/* Prevent layout shifts during image loading */
img {
    display: block;
    max-width: 100%;
    height: auto;
}

/* Stabilize carousel dimensions */
.partnership-carousel {
    min-height: 160px;
    contain: layout style;
}

.allarmi-carousel .carousel-container {
    min-height: 400px;
    contain: layout style;
}
</style>'''
    
    # Inserisci prima del tag </head>
    if '</head>' in html_content:
        html_content = html_content.replace('</head>', stability_css + '\n</head>')
        changes_made.append("Aggiunto CSS per stabilizzazione layout e prevenzione CLS")
    
    return html_content, changes_made

def process_html_file(file_path):
    """
    Processa un singolo file HTML per correggere il CLS
    """
    print(f"\n📄 Processando: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_size = len(content)
    all_changes = []
    
    # 1. Aggiungi dimensioni alle immagini
    content, img_changes = add_image_dimensions(content, file_path)
    all_changes.extend(img_changes)
    
    # 2. Ottimizza preload font (solo per index.html)
    if 'index.html' in file_path:
        content, font_changes = add_font_preload_optimization(content)
        all_changes.extend(font_changes)
    
    # 3. Aggiungi CSS di stabilizzazione (solo per index.html)
    if 'index.html' in file_path:
        content, css_changes = add_layout_stability_css(content)
        all_changes.extend(css_changes)
    
    # Salva il file modificato
    if all_changes:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        new_size = len(content)
        print(f"✅ Modifiche applicate: {len(all_changes)}")
        for change in all_changes:
            print(f"   • {change}")
        print(f"📏 Dimensione: {original_size:,} → {new_size:,} bytes")
    else:
        print("ℹ️  Nessuna modifica necessaria")
    
    return len(all_changes)

def main():
    print("🎯 Correzione Cumulative Layout Shift (CLS)")
    print("=" * 50)
    
    # File HTML da processare
    html_files = [
        'index.html',
        'sorveglianza.html',
        'allarmi.html',
        'serramenti.html',
        'nebbiogeni.html',
        'chi-siamo.html'
    ]
    
    total_changes = 0
    processed_files = 0
    
    for html_file in html_files:
        if os.path.exists(html_file):
            changes = process_html_file(html_file)
            total_changes += changes
            processed_files += 1
        else:
            print(f"⚠️  File non trovato: {html_file}")
    
    print(f"\n📊 Riepilogo:")
    print(f"📁 File processati: {processed_files}/{len(html_files)}")
    print(f"🔧 Modifiche totali: {total_changes}")
    
    if total_changes > 0:
        print(f"\n🎉 Correzioni CLS completate!")
        print(f"\n📝 Benefici attesi:")
        print(f"   • Riduzione significativa del CLS da 0.347 verso ~0.1")
        print(f"   • Immagini con dimensioni esplicite prevengono layout shift")
        print(f"   • Font preload riduce il reflow del testo")
        print(f"   • CSS di stabilizzazione mantiene dimensioni consistenti")
        print(f"\n🔄 Prossimi passi:")
        print(f"   1. Testa il sito per verificare che tutto funzioni")
        print(f"   2. Esegui PageSpeed Insights per misurare i miglioramenti")
        print(f"   3. Monitora il CLS nelle Core Web Vitals")
    else:
        print(f"\nℹ️  Tutti i file sono già ottimizzati per il CLS")

if __name__ == "__main__":
    main()