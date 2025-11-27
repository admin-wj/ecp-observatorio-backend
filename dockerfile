# Stage 1: Build
FROM node:22 AS builder

WORKDIR /app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

RUN apk update \
    && apk upgrade \
    && apk add --no-cache make g++ cairo-dev pango-dev libjpeg-turbo-dev giflib-dev librsvg-dev bzip2-dev jq python3 udev ttf-freefont chromium

COPY package*.json ./
RUN npm install canvas --build-from-source
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Run
FROM node:22-slim

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# Copiar imágenes necesarias para los templates
COPY --from=builder /app/src/utils/report-templates/images ./src/utils/report-templates/images

EXPOSE 3000
# Comando para ejecutar la aplicación
CMD ["node", "dist/main.js"]