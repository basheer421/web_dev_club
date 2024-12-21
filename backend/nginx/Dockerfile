FROM nginx:1.25

# Install certbot, its nginx plugin, and cron
RUN apt-get update && \
    apt-get install -y python3-certbot-nginx cron && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/
COPY init-letsencrypt.sh /docker-entrypoint.d/

# Make the init script executable
RUN chmod +x /docker-entrypoint.d/init-letsencrypt.sh
