# ─────────────────────────────────────────
# E-Commerce Docker Makefile
# Usage: make <command>
# ─────────────────────────────────────────

.PHONY: build up down restart logs shell migrate createsuperuser clean

## Build all Docker images
build:
	docker-compose up --build -d

## Start all containers (detached)
up:
	docker-compose up -d

## Stop all containers
down:
	docker-compose down

## Restart all containers
restart:
	docker-compose down && docker-compose up -d

## View live logs
logs:
	docker-compose logs -f

## View logs for a specific service (e.g. make logs-web)
logs-%:
	docker-compose logs -f $*

## Open Django shell inside web container
shell:
	docker-compose exec web python manage.py shell

## Open bash inside web container
bash:
	docker-compose exec web bash

## Run database migrations
migrate:
	docker-compose exec web python manage.py migrate

## Make new migrations
makemigrations:
	docker-compose exec web python manage.py makemigrations

## Create Django superuser
createsuperuser:
	docker-compose exec web python manage.py createsuperuser

## Collect static files
collectstatic:
	docker-compose exec web python manage.py collectstatic --no-input

## Open PostgreSQL shell
psql:
	docker-compose exec db psql -U postgres -d ecommerce_db

## Stop containers and remove volumes (WARNING: deletes DB data)
clean:
	docker-compose down -v

## Show running containers
status:
	docker-compose ps