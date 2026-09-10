# ============================================================
# Frontend Dockerfile - Angular 22
# Multi-stage: development / production
# ============================================================

# ------------------------------------------------------------
# Base stage - Node.js con dependencias
# ------------------------------------------------------------
FROM node:20-alpine AS base
WORKDIR /app

# Instalar dependencias del sistema para build nativo
RUN apk add --no-cache python3 make g++

# Copiar package files
COPY package*.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# ------------------------------------------------------------
# Development stage - HMR enabled
# ------------------------------------------------------------
FROM base AS development
EXPOSE 4200
ENV NODE_ENV=development
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "4200", "--poll", "2000"]

# ------------------------------------------------------------
# Build stage - Production build
# ------------------------------------------------------------
FROM base AS build
ENV NODE_ENV=production
RUN npm run build

# ------------------------------------------------------------
# Production stage - Nginx serving static files
# ------------------------------------------------------------
FROM nginx:alpine AS production
COPY --from=build /app/dist/Frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]