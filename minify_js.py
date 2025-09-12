#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script per minimizzare il JavaScript rimuovendo commenti, spazi extra e ottimizzando il codice
"""

import re
import os

def minify_js(js_content):
    """
    Minimizza il contenuto JavaScript
    """
    # Rimuovi commenti single-line (// ...)
    js_content = re.sub(r'//.*?$', '', js_content, flags=re.MULTILINE)
    
    # Rimuovi commenti multi-line (/* ... */)
    js_content = re.sub(r'/\*[^*]*\*+(?:[^/*][^*]*\*+)*/', '', js_content)
    
    # Rimuovi spazi extra, tab e newline multipli
    js_content = re.sub(r'\s+', ' ', js_content)
    
    # Rimuovi spazi attorno a operatori e punteggiatura
    js_content = re.sub(r'\s*([{}();,=+\-*/<>!&|?:])\s*', r'\1', js_content)
    
    # Rimuovi spazi attorno alle parentesi
    js_content = re.sub(r'\s*([()\[\]])\s*', r'\1', js_content)
    
    # Rimuovi spazi dopo 'function', 'if', 'for', 'while', etc.
    js_content = re.sub(r'\b(function|if|for|while|switch|catch)\s+', r'\1 ', js_content)
    
    # Rimuovi spazi prima e dopo le virgole
    js_content = re.sub(r'\s*,\s*', ',', js_content)
    
    # Rimuovi spazi prima e dopo i punti e virgola
    js_content = re.sub(r'\s*;\s*', ';', js_content)
    
    # Rimuovi spazi attorno alle parentesi graffe
    js_content = re.sub(r'\s*{\s*', '{', js_content)
    js_content = re.sub(r'\s*}\s*', '}', js_content)
    
    # Rimuovi spazi all'inizio e alla fine
    js_content = js_content.strip()
    
    # Ottimizzazioni specifiche
    # Converti true/false in forma più corta quando possibile
    js_content = re.sub(r'\btrue\b', '!0', js_content)
    js_content = re.sub(r'\bfalse\b', '!1', js_content)
    
    # Rimuovi punti e virgola non necessari prima delle parentesi graffe chiuse
    js_content = re.sub(r';(?=})', '', js_content)
    
    return js_content

def main():
    input_file = 'script.js'
    output_file = 'script.min.js'
    
    print("⚡ Minimizzazione JavaScript per PageSpeed Insights")
    print("=" * 50)
    
    if not os.path.exists(input_file):
        print(f"❌ File {input_file} non trovato!")
        return
    
    # Leggi il file JavaScript originale
    with open(input_file, 'r', encoding='utf-8') as f:
        original_js = f.read()
    
    original_size = len(original_js.encode('utf-8'))
    print(f"📄 File originale: {input_file}")
    print(f"📏 Dimensione originale: {original_size:,} bytes ({original_size/1024:.1f} KB)")
    
    # Minimizza il JavaScript
    minified_js = minify_js(original_js)
    
    # Salva il file minimizzato
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(minified_js)
    
    minified_size = len(minified_js.encode('utf-8'))
    reduction = original_size - minified_size
    reduction_percent = (reduction / original_size) * 100
    
    print(f"✅ File minimizzato: {output_file}")
    print(f"📏 Dimensione minimizzata: {minified_size:,} bytes ({minified_size/1024:.1f} KB)")
    print(f"💾 Riduzione: {reduction:,} bytes ({reduction_percent:.1f}%)")
    
    if reduction_percent >= 25:
        print("🎉 Ottima riduzione! Il JavaScript è stato significativamente ottimizzato.")
    elif reduction_percent >= 15:
        print("✨ Buona riduzione! Il JavaScript è stato ottimizzato.")
    else:
        print("📝 Riduzione modesta, ma ogni byte conta per le performance.")
    
    print("\n📝 Prossimi passi:")
    print("1. Aggiorna i riferimenti nel HTML per utilizzare script.min.js")
    print("2. Testa il sito per verificare che tutte le funzionalità funzionino")
    print("3. Considera l'utilizzo di un CDN per servire il JS minimizzato")
    print("\n⚠️  Nota: Testa sempre il codice minimizzato prima del deploy!")

if __name__ == "__main__":
    main()