#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script per ottimizzare le immagini WebP di grandi dimensioni
Riduce le dimensioni mantenendo una qualità accettabile
"""

import os
from PIL import Image
import shutil

def optimize_webp_image(input_path, output_path, quality=80, max_width=1200):
    """
    Ottimizza un'immagine WebP riducendone dimensioni e qualità
    
    Args:
        input_path: percorso dell'immagine originale
        output_path: percorso dell'immagine ottimizzata
        quality: qualità di compressione (0-100)
        max_width: larghezza massima in pixel
    """
    try:
        with Image.open(input_path) as img:
            # Ottieni dimensioni originali
            original_width, original_height = img.size
            original_size = os.path.getsize(input_path)
            
            print(f"Ottimizzando: {os.path.basename(input_path)}")
            print(f"  Dimensioni originali: {original_width}x{original_height}")
            print(f"  Dimensione file originale: {original_size/1024:.1f} KB")
            
            # Ridimensiona se necessario
            if original_width > max_width:
                ratio = max_width / original_width
                new_height = int(original_height * ratio)
                img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                print(f"  Ridimensionata a: {max_width}x{new_height}")
            
            # Salva con compressione ottimizzata
            img.save(output_path, 'WEBP', quality=quality, optimize=True)
            
            new_size = os.path.getsize(output_path)
            reduction = ((original_size - new_size) / original_size) * 100
            
            print(f"  Nuova dimensione: {new_size/1024:.1f} KB")
            print(f"  Riduzione: {reduction:.1f}%")
            print()
            
            return True
            
    except Exception as e:
        print(f"Errore nell'ottimizzazione di {input_path}: {e}")
        return False

def main():
    # Immagini da ottimizzare (quelle sopra i 150KB)
    images_to_optimize = [
        'img2-app-urfog.webp',
        'assistenza.webp', 
        'tecnologie.webp',
        'esperienza.webp',
        'img1-app-urfog.webp',
        'thumbnail-xecur-optimized.webp'
    ]
    
    icons_dir = 'icons'
    backup_dir = 'icons_backup'
    
    # Crea directory di backup
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
        print(f"Creata directory di backup: {backup_dir}")
    
    optimized_count = 0
    
    for image_name in images_to_optimize:
        input_path = os.path.join(icons_dir, image_name)
        backup_path = os.path.join(backup_dir, image_name)
        
        if os.path.exists(input_path):
            # Crea backup
            shutil.copy2(input_path, backup_path)
            print(f"Backup creato: {backup_path}")
            
            # Ottimizza l'immagine
            # Usa qualità diversa in base alle dimensioni originali
            original_size = os.path.getsize(input_path) / 1024  # KB
            
            if original_size > 250:  # Immagini molto grandi
                quality = 75
                max_width = 1000
            elif original_size > 200:  # Immagini grandi
                quality = 80
                max_width = 1200
            else:  # Immagini medie
                quality = 85
                max_width = 1200
            
            if optimize_webp_image(input_path, input_path, quality, max_width):
                optimized_count += 1
        else:
            print(f"Immagine non trovata: {input_path}")
    
    print(f"\nOttimizzazione completata!")
    print(f"Immagini ottimizzate: {optimized_count}/{len(images_to_optimize)}")
    print(f"Backup salvati in: {backup_dir}")
    print("\nSe le immagini ottimizzate non sono soddisfacenti,")
    print("puoi ripristinare i backup dalla cartella icons_backup.")

if __name__ == '__main__':
    main()