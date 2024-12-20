.PHONY: backend-up backend-down frontend-up frontend-down up down build logs

help:
	@echo "Usage: make [command]"
	@echo "Commands:"
	@echo "  up: Start backend services"
	@echo "  down: Stop backend services"
	@echo "  build: Build backend services"
	@echo "  logs: View logs for backend services"

# Backend commands
backend-up:
	cd backend && docker compose up -d

backend-down:
	cd backend && docker compose down

backend-build:
	cd backend && docker compose build

backend-logs:
	cd backend && docker compose logs -f

# Combined commands
up: backend-up

re: backend-down backend-build backend-up

down: backend-down

build: backend-build

ps:
	docker ps

logs:
	cd backend && docker compose logs -f & cd frontend && docker compose logs -f
