FROM nginx:1.25

# Install certbot
RUN apt-get update && \
    apt-get install -y certbot python3-certbot-nginx && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create necessary directories
RUN mkdir -p /var/www/html
RUN mkdir -p /etc/nginx/sites-available
RUN mkdir -p /etc/nginx/sites-enabled
RUN mkdir -p /etc/letsencrypt

# Remove default config and create new structure
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY sites-available/42devspace.duckdns.org /etc/nginx/sites-available/
RUN ln -s /etc/nginx/sites-available/42devspace.duckdns.org /etc/nginx/sites-enabled/

COPY init-letsencrypt.sh /init-letsencrypt.sh
RUN chmod +x /init-letsencrypt.sh

ENTRYPOINT ["/init-letsencrypt.sh"]
