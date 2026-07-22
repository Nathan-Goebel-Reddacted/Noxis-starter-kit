FROM oven/bun:1.3-alpine AS deps
WORKDIR /app
COPY package.json bun.lock ./
COPY apps/Bun/package.json ./apps/Bun/
COPY apps/React/package.json ./apps/React/
COPY apps/Shared/package.json ./apps/Shared/
RUN bun install --frozen-lockfile --ignore-scripts

FROM oven/bun:1.3-alpine AS build
WORKDIR /app
ARG VITE_WS_URL
ENV VITE_WS_URL=$VITE_WS_URL
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/React/node_modules ./apps/React/node_modules
COPY --from=deps /app/apps/Shared/node_modules ./apps/Shared/node_modules
COPY . .
RUN bun run --cwd apps/React build

FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/apps/React/dist /usr/share/nginx/html
EXPOSE 80
