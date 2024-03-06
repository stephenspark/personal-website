# Latest stable node on alpine image
FROM node:20.11.1-alpine AS builder

WORKDIR /app

COPY package.json .

RUN npm install --silent && \
    npm install react-scripts@5.0.1 -g --silent

COPY . .

RUN npm run build

FROM nginx:1.25.4-alpine AS production
ENV NODE_ENV production

COPY --from=builder /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
