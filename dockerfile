# Stage 1: Build the app
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Pass environment variables into the build container
ARG DATABASE_URL
ARG NEXT_PUBLIC_RAZORPAY_KEY_ID
ARG RAZORPAY_SECRET_KEY
ARG GEMINI_API_KEY

ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_PUBLIC_RAZORPAY_KEY_ID=$NEXT_PUBLIC_RAZORPAY_KEY_ID
ENV RAZORPAY_SECRET_KEY=$RAZORPAY_SECRET_KEY
ENV GEMINI_API_KEY=$GEMINI_API_KEY

RUN npx prisma generate
RUN npm run build

# Stage 2: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["npm", "start"]