#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script per correggere gli avvisi di preload non utilizzati
Rimuove i preload dei font specifici mantenendo solo quelli necessari
"""

import re
import os

def fix_preload_warnings(file_path):
    """
    Rimuove i preload dei font non utilizzati per eliminare gli avvisi
    """
    print(f"\n📄 Processando: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_size = len(content)
    changes_made = []
    
    # Pattern per i preload dei font specifici da rimuovere
    font_preload_patterns = [
        r'\s*<link rel="preload" href="https://fonts\.gstatic\.com/s/inter/[^>]+>\s*\n?',
        r'\s*<!-- Preload critical Inter font files directly -->\s*\n?'
    ]
    
    # Rimuovi i preload dei font specifici
    for pattern in font_preload_patterns:
        matches = re.findall(pattern, content)
        if matches:
            content = re.sub(pattern, '', content)
            changes_made.append(f"Rimossi {len(matches)} preload di font specifici")
    
    # Pulisci righe vuote multiple
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
    
    # Salva il file se ci sono state modifiche
    if changes_made:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        new_size = len(content)
        print(f"✅ Modifiche applicate: {len(changes_made)}")
        for change in changes_made:
            print(f"   • {change}")
        print(f"📏 Dimensione: {original_size:,} → {new_size:,} bytes")
    else:
        print("ℹ️  Nessuna modifica necessaria")
    
    return len(changes_made)

def main():
    print("🔧 Correzione Avvisi Preload Non Utilizzati")
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
            changes = fix_preload_warnings(html_file)
            total_changes += changes
            processed_files += 1
        else:
            print(f"⚠️  File non trovato: {html_file}")
    
    print(f"\n📊 Riepilogo:")
    print(f"📁 File processati: {processed_files}/{len(html_files)}")
    print(f"🔧 Modifiche totali: {total_changes}")
    
    if total_changes > 0:
        print(f"\n🎉 Correzioni preload completate!")
        print(f"\n📝 Benefici:")
        print(f"   • Eliminati avvisi 'preload not used' nella console")
        print(f"   • Ridotto overhead di preload non necessari")
        print(f"   • Mantenuto solo il preload CSS dei font (più efficiente)")
        print(f"\n🔄 Risultato:")
        print(f"   • Console più pulita senza avvisi di preload")
        print(f"   • Performance mantenute con preload ottimizzati")
    else:
        print(f"\nℹ️  I preload sono già ottimizzati")

if __name__ == "__main__":
    main()