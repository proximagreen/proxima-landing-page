FROM node:22-alpine AS builder
WORKDIR /app

ARG VITE_APP_URL=https://app.proxima.green
ARG VITE_API_URL=
ARG VITE_OPENROUTER_API_KEY=
ARG VITE_OPENROUTER_MODEL=mistralai/voxtral-small-24b-2507
ARG VITE_MISTRAL_API_KEY=

ENV VITE_APP_URL=$VITE_APP_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_OPENROUTER_API_KEY=$VITE_OPENROUTER_API_KEY
ENV VITE_OPENROUTER_MODEL=$VITE_OPENROUTER_MODEL
ENV VITE_MISTRAL_API_KEY=$VITE_MISTRAL_API_KEY

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/api ./api
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "api/server.js"]
