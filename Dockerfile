FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
# Use npm install if package-lock.json is out of sync, otherwise use npm ci for faster installs
RUN if [ -f package-lock.json ]; then npm ci || npm install; else npm install; fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time environment variables (NEXT_PUBLIC_* only)
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_OWNER_ID
ARG NEXT_PUBLIC_KAKAO_JavaScript_KEY
ARG NEXT_PUBLIC_KAKAO_CHANNEL_ID

# Set environment variables for build (only public vars are needed at build time)
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_OWNER_ID=$NEXT_PUBLIC_OWNER_ID
ENV NEXT_PUBLIC_KAKAO_JavaScript_KEY=$NEXT_PUBLIC_KAKAO_JavaScript_KEY
ENV NEXT_PUBLIC_KAKAO_CHANNEL_ID=$NEXT_PUBLIC_KAKAO_CHANNEL_ID
ENV NODE_ENV=production

# Generate Prisma client and build
RUN npx prisma generate --schema ./prisma/schema.prisma
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]