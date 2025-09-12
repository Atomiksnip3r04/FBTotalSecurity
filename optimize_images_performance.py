#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script per ottimizzare le immagini identificate da PageSpeed Insights
Riduce le dimensioni delle immagini alle dimensioni effettivamente utilizzate
"""

import os
from PIL import Image
import sys

def optimize_image(input_path, output_path, target_width, target_height, quality=85):
    """
    Ottimizza un'immagine ridimensionandola e comprimendola
    """
    try:
        with Image.open(input_path) as img:
            # Converti in RGB se necessario
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')
            
            # Ridimensiona mantenendo le proporzioni
            img.thumbnail((target_width, target_height), Image.Resampling.LANCZOS)
            
            # Salva con compressione ottimizzata
            img.save(output_path, 'WEBP', quality=quality, optimize=True)
            
            # Calcola la riduzione
            original_size = os.path.getsize(input_path)
            new_size = os.path.getsize(output_path)
            reduction = original_size - new_size
            reduction_percent = (reduction / original_size) * 100
            
            print(f"✅ {os.path.basename(input_path)}:")
            print(f"   Dimensioni: {img.size[0]}x{img.size[1]} -> {target_width}x{target_height}")
            print(f"   Dimensione file: {original_size:,} -> {new_size:,} bytes")
            print(f"   Riduzione: {reduction:,} bytes ({reduction_percent:.1f}%)")
            print()
            
            return reduction
            
    except Exception as e:
        print(f"❌ Errore nell'ottimizzazione di {input_path}: {e}")
        return 0

def main():
    # Directory delle icone
    icons_dir = "icons"
    
    # Immagini da ottimizzare basate sui risultati PageSpeed Insights
    images_to_optimize = [
        {
            'input': os.path.join(icons_dir, 'CIVIS-copertina.webp'),
            'output': os.path.join(icons_dir, 'CIVIS-copertina-optimized.webp'),
            'width': 380,  # Dimensione effettiva utilizzata nel sito
            'height': 253,
            'description': 'Copertina CIVIS (1536x863 -> 380x253)'
        },
        {
            'input': os.path.join(icons_dir, 'placeholder1-svg-ITLgroup.webp'),
            'output': os.path.join(icons_dir, 'placeholder1-svg-ITLgroup-optimized.webp'),
            'width': 283,  # Dimensione effettiva utilizzata nel sito
            'height': 266,
            'description': 'Placeholder 1 ITL Group (804x757 -> 283x266)'
        },
        {
            'input': os.path.join(icons_dir, 'placeholder2-svg-ITLgroup.webp'),
            'output': os.path.join(icons_dir, 'placeholder2-svg-ITLgroup-optimized.webp'),
            'width': 343,  # Dimensione effettiva utilizzata nel sito
            'height': 266,
            'description': 'Placeholder 2 ITL Group (535x415 -> 343x266)'
        },
        {
            'input': os.path.join(icons_dir, 'thumbnail-xecur-optimized.webp'),
            'output': os.path.join(icons_dir, 'thumbnail-xecur-super-optimized.webp'),
            'width': 408,  # Dimensione effettiva utilizzata nel sito
            'height': 214,
            'description': 'Thumbnail Xecur (477x268 -> 408x214)'
        }
    ]
    
    print("🖼️  Ottimizzazione immagini per PageSpeed Insights")
    print("=" * 50)
    print()
    
    total_reduction = 0
    
    for img_config in images_to_optimize:
        input_path = img_config['input']
        output_path = img_config['output']
        
        if not os.path.exists(input_path):
            print(f"⚠️  File non trovato: {input_path}")
            continue
        
        print(f"📸 Ottimizzando: {img_config['description']}")
        
        reduction = optimize_image(
            input_path,
            output_path,
            img_config['width'],
            img_config['height']
        )
        
        total_reduction += reduction
    
    print("=" * 50)
    print(f"💾 Riduzione totale: {total_reduction:,} bytes ({total_reduction/1024:.1f} KB)")
    print("\n✨ Ottimizzazione completata!")
    print("\n📝 Prossimi passi:")
    print("1. Aggiorna i riferimenti alle immagini nel codice HTML")
    print("2. Testa il sito per verificare che le immagini si caricino correttamente")
    print("3. Esegui nuovamente PageSpeed Insights per verificare i miglioramenti")

if __name__ == "__main__":
    main()