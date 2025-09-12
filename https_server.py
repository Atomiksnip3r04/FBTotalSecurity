#!/usr/bin/env python3
import http.server
import socketserver
import ssl
import os
import ipaddress
from urllib.parse import urlparse

class SecureHTTPSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Aggiungi header di sicurezza avanzati
        self.send_header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
        self.send_header('X-Frame-Options', 'SAMEORIGIN')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-XSS-Protection', '1; mode=block')
        self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
        self.send_header('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.google-analytics.com; connect-src 'self' https://www.google-analytics.com")
        super().end_headers()

    def do_GET(self):
        # Gestisci richieste per file mancanti
        if self.path.endswith('/'):
            self.path += 'index.html'
        return super().do_GET()

def create_self_signed_cert():
    """Crea un certificato SSL auto-firmato per il testing locale"""
    try:
        from cryptography import x509
        from cryptography.x509.oid import NameOID
        from cryptography.hazmat.primitives import hashes, serialization
        from cryptography.hazmat.primitives.asymmetric import rsa
        import datetime
        
        # Genera chiave privata
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
        )
        
        # Crea certificato
        subject = issuer = x509.Name([
            x509.NameAttribute(NameOID.COUNTRY_NAME, "IT"),
            x509.NameAttribute(NameOID.STATE_OR_PROVINCE_NAME, "Milano"),
            x509.NameAttribute(NameOID.LOCALITY_NAME, "Milano"),
            x509.NameAttribute(NameOID.ORGANIZATION_NAME, "FB Total Security Dev"),
            x509.NameAttribute(NameOID.COMMON_NAME, "localhost"),
        ])
        
        cert = x509.CertificateBuilder().subject_name(
            subject
        ).issuer_name(
            issuer
        ).public_key(
            private_key.public_key()
        ).serial_number(
            x509.random_serial_number()
        ).not_valid_before(
            datetime.datetime.utcnow()
        ).not_valid_after(
            datetime.datetime.utcnow() + datetime.timedelta(days=365)
        ).add_extension(
            x509.SubjectAlternativeName([
                x509.DNSName("localhost"),
                x509.IPAddress(ipaddress.IPv4Address("127.0.0.1")),
            ]),
            critical=False,
        ).sign(private_key, hashes.SHA256())
        
        # Salva certificato e chiave
        with open("server.crt", "wb") as f:
            f.write(cert.public_bytes(serialization.Encoding.PEM))
        
        with open("server.key", "wb") as f:
            f.write(private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption()
            ))
        
        return True
    except ImportError:
        print("⚠️  Modulo cryptography non disponibile. Usando certificato semplificato.")
        return False

def main():
    PORT = 8443  # Porta HTTPS standard per sviluppo
    
    # Verifica se esistono già i certificati
    if not (os.path.exists("server.crt") and os.path.exists("server.key")):
        print("🔐 Creazione certificato SSL auto-firmato...")
        if not create_self_signed_cert():
            print("❌ Impossibile creare certificato SSL. Usa il server HTTP normale.")
            return
    
    # Configura server HTTPS
    with socketserver.TCPServer(("", PORT), SecureHTTPSRequestHandler) as httpd:
        # Configura SSL
        context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
        context.load_cert_chain("server.crt", "server.key")
        httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
        
        print(f"🔒 Server HTTPS sicuro avviato su https://localhost:{PORT}/")
        print(f"📋 Nota: Il browser mostrerà un avviso per il certificato auto-firmato.")
        print(f"    Clicca 'Avanzate' > 'Procedi verso localhost (non sicuro)' per continuare.")
        print(f"🛑 Premi Ctrl+C per fermare il server")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server fermato")

if __name__ == "__main__":
    main()