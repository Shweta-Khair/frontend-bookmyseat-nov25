# ---------- Stage 1: Build Angular App ----------
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build Angular app
COPY . .
RUN npm run build -- --configuration=production

# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:alpine

# Copy the built Angular app from the build stage
COPY --from=build /app/dist/frontend-service/browser /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the environment template JS (for runtime injection)
COPY env.template.js /usr/share/nginx/html/assets/env.js

# Replace environment variables in env.js at container startup
# This makes it possible to inject backend URLs dynamically
CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/assets/env.js > /usr/share/nginx/html/assets/env.js && nginx -g 'daemon off;'"]

EXPOSE 80

