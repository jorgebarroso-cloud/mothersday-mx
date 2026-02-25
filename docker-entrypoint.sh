#!/bin/sh
set -e

# Obtener el puerto de la variable de entorno, por defecto 8080
export PORT="${PORT:-8080}"

echo "=== Configuring nginx to listen on port $PORT ==="
echo "PORT environment variable: $PORT"

# Usar envsubst para reemplazar ${PORT} en el template
# Esto es más confiable que sed para variables de entorno
envsubst '${PORT}' < /tmp/nginx.conf.template > /etc/nginx/conf.d/default.conf

echo "=== Nginx configuration ==="
cat /etc/nginx/conf.d/default.conf

echo "=== Verifying port in nginx config ==="
if ! grep -q "listen.*$PORT" /etc/nginx/conf.d/default.conf; then
    echo "ERROR: Port $PORT not found in nginx configuration"
    exit 1
fi

echo "=== Testing nginx configuration ==="
if ! nginx -t; then
    echo "ERROR: Nginx configuration test failed"
    cat /etc/nginx/conf.d/default.conf
    exit 1
fi

echo "=== Starting nginx server on port $PORT ==="
# Iniciar nginx en modo foreground (daemon off)
exec nginx -g "daemon off;"
