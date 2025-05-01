FROM node:20.11 AS dependencies
ARG APP_HOME=/home/node/app
ARG SERVICE

WORKDIR /home/node/app

RUN corepack enable && corepack prepare pnpm@8 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig*.json .swcrc ./
COPY patches ./patches
COPY apps/shared/package.json ./apps/shared/
RUN pnpm install --frozen-lockfile

# Build shared
FROM node:20.11 as build-shared

ARG APP_HOME=/home/node/app
ARG SERVICE

WORKDIR ${APP_HOME}

RUN corepack enable && corepack prepare pnpm@8 --activate

COPY apps/shared ./apps/shared
COPY --from=dependencies /home/node/app/package.json /home/node/app/pnpm-lock.yaml /home/node/app/pnpm-workspace.yaml /home/node/app/tsconfig*.json /home/node/app/.swcrc ./
COPY --from=dependencies /home/node/app/node_modules ./node_modules
COPY --from=dependencies /home/node/app/apps/shared/node_modules ./apps/shared/node_modules
COPY --from=dependencies /home/node/app/patches ./patches
RUN pnpm --filter shared build

# Build service
FROM node:20.11  AS build-service

ARG APP_HOME=/home/node/app
ARG SERVICE

WORKDIR ${APP_HOME}

RUN corepack enable && corepack prepare pnpm@8 --activate

COPY --from=dependencies /home/node/app/package.json /home/node/app/pnpm-lock.yaml /home/node/app/pnpm-workspace.yaml /home/node/app/tsconfig*.json /home/node/app/.swcrc ./
COPY --from=dependencies /home/node/app/node_modules ./node_modules
COPY --from=dependencies /home/node/app/patches ./patches
COPY --from=build-shared /home/node/app/apps/shared ./apps/shared
COPY apps/${SERVICE} ./apps/${SERVICE}
RUN pnpm install --frozen-lockfile && pnpm --filter ${SERVICE} build && pnpm --filter ${SERVICE} --prod deploy build

# Final
FROM node:20.11-slim AS final

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /home/node/app
CMD ["node", "dist/main.js"]

COPY --from=build-service --chown=node:node /home/node/app/build/dist ./dist
COPY --from=build-service --chown=node:node /home/node/app/build/node_modules ./node_modules
COPY --from=build-service --chown=node:node /home/node/app/build/package.json .

# Cut unnecessary stuff from package.json. Only leave name, version, description and module type
RUN node -e "\
  const { name, description, version, type } = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));\
  fs.writeFileSync('./package.json', JSON.stringify({ name, version, description, type }, null, 2));\
"

USER node
