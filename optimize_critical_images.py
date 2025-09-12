#!/usr/bin/env python3
"""
Script per ottimizzare le immagini critiche identificate da Google PageSpeed
"""

import os
from PIL import Image
import shutil

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
            if output_path.endswith('.webp'):
                img.save(output_path, 'WEBP', quality=quality, optimize=True)
            else:
                img.save(output_path, 'JPEG', quality=quality, optimize=True)
            
            print(f"✓ Ottimizzato: {input_path} -> {output_path}")
            return True
    except Exception as e:
        print(f"✗ Errore nell'ottimizzazione di {input_path}: {e}")
        return False

def main():
    # Directory delle icone
    icons_dir = "icons"
    
    # Immagini da ottimizzare con le loro dimensioni target
    images_to_optimize = [
        {
            'input': os.path.join(icons_dir, 'logo_sito_franco.webp'),
            'output': os.path.join(icons_dir, 'logo_sito_franco_small.webp'),
            'width': 47,
            'height': 40,
            'description': 'Logo principale (853x869 -> 47x40)'
        },
        {
            'input': os.path.join(icons_dir, 'copertina-youtube-URfog.webp'),
            'output': os.path.join(icons_dir, 'copertina-youtube-URfog_small.webp'),
            'width': 380,
            'height': 214,
            'description': 'Copertina YouTube URfog (1280x720 -> 380x214)'
        },
        {
            'input': os.path.join(icons_dir, 'XECUR-logo-carosello-homepage.webp'),
            'output': os.path.join(icons_dir, 'XECUR-logo-carosello-homepage_small.webp'),
            'width': 49,
            'height': 26,
            'description': 'Logo XECUR carosello (678x361 -> 49x26)'
        },
        {
            'input': os.path.join(icons_dir, 'itlgroup-logo-carosello-homepage.webp'),
            'output': os.path.join(icons_dir, 'itlgroup-logo-carosello-homepage_small.webp'),
            'width': 67,
            'height': 26,
            'description': 'Logo ITL Group carosello (300x116 -> 67x26)'
        }
    ]
    
    print("🖼️  Ottimizzazione immagini critiche per Google PageSpeed")
    print("=" * 60)
    
    success_count = 0
    total_count = len(images_to_optimize)
    
    for img_config in images_to_optimize:
        print(f"\n📸 {img_config['description']}")
        
        if not os.path.exists(img_config['input']):
            print(f"✗ File non trovato: {img_config['input']}")
            continue
        
        success = optimize_image(
            img_config['input'],
            img_config['output'],
            img_config['width'],
            img_config['height']
        )
        
        if success:
            success_count += 1
            
            # Mostra le dimensioni dei file
            original_size = os.path.getsize(img_config['input'])
            optimized_size = os.path.getsize(img_config['output'])
            reduction = ((original_size - optimized_size) / original_size) * 100
            
            print(f"  📊 Dimensione originale: {original_size:,} bytes")
            print(f"  📊 Dimensione ottimizzata: {optimized_size:,} bytes")
            print(f"  📊 Riduzione: {reduction:.1f}%")
    
    print(f"\n🎯 Completato: {success_count}/{total_count} immagini ottimizzate")
    
    if success_count > 0:
        print("\n📝 Prossimi passi:")
        print("1. Aggiorna i riferimenti alle immagini nei file HTML")
        print("2. Implementa responsive images con srcset")
        print("3. Testa le performance con Google PageSpeed")

if __name__ == "__main__":
    main()