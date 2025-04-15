ARG node_version

FROM node:${node_version}

WORKDIR /app

COPY ./package.json ./package.json

RUN npm install

COPY . .

COPY ./docker/.env.* ./

COPY ./docker/docker-test.sh /usr/local/bin/docker-test

RUN rm -rf ./docker

RUN npx tsc

ENTRYPOINT ["docker-test"]