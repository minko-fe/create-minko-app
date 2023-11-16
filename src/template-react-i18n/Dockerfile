FROM node:18.15.0-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY . .

RUN \
	if [ -f package-lock.json ]; then npm ci; \
	elif [ -f pnpm-lock.yaml ]; then pnpm i --no-frozen-lockfile --ignore-scripts; \
	else echo "Lockfile not found." && pnpm i --no-frozen-lockfile; \
	fi

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

RUN \
	if [ "${NODE_ENV}" == "test" ]; then npm run build:test;\
	else npm run build; \
	fi


FROM nginx:1.15
COPY --from=builder /app/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/ /usr/share/nginx/html
