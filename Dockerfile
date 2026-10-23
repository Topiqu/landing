# base
FROM oven/bun:1.4.3-slim AS base

WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# install
FROM base AS install

ARG TARGETARCH

WORKDIR /temp

COPY package.json bun.lock ./

RUN --mount=type=cache,id=topiqu-landing-bun-${TARGETARCH},target=/root/.bun/install/cache \
    BUN_INSTALL_CACHE_DIR=/root/.bun/install/cache \
    bun --bun install --frozen-lockfile

# prerelease
FROM base AS prerelease

COPY --from=install /temp/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production \
    NUXT_TELEMETRY_DISABLED=1

RUN bun --bun run build

# release
FROM base AS release
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

RUN chown bun:bun /usr/src/app
COPY --from=prerelease --chown=bun:bun /usr/src/app/.output ./
USER bun

EXPOSE 3000
ENTRYPOINT ["bun", "--bun", "server/index.mjs"]
