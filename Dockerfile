# syntax=docker/dockerfile:1

# Development stage: used by docker-compose for local dev workflows
FROM node:20-alpine AS dev
WORKDIR /app
ENV NODE_ENV=development

COPY package*.json ./
RUN npm install --force || (npm install --no-audit --no-fund && npm install --force)

COPY . .

EXPOSE 5173
CMD ["tail", "-f", "/dev/null"]

# Build stage: compile the Vite React PWA
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --force || (npm install --no-audit --no-fund && npm install --force)

COPY . .
RUN npm run build

# Production stage: serve pre-built assets with Nginx
FROM nginx:stable-alpine AS production

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html

# Provide an nginx config suited for SPA routing + PWA assets
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
