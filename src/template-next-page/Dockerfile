# edit nextjs Dockerfile
# see https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

# https://github.com/vercel/next.js/issues/49929#issuecomment-1691269445
FROM node:18.17-alpine3.17 AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml* ./

RUN \
  npm i pm2@5.3.0 --global; \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM deps AS builder

ARG NODE_ENV

COPY package.json  ./

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN \
  if [ "${NODE_ENV}" == "test" ]; then npm run build_test;\
  else npm run build; \
  fi


FROM deps AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/ecosystem.config.js ./

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

ENV PORT 3000

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
EXPOSE ${PORT}

RUN chmod -R 777 /app/.next/

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
