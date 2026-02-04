FROM node:20-bullseye-slim AS builder
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 build-essential git ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./

RUN npm ci --silent

COPY . .
RUN npm run build

RUN npm prune --production --silent

FROM node:20-bullseye-slim AS runner
WORKDIR /app

# ENV NODE_ENV=production
# ENV PORT=3000

COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package-lock.json /app/

EXPOSE 80

CMD ["node", ".output/server/index.mjs"]
