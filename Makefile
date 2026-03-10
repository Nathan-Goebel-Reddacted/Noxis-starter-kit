-include .env
export

.PHONY: up down restart logs shell-db test lint format migrate init

init:
	cp -n .env.example .env || true
	bun install

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f

shell-db:
	docker compose exec postgres psql -U $${POSTGRES_USER} -d $${POSTGRES_DB}

test:
	bun test

lint:
	bun run lint

format:
	bun run format

migrate:
	bun run migrate
