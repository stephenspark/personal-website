# Latest stable node on alpine image
FROM node:20.11.1-alpine

WORKDIR /app

COPY package.json .

RUN npm install --silent && \
    npm install react-scripts@5.0.1 -g --silent

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
