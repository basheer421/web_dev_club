#!/bin/sh

# Wait for database
echo "Waiting for database..."
python manage.py wait_for_db

# Create migrations if needed
echo "Creating migrations..."
python manage.py makemigrations

# Run migrations
echo "Running migrations..."
python manage.py migrate

# Initialize application
echo "Initializing application..."
python manage.py initialize_app

# Start server
echo "Starting server..."
python manage.py runserver 0.0.0.0:8000 