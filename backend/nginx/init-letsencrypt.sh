#!/bin/bash

# Start cron service
service cron start

# Wait for nginx to start
sleep 10

# Get and install SSL certificate
certbot --nginx \
  --non-interactive \
  --agree-tos \
  --email bammar@student.42abudhabi.ae \
  --domains 42devspace.duckdns.org \
  --redirect \
  --keep-until-expiring \
  --debug

# Add a cron job to auto-renew the certificate
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# Keep the script running (to keep container alive)
exec nginx -g 'daemon off;'
