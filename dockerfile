# Stage 1: Build
FROM node:22 AS builder

WORKDIR /app

# Install build dependencies for canvas
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Run
FROM node:22-slim

# Install Chromium and dependencies for Puppeteer
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && apt-get install -y chromium \
    && apt-get install -y fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    && rm -rf /var/lib/apt/lists/*

# Set Puppeteer executable path
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# Copiar imágenes necesarias para los templates
COPY --from=builder /app/src/utils/report-templates/images ./src/utils/report-templates/images

EXPOSE 3000
# Comando para ejecutar la aplicación
CMD ["node", "dist/main.js"]