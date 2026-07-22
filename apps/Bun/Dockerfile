FROM oven/bun:1.3-alpine AS deps
WORKDIR /app
COPY package.json bun.lock ./
COPY apps/Bun/package.json ./apps/Bun/
COPY apps/React/package.json ./apps/React/
COPY apps/Shared/package.json ./apps/Shared/
RUN bun install --frozen-lockfile --ignore-scripts

FROM oven/bun:1.3-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/Bun/node_modules ./apps/Bun/node_modules
COPY --from=deps /app/apps/Shared/node_modules ./apps/Shared/node_modules
COPY . .
RUN bun run --cwd apps/Bun build

FROM oven/bun:1.3-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/Bun/node_modules ./apps/Bun/node_modules
COPY --from=build /app/apps/Bun/dist ./apps/Bun/dist
USER bun
EXPOSE 3000
CMD ["bun", "apps/Bun/dist/index.js"]
