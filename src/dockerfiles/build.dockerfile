FROM ubuntu
LABEL maintainer="Ryan Grannell <r.grannell2@gmail.com>"
EXPOSE 8080

ENV NODE_CONFIG_DIR=/usr/local/app/dist/config
ENV NODE_ENV=production

RUN mkdir -p /usr/local/app/src
WORKDIR /usr/local/app

RUN apt-get update && apt-get install -y curl git snapd
RUN curl -sL https://deb.nodesource.com/setup_9.x | bash -
RUN apt-get update && apt-get install --assume-yes nodejs letsencrypt
RUN npm install --global yarn

ADD dist /usr/local/app/dist
RUN cd /usr/local/app/dist/ && yarn install
RUN mkdir -p /usr/local/app/dist/client/.well-known/acme-challenge

RUN mkdir /etc/letsencrypt/archive/polonium.rgrannell.world -p
# RUN snap install micro --classic

COPY config/credentials/certs /etc/letsencrypt/archive/polonium.rgrannell.world

CMD node dist/server/app/index.js
