# Mother's Day UK - Static site served by Nginx (README template)
# No Node/Next.js build. Static files only.
FROM nginx:alpine

# Copy static site (index.html, css/, js/, images/, city folders, etc.)
COPY index.html 404.html sitemap.xml robots.txt site.webmanifest browserconfig.xml /usr/share/nginx/html/
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY images /usr/share/nginx/html/images
COPY legal /usr/share/nginx/html/legal
COPY london /usr/share/nginx/html/london
COPY manchester /usr/share/nginx/html/manchester
COPY birmingham /usr/share/nginx/html/birmingham

# Copy fonts (optional; folder may contain only README)
COPY fonts /usr/share/nginx/html/fonts

# Nginx config (port 8080 for Cloud Run)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
