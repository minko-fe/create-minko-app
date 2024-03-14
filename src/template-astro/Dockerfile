FROM node:18.15.0-alpine AS builder
RUN npm config set registry https://registry.npmmirror.com
WORKDIR /app

COPY . .

RUN \
  npm i pnpm --global; \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then pnpm i --frozen-lockfile --ignore-scripts; \
  else echo "Lockfile not found." && pnpm i; \
  fi

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

RUN \
	if [ "${NODE_ENV}" == "test" ]; then npm run build:test;\
	else npm run build; \
	fi

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/server/entry.mjs"]