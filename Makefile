-include .env
export

.PHONY: up down restart logs shell-db dev-bun dev-react app-up app-down app-build test lint format eslint-fix prettier-fix migrate init

init:
	cp -n .env.example .env || true
	bun install

dev-bun:
	bun run dev:bun

dev-react:
	bun run dev:react

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f

shell-db:
	docker compose exec mongo mongosh -u $${MONGO_USER} -p $${MONGO_PASSWORD} --authenticationDatabase admin $${MONGO_DB}

app-build:
	docker compose --profile app build

app-up:
	docker compose --profile app up -d

app-down:
	docker compose --profile app down

test:
	bun test

lint:
	bun run lint

eslint-fix:
	bunx eslint . --fix

format:
	bun run format

prettier-fix:
	bunx prettier . --write

migrate:
	bun run migrate
