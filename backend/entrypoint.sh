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

# Start server
echo "Starting server..."
python manage.py runserver 0.0.0.0:8000 