#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script per calcolare gli hash SHA-256 degli script inline per la Content Security Policy
"""

import os
import re
import hashlib
import base64
from pathlib import Path

def calculate_sha256_hash(content):
    """Calcola l'hash SHA-256 di un contenuto e lo restituisce in formato base64"""
    # Rimuovi spazi bianchi iniziali e finali, ma mantieni la formattazione interna
    content = content.strip()
    # Calcola l'hash SHA-256
    hash_object = hashlib.sha256(content.encode('utf-8'))
    # Converti in base64
    return base64.b64encode(hash_object.digest()).decode('utf-8')

def extract_inline_scripts(file_path):
    """Estrae tutti gli script inline da un file HTML"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern per trovare script inline (non JSON-LD e non src esterni)
    pattern = r'<script(?![^>]*src=)(?![^>]*type=["\']application/ld\+json["\'])(?:[^>]*)>([\s\S]*?)</script>'
    matches = re.findall(pattern, content, re.IGNORECASE)
    
    scripts = []
    for match in matches:
        # Pulisci il contenuto dello script
        script_content = match.strip()
        if script_content:  # Solo se non è vuoto
            scripts.append(script_content)
    
    return scripts

def main():
    # Directory del progetto
    project_dir = Path('.')
    
    # File HTML da analizzare
    html_files = [
        'index.html',
        'nebbiogeni.html', 
        'serramenti.html',
        'sorveglianza.html',
        'allarmi.html',
        'chi-siamo.html'
    ]
    
    all_hashes = set()
    
    print("Analisi script inline per CSP...\n")
    
    for html_file in html_files:
        file_path = project_dir / html_file
        if file_path.exists():
            print(f"Analizzando {html_file}...")
            scripts = extract_inline_scripts(file_path)
            
            for i, script in enumerate(scripts, 1):
                hash_value = calculate_sha256_hash(script)
                all_hashes.add(hash_value)
                print(f"  Script {i}: sha256-{hash_value}")
                print(f"  Contenuto: {script[:100]}..." if len(script) > 100 else f"  Contenuto: {script}")
                print()
    
    print(f"\nTotale hash unici trovati: {len(all_hashes)}")
    print("\nHash per CSP:")
    
    # Hash esistente per script vuoto
    existing_hash = "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='"
    csp_hashes = [existing_hash]
    
    for hash_value in sorted(all_hashes):
        csp_hashes.append(f"'sha256-{hash_value}'")
    
    csp_script_src = " ".join(csp_hashes)
    print(f"\nScript-src hashes: {csp_script_src}")
    
    # Genera la CSP completa
    print("\n" + "="*80)
    print("CSP COMPLETA DA AGGIORNARE IN .htaccess:")
    print("="*80)
    
    csp_policy = f'''Header always set Content-Security-Policy "default-src 'self'; script-src 'self' {csp_script_src} https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://fonts.googleapis.com https://tagmanager.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://tagmanager.google.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.google-analytics.com https://ssl.google-analytics.com https://www.googletagmanager.com https://googletagmanager.com https://region1.google-analytics.com https://stats.g.doubleclick.net; connect-src 'self' https://www.google-analytics.com https://ssl.google-analytics.com https://www.googletagmanager.com https://region1.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://googletagmanager.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; require-trusted-types-for 'script'; upgrade-insecure-requests; block-all-mixed-content;"'''
    
    print(csp_policy)
    
if __name__ == "__main__":
    main()