.PHONY: build up down restart logs shell migrate createsuperuser test clean help

# Default target
help:
	@echo "Available commands:"
	@echo "  make build          - Build all services"
	@echo "  make up            - Start all services"
	@echo "  make down          - Stop all services"
	@echo "  make restart       - Restart all services"
	@echo "  make logs          - View logs of all services"
	@echo "  make shell         - Open Django shell"
	@echo "  make migrate       - Run Django migrations"
	@echo "  make createsuperuser - Create Django superuser"
	@echo "  make test          - Run Django tests"
	@echo "  make clean         - Remove all containers and volumes"

# Build the services
build:
	docker compose build

# Start the services
up:
	docker compose up -d

# Stop the services
down:
	docker compose down

# Restart the services
restart:
	docker compose restart

# View the logs
logs:
	docker compose logs -f

# Open Django shell
shell:
	docker compose exec backend python manage.py shell

# Run migrations
migrate:
	docker compose exec backend python manage.py makemigrations
	docker compose exec backend python manage.py migrate

# Create superuser
createsuperuser:
	docker compose exec backend python manage.py createsuperuser

# Run tests
test:
	docker compose exec backend python manage.py test

# Clean up everything
clean:
	docker system prune -a --volumes -f
	find . -type d -name "__pycache__" -exec rm -r {} +
	find . -type f -name "*.pyc" -delete

# Development shortcuts
dev-build: build up migrate

dev-rebuild: clean build up migrate 