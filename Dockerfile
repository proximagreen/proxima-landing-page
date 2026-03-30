FROM node:22-alpine AS builder
WORKDIR /app

ARG VITE_APP_URL=https://app.proxima.green
ARG VITE_STRIPE_PRO_LINK=
ARG VITE_OPENROUTER_API_KEY=
ARG VITE_OPENROUTER_MODEL=mistralai/voxtral-small-24b-2507
ARG VITE_MISTRAL_API_KEY=

ENV VITE_APP_URL=$VITE_APP_URL
ENV VITE_STRIPE_PRO_LINK=$VITE_STRIPE_PRO_LINK
ENV VITE_OPENROUTER_API_KEY=$VITE_OPENROUTER_API_KEY
ENV VITE_OPENROUTER_MODEL=$VITE_OPENROUTER_MODEL
ENV VITE_MISTRAL_API_KEY=$VITE_MISTRAL_API_KEY

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# SPA fallback
RUN echo 'server { listen 3000; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
