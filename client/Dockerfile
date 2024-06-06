FROM node:20.14 AS base

RUN mkdir -p /home/vite/app
RUN npm config set cache /tmp --global
WORKDIR /home/vite
COPY .env ./

WORKDIR /home/vite/app
COPY ./client/package.json ./client/package-lock.json ./
RUN npm ci

COPY client ./

RUN npm run build

# Run stage
FROM nginx:1.23.2-alpine
COPY --from=base /home/vite/app/dist /var/www/app
COPY ./infra/nginx/conf/ /etc/nginx/conf.d
EXPOSE 80 443