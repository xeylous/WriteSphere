# ─── Build Stage ──────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --ignore-scripts

COPY . .
RUN npm run build

# ─── Development Stage ────────────────────────
FROM node:22-alpine AS development

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 5000
CMD ["npm", "run", "dev"]

# ─── Production Stage ────────────────────────
FROM node:22-alpine AS production

WORKDIR /app

RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

COPY package.json package-lock.json* ./
RUN npm install --omit=dev --ignore-scripts

COPY --from=build /app/dist ./dist

RUN mkdir -p uploads && chown -R appuser:appgroup /app

USER appuser

EXPOSE 5000
CMD ["node", "dist/index.js"]
