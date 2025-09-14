from PIL import Image
import os

# Check dimensions and file sizes of thumbnail images
files = [
    'icons/thumbnail-xecur-optimized.webp',
    'icons/thumbnail-xecur-super-optimized.webp'
]

for file_path in files:
    if os.path.exists(file_path):
        img = Image.open(file_path)
        file_size = os.path.getsize(file_path) / 1024  # KB
        print(f'{os.path.basename(file_path)}: {img.size[0]}x{img.size[1]} - {file_size:.1f} KB')
        img.close()
    else:
        print(f'{file_path}: File not found')