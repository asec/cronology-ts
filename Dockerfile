FROM node:22.15.0-alpine3.21

WORKDIR /app
COPY ./package.json ./package.json
RUN npm install
COPY . .
RUN npx tsc
ENTRYPOINT ["node", "./dist/api", "server-start"]