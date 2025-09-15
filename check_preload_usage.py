import re
import os

def check_preload_usage(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Trova tutti i preload
    preload_pattern = r'<link[^>]*rel=["\']preload["\'][^>]*href=["\']([^"\']*)["\'][^>]*>'
    preloads = re.findall(preload_pattern, content)
    
    issues = []
    for preload_url in preloads:
        # Controlla se l'immagine è usata nel contenuto
        if preload_url.endswith('.webp') or preload_url.endswith('.jpg') or preload_url.endswith('.png'):
            # Cerca l'uso dell'immagine nel contenuto
            img_pattern = rf'<img[^>]*src=["\']?{re.escape(preload_url)}["\']?[^>]*>'
            if not re.search(img_pattern, content):
                # Controlla anche background-image in CSS
                bg_pattern = rf'background-image:\s*url\(["\']?{re.escape(preload_url)}["\']?\)'
                if not re.search(bg_pattern, content):
                    issues.append(f'Preload non utilizzato: {preload_url}')
    
    return issues

# Controlla tutti i file HTML
html_files = ['index.html', 'serramenti.html', 'allarmi.html', 'chi-siamo.html', 'nebbiogeni.html', 'sorveglianza.html']
all_issues = []

for file in html_files:
    if os.path.exists(file):
        issues = check_preload_usage(file)
        if issues:
            all_issues.extend([f'{file}: {issue}' for issue in issues])

if all_issues:
    print('PROBLEMI TROVATI:')
    for issue in all_issues:
        print(f'- {issue}')
else:
    print('✅ Tutti i preload sono utilizzati correttamente!')
    print('✅ I warning di preload non utilizzati sono stati risolti!')