# Stage 1: Build
FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./
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