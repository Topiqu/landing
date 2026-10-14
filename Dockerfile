# Nuxt builds under Node; the generated server runs under Bun.
FROM node:24-slim AS build-node

# base (https://hub.docker.com/r/oven/bun/tags)
FROM oven/bun:1.4.2-slim AS base

WORKDIR /usr/src/app

RUN apt-get update -y && apt-get install -y openssl

# install
FROM base AS install

RUN mkdir -p /temp

COPY package.json bun.lock /temp/

RUN cd /temp && bun --bun install --shamefully-hoist --frozen-lockfile

# pre-release
FROM base AS prerelease

COPY --from=install /temp/node_modules node_modules
COPY --from=build-node /usr/local/bin/node /usr/local/bin/node
COPY . .

ENV NODE_ENV=production
RUN NODE_OPTIONS="--max-old-space-size=5120" bun run build

# release
FROM base AS release

COPY --from=prerelease /usr/src/app/.output .

EXPOSE 3000

ENTRYPOINT [ "bun", "--bun", "server/index.mjs" ]
