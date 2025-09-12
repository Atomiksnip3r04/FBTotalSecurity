#!/usr/bin/env python3
import http.server
import socketserver
from urllib.parse import urlparse
import os

class SecureHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Aggiungi header di sicurezza
        self.send_header('X-Frame-Options', 'SAMEORIGIN')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-XSS-Protection', '1; mode=block')
        self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
        self.send_header('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'")
        super().end_headers()

    def guess_type(self, path):
        """Imposta i tipi MIME corretti"""
        # Converti path in stringa per evitare errori di tipo
        path_str = str(path)
        
        # Assicurati che i file HTML abbiano il tipo MIME corretto
        if path_str.endswith('.html'):
            return 'text/html'
        elif path_str.endswith('.css'):
            return 'text/css'
        elif path_str.endswith('.js'):
            return 'application/javascript'
        elif path_str.endswith('.png'):
            return 'image/png'
        elif path_str.endswith('.jpg') or path_str.endswith('.jpeg'):
            return 'image/jpeg'
        elif path_str.endswith('.webp'):
            return 'image/webp'
        elif path_str.endswith('.svg'):
            return 'image/svg+xml'
        
        # Fallback per tipi di file non riconosciuti
        return 'application/octet-stream'

if __name__ == '__main__':
    PORT = 8000
    
    # Cambia nella directory del sito web
    web_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(web_dir)
    
    with socketserver.TCPServer(("", PORT), SecureHTTPRequestHandler) as httpd:
        print(f"Server sicuro avviato su http://localhost:{PORT}/")
        print("Header di sicurezza attivi:")
        print("- X-Frame-Options: SAMEORIGIN")
        print("- X-Content-Type-Options: nosniff")
        print("- X-XSS-Protection: 1; mode=block")
        print("- Referrer-Policy: strict-origin-when-cross-origin")
        print("- Content-Security-Policy: Configurato per protezione XSS")
        print("\nPremi Ctrl+C per fermare il server")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer fermato.")