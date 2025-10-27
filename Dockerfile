FROM node:22-alpine AS base

# Stage 1: Install dependencies
FROM base AS builder
WORKDIR /app
ENV NODE_ENV=production

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG OPENAI_API_KEY

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate --schema ./prisma/schema.prisma
RUN npm run build
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