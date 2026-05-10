# syntax=docker/dockerfile:1
FROM oven/bun:1.3 AS builder
WORKDIR /app

COPY package.json bun.lock* bun.lockb* ./
COPY apps/web/package.json ./apps/web/
COPY packages/core/package.json ./packages/core/
COPY packages/cli/package.json ./packages/cli/
RUN bun install --frozen-lockfile

COPY . .
RUN bun --bun --cwd apps/web vite build

FROM oven/bun:1.3-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Bring just what's needed at runtime: the built nitro server, the workspace
# package manifests, and the drizzle migration files.
COPY --from=builder /app/apps/web/.output ./apps/web/.output
COPY --from=builder /app/apps/web/drizzle ./apps/web/drizzle
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=builder /app/packages ./packages

# SQLite + encryption-key files live under /data. Mount as a volume.
RUN mkdir -p /data
ENV SERENE_DB_PATH=/data/serene.db
ENV SERENE_MIGRATIONS_PATH=/app/apps/web/drizzle

EXPOSE 3001
CMD ["bun", "run", "/app/apps/web/.output/server/index.mjs"]
