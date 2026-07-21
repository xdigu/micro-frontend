FROM node:22-alpine

ENV APP_HOME=/workspace \
    YARN_CACHE_FOLDER=/usr/local/share/.cache/yarn \
    NEXT_TELEMETRY_DISABLED=1

# RUN corepack enable && corepack prepare yarn@1.22.22 --activatez

WORKDIR ${APP_HOME}

# Install git — required by the dev container (slim base image omits it) and by
# tools such as GitLens that expect a working git binary inside the container.
RUN apt-get update -qq \
    && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*

# Pre-create cache and build folders so named volumes inherit writable permissions.
RUN mkdir -p ${APP_HOME}/node_modules ${APP_HOME}/.faststore ${YARN_CACHE_FOLDER} \
    && chown -R node:node ${APP_HOME} ${YARN_CACHE_FOLDER}

COPY --chown=node:node package.json yarn.lock ./

USER node

RUN --mount=type=cache,target=/usr/local/share/.cache/yarn,uid=1000,gid=1000 \
    yarn install --frozen-lockfile --non-interactive

COPY --chown=node:node . .

EXPOSE 3000

ENV HOSTNAME=0.0.0.0

CMD ["sh", "-lc", "if [ ! -f node_modules/.yarn-integrity ]; then yarn install --frozen-lockfile --non-interactive; fi && yarn dev"]
