#!/bin/bash

echo "Waiting for database..."
python manage.py shell -c "from django.db import connection; connection.ensure_connection()"
if [ $? -eq 0 ]; then
    echo "Database is ready"
else
    echo "Database is not ready"
fi

# Create static directory if it doesn't exist
mkdir -p staticfiles

python manage.py makemigrations

# Run migrations
python manage.py migrate

# Collect static files with --clear flag to ensure clean collection
python manage.py collectstatic --noinput --clear

# Start Gunicorn
exec gunicorn core.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -