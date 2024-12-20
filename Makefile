.PHONY: backend-up backend-down frontend-up frontend-down up down build logs

help:
	@echo "Usage: make [command]"
	@echo "Commands:"
	@echo "  up: Start backend and frontend services"
	@echo "  down: Stop backend and frontend services"
	@echo "  build: Build backend and frontend services"
	@echo "  logs: View logs for backend and frontend services"

# Backend commands
backend-up:
	cd backend && docker compose up -d

backend-down:
	cd backend && docker compose down

backend-build:
	cd backend && docker compose build

backend-logs:
	cd backend && docker compose logs -f

# Frontend commands
frontend-up:
	cd frontend && docker compose up -d

frontend-down:
	cd frontend && docker compose down

frontend-build:
	cd frontend && docker compose build

frontend-logs:
	cd frontend && docker compose logs -f

# Combined commands
up: backend-up frontend-up

re: backend-down backend-build backend-up frontend-down frontend-build frontend-up

down: frontend-down backend-down

build: backend-build frontend-build

ps:
	docker ps

logs:
	cd backend && docker compose logs -f & cd frontend && docker compose logs -f
