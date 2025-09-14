#!/usr/bin/env python3
"""
Script per comprimere le immagini URfog WebP mantenendo una buona qualità
"""

import os
from PIL import Image
import shutil

def compress_webp_image(input_path, output_path, quality=45):
    """
    Comprimi un'immagine WebP mantenendo una buona qualità
    
    Args:
        input_path (str): Percorso dell'immagine originale
        output_path (str): Percorso dell'immagine compressa
        quality (int): Qualità di compressione (0-100, default 45)
    """
    try:
        # Apri l'immagine
        with Image.open(input_path) as img:
            # Ottieni le dimensioni originali
            original_width, original_height = img.size
            original_size = os.path.getsize(input_path)
            
            print(f"Immagine originale: {original_width}x{original_height}, {original_size/1024:.1f} KB")
            
            # Ridimensiona se troppo grande (mantenendo aspect ratio)
            max_width = 800
            if original_width > max_width:
                ratio = max_width / original_width
                new_height = int(original_height * ratio)
                img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                print(f"Ridimensionata a: {max_width}x{new_height}")
            
            # Salva con compressione ottimizzata
            img.save(
                output_path,
                'WebP',
                quality=quality,
                method=6,  # Metodo di compressione più lento ma più efficiente
                optimize=True,  # Ottimizzazione aggiuntiva
                lossless=False  # Compressione lossy per file più piccoli
            )
            
            # Verifica il risultato
            compressed_size = os.path.getsize(output_path)
            compression_ratio = (1 - compressed_size / original_size) * 100
            
            print(f"Immagine compressa: {compressed_size/1024:.1f} KB")
            print(f"Riduzione: {compression_ratio:.1f}%")
            
            return True
            
    except Exception as e:
        print(f"Errore durante la compressione di {input_path}: {e}")
        return False

def main():
    # Percorsi delle immagini
    images_to_compress = [
        {
            'input': 'icons/img1-app-urfog.webp',
            'output': 'icons/img1-app-urfog.webp',
            'backup': 'icons_backup/img1-app-urfog-original.webp'
        },
        {
            'input': 'icons_backup/img2-app-urfog.webp',
            'output': 'icons/img2-app-urfog.webp',
            'backup': None  # Già nel backup
        }
    ]
    
    print("=== Compressione Immagini URfog (Qualità 45 - Compressione Aggressiva) ===")
    print()
    
    for img_info in images_to_compress:
        input_path = img_info['input']
        output_path = img_info['output']
        backup_path = img_info['backup']
        
        if not os.path.exists(input_path):
            print(f"ATTENZIONE: File non trovato: {input_path}")
            continue
            
        print(f"Processando: {input_path}")
        
        # Crea backup se necessario
        if backup_path and not os.path.exists(backup_path):
            os.makedirs(os.path.dirname(backup_path), exist_ok=True)
            shutil.copy2(input_path, backup_path)
            print(f"Backup creato: {backup_path}")
        
        # Comprimi l'immagine
        success = compress_webp_image(input_path, output_path, quality=45)
        
        if success:
            print(f"✓ Compressione completata: {output_path}")
        else:
            print(f"✗ Errore nella compressione: {input_path}")
        
        print("-" * 50)
    
    print("Compressione completata!")

if __name__ == '__main__':
    main()