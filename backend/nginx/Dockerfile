FROM nginx:1.25

# Install certbot, its nginx plugin, and cron
RUN apt-get update && \
    apt-get install -y python3-certbot-nginx cron && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

# Copy and set up init script
COPY init-letsencrypt.sh /init-letsencrypt.sh
RUN chmod +x /init-letsencrypt.sh

# Use the init script as the entrypoint
ENTRYPOINT ["/init-letsencrypt.sh"]
