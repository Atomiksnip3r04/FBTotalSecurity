#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script per minimizzare il CSS rimuovendo commenti, spazi extra e ottimizzando le regole
"""

import re
import os

def minify_css(css_content):
    """
    Minimizza il contenuto CSS
    """
    # Rimuovi commenti CSS (/* ... */)
    css_content = re.sub(r'/\*[^*]*\*+(?:[^/*][^*]*\*+)*/', '', css_content)
    
    # Rimuovi spazi extra, tab e newline
    css_content = re.sub(r'\s+', ' ', css_content)
    
    # Rimuovi spazi attorno a caratteri speciali
    css_content = re.sub(r'\s*([{}:;,>+~])\s*', r'\1', css_content)
    
    # Rimuovi spazi attorno alle parentesi
    css_content = re.sub(r'\s*([()\[\]])\s*', r'\1', css_content)
    
    # Rimuovi l'ultimo punto e virgola prima della parentesi graffa chiusa
    css_content = re.sub(r';\s*}', '}', css_content)
    
    # Rimuovi spazi all'inizio e alla fine
    css_content = css_content.strip()
    
    # Ottimizzazioni specifiche
    # Rimuovi 0 non necessari (0px -> 0, 0em -> 0, etc.)
    css_content = re.sub(r'\b0+\.?0*(px|em|rem|%|vh|vw|pt|pc|in|cm|mm|ex|ch|vmin|vmax)\b', '0', css_content)
    
    # Converti colori hex lunghi in corti quando possibile (#ffffff -> #fff)
    css_content = re.sub(r'#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3\b', r'#\1\2\3', css_content)
    
    # Rimuovi quotes non necessarie da font-family
    css_content = re.sub(r'font-family:\s*["\']([^"\',]+)["\']', r'font-family:\1', css_content)
    
    return css_content

def main():
    input_file = 'styles.css'
    output_file = 'styles.min.css'
    
    print("🎨 Minimizzazione CSS per PageSpeed Insights")
    print("=" * 50)
    
    if not os.path.exists(input_file):
        print(f"❌ File {input_file} non trovato!")
        return
    
    # Leggi il file CSS originale
    with open(input_file, 'r', encoding='utf-8') as f:
        original_css = f.read()
    
    original_size = len(original_css.encode('utf-8'))
    print(f"📄 File originale: {input_file}")
    print(f"📏 Dimensione originale: {original_size:,} bytes ({original_size/1024:.1f} KB)")
    
    # Minimizza il CSS
    minified_css = minify_css(original_css)
    
    # Salva il file minimizzato
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(minified_css)
    
    minified_size = len(minified_css.encode('utf-8'))
    reduction = original_size - minified_size
    reduction_percent = (reduction / original_size) * 100
    
    print(f"✅ File minimizzato: {output_file}")
    print(f"📏 Dimensione minimizzata: {minified_size:,} bytes ({minified_size/1024:.1f} KB)")
    print(f"💾 Riduzione: {reduction:,} bytes ({reduction_percent:.1f}%)")
    
    if reduction_percent >= 20:
        print("🎉 Ottima riduzione! Il CSS è stato significativamente ottimizzato.")
    elif reduction_percent >= 10:
        print("✨ Buona riduzione! Il CSS è stato ottimizzato.")
    else:
        print("📝 Riduzione modesta, ma ogni byte conta per le performance.")
    
    print("\n📝 Prossimi passi:")
    print("1. Aggiorna i riferimenti nel HTML per utilizzare styles.min.css")
    print("2. Testa il sito per verificare che gli stili funzionino correttamente")
    print("3. Considera l'utilizzo di un CDN per servire il CSS minimizzato")

if __name__ == "__main__":
    main()