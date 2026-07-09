import http.server
import socketserver
import os
import webbrowser
import threading
import time

PORT = 8000
DIRECTORY = os.path.join(os.path.dirname(__file__), 'dist')

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def start_server():
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"Server running on http://localhost:{PORT}/")
        print(f"Press Ctrl+C to stop the server")
        httpd.serve_forever()

def open_browser():
    time.sleep(1)
    webbrowser.open(f'http://localhost:{PORT}/')

if __name__ == '__main__':
    print(f"Starting Clipe App server...")
    print(f"Serving files from: {DIRECTORY}")
    
    server_thread = threading.Thread(target=start_server)
    server_thread.daemon = True
    server_thread.start()
    
    open_browser()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nServer stopped.")
