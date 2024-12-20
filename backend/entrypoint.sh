#!/bin/bash

echo "Waiting for database..."
if [ python manage.py shell -c "from django.db import django; print(django.db.connection.ensure_connection())" ]; then
    echo "Database is ready"
else
    echo "Database is not ready"
fi

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Start Gunicorn
exec gunicorn core.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -