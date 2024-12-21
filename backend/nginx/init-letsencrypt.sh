#!/bin/bash

# Get SSL certificate
certbot certonly --standalone \
  --non-interactive \
  --agree-tos \
  --email bammar@student.42abudhabi.ae \
  --domains 42devspace.duckdns.org

# Start nginx in foreground mode
exec nginx -g 'daemon off;'
