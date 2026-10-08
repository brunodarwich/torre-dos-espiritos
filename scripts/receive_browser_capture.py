"""Save a native browser JPEG locally during visual QA; loopback only."""
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
import base64

OUTPUT = Path(__file__).resolve().parents[1] / 'public/guardian-art/partida-guardioes.jpg'

class CaptureHandler(BaseHTTPRequestHandler):
    def cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', 'http://localhost:5173')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
    def do_OPTIONS(self):
        self.send_response(204); self.cors_headers(); self.end_headers()
    def do_POST(self):
        size = int(self.headers.get('Content-Length', '0'))
        if self.path != '/capture' or not 0 < size < 8000000:
            self.send_error(400); return
        payload = self.rfile.read(size).decode('ascii')
        if not payload.startswith('data:image/jpeg;base64,'):
            self.send_error(400); return
        data = base64.b64decode(payload.split(',', 1)[1], validate=True)
        if not data.startswith(b'\xff\xd8'):
            self.send_error(400); return
        OUTPUT.write_bytes(data)
        self.send_response(200); self.cors_headers(); self.end_headers()
        self.wfile.write(b'saved')
    def log_message(self, *args):
        pass

if __name__ == '__main__':
    HTTPServer(('127.0.0.1', 8011), CaptureHandler).serve_forever()
