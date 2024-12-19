#!/bin/bash

echo "Waiting for database..."
if [ python manage.py shell -c "from django.db import django; print(django.db.connection.ensure_connection())" ]; then
    echo "Database is ready"
else
    echo "Database is not ready"
fi

python manage.py migrate
python manage.py collectstatic --noinput

if [ "$USE_SPACES" != "True" ]; then
    # Ensure media directory exists for local development
    mkdir -p media
fi

exec gunicorn core.wsgi:application --bind 0.0.0.0:8000