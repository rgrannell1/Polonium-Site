FROM ubuntu
LABEL maintainer="Ryan Grannell <r.grannell2@gmail.com>"

RUN mkdir -p /usr/local/app/src
WORKDIR /usr/local/app

RUN apt-get update && apt-get install -y curl git
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get update && apt-get install --assume-yes nodejs
RUN npm install --global yarn

ADD dist /usr/local/app/dist
RUN cd dist && yarn install

CMD node dist/server/app/index.js
