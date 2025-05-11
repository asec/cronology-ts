FROM node:22.15.0-alpine3.21

WORKDIR /app
COPY ./package.json ./package.json
RUN npm install --omit=dev
RUN npm install typescript
COPY . .
RUN rm -rf ./docker ./tests
RUN npx tsc
RUN rm -rf src
RUN npm uninstall typescript
ENTRYPOINT ["node", "./dist/api", "server-start"]