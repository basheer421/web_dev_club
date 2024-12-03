#!/bin/sh

# Wait for database
echo "Waiting for database..."
python manage.py wait_for_db

# Run migrations
echo "Running migrations..."
python manage.py migrate

# Initialize site
echo "Initializing site..."
python manage.py init_site

# Create superuser if it doesn't exist
echo "Creating superuser..."
python manage.py shell -c "
from django.contrib.auth import get_user_model;
User = get_user_model();
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
"

# Start server
echo "Starting server..."
python manage.py runserver 0.0.0.0:8000 