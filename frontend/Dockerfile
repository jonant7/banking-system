FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --silent

COPY . .

RUN npm run build -- --configuration production

FROM nginx:1.25-alpine AS production

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist/banking-fronted/browser /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
