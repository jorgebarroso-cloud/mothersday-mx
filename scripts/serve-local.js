/**
 * Servidor local para ver el sitio estático.
 * Prueba puertos 3000, 3001, 3080 (el primero libre).
 * Uso: node scripts/serve-local.js   o   npm run local
 * Abre: http://localhost:<puerto>
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORTS = [3000, 3001, 3080];
const ROOT = path.join(__dirname, '..');

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

function createServer() {
  return http.createServer((req, res) => {
    let urlPath = (req.url === '/' ? 'index.html' : req.url).replace(/^\//, '').split('?')[0];
    if (!urlPath) urlPath = 'index.html';
    urlPath = urlPath.replace(/\/$/, '') || 'index.html';
    let filePath = path.normalize(path.join(ROOT, urlPath));
    const relative = path.relative(ROOT, filePath);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.stat(filePath, (statErr, stat) => {
      if (!statErr && stat.isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Not Found: ' + urlPath);
            return;
          }
          console.error('Serve error:', err.code, filePath);
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Error loading file. See server console.');
          return;
        }
        const ext = path.extname(filePath);
        const contentType = MIME[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      });
    });
  });
}

function tryListen(portIndex) {
  if (portIndex >= PORTS.length) {
    console.error('  No hay puertos libres. Prueba cerrando otras apps que usen 3000, 3001 o 3080.');
    process.exit(1);
  }
  const port = PORTS[portIndex];
  const server = createServer();
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      tryListen(portIndex + 1);
    } else {
      console.error(err);
      process.exit(1);
    }
  });
  server.listen(port, () => {
    console.log('');
    console.log('  Servidor local:  http://localhost:' + port);
    console.log('  Ctrl+C para detener');
    console.log('');
  });
}

tryListen(0);
