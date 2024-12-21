#!/bin/bash

# Start cron service
service cron start

# Wait for nginx to start
sleep 5

# Get SSL certificate
certbot --nginx \
  --non-interactive \
  --agree-tos \
  --email bammar@student.42abudhabi.ae \
  --domains 42devspace.duckdns.org \
  --redirect \
  --keep-until-expiring

# Add a cron job to auto-renew the certificate
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
