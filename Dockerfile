FROM node:22-alpine AS base

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app
RUN apk add --no-cache --virtual .build-deps \
  alpine-sdk \
  python3 \
  py3-pip \
  cairo-dev \
  pango-dev \
  jpeg-dev \
  giflib-dev \
  librsvg-dev \
  pkgconf
COPY package.json package-lock.json ./
RUN npm install
RUN apk del .build-deps

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate --schema ./prisma/schema.prisma

RUN --mount=type=secret,id=NEXT_PUBLIC_SUPABASE_URL,env=NEXT_PUBLIC_SUPABASE_URL \
  --mount=type=secret,id=NEXT_PUBLIC_SUPABASE_ANON_KEY,env=NEXT_PUBLIC_SUPABASE_ANON_KEY \
  --mount=type=secret,id=OPENAI_API_KEY,env=OPENAI_API_KEY \
  npm run build

# Stage 3: Production server
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]