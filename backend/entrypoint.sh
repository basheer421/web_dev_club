#!/bin/sh

# Wait for database
echo "Waiting for database..."
if [ python manage.py shell -c "from django.db import django; print(django.db.connection.ensure_connection())" ]; then
    echo "Database is ready"
else
    echo "Database is not ready"
fi


# Create migrations if needed
echo "Creating migrations..."
python manage.py makemigrations auth
python manage.py makemigrations contenttypes
python manage.py makemigrations sessions
python manage.py makemigrations sites
python manage.py makemigrations users
python manage.py makemigrations projects


# Run migrations
echo "Running migrations..."
python manage.py migrate auth
python manage.py migrate contenttypes
python manage.py migrate sessions
python manage.py migrate sites
python manage.py migrate users
python manage.py migrate projects
python manage.py migrate --run-syncdb

echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start server
echo "Starting server..."
python manage.py runserver 0.0.0.0:8000 