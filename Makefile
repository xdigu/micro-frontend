DC = docker compose

.PHONY: help up down logs build rebuild restart ps status clean

help:
	@echo 'Available commands:'
	@echo '  make up       - Start all containers in detached mode'
	@echo '  make down     - Stop and remove all containers'
	@echo '  make logs     - Follow logs from all containers'
	@echo '  make build    - Build (or rebuild) all images'
	@echo '  make rebuild  - Rebuild images and start containers'
	@echo '  make restart  - Restart all containers'
	@echo '  make ps       - List running containers'
	@echo '  make status   - Alias for ps'
	@echo '  make clean    - Stop and remove containers + volumes'

up:
	$(DC) up -d

down:
	$(DC) down

logs:
	$(DC) logs -f

build:
	$(DC) build

rebuild:
	$(DC) up --build -d

restart:
	$(DC) restart

ps:
	$(DC) ps

status: ps

clean:
	$(DC) down -v
