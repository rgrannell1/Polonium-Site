
'use strict'

const fs = require('fs')
const Koa = require('koa')
const http2 = require('http2')
const router = require('koa-simple-router')
const constants = require('../commons/constants')
const routes = require('../routes')
const config = require('config')

const routers = { }

routers.https = router(_ => {
  _.all('*', routes.registerRequest)
  _.all('*', routes.setHTST)
  _.all('*', routes.compress)
  _.get('*', routes.getContent)
  _.get('*', routes.noContentFound)
  _.post('/log', routes.logging)
})

const apps = {
  http: new Koa(),
  https: new Koa()
}

apps.https
  .use(routers.https)

const certOptions = {
  key: fs.readFileSync(config.get('ssl.privateKey')).toString(),
  cert: fs.readFileSync(config.get('ssl.cert')).toString()
}

if (config.get('ssl.chain')) {
  certOptions.ca = fs.readFileSync(config.get('ssl.chain')).toString()
}

const server = http2.createSecureServer(certOptions, apps.https.callback())
  .listen(constants.ports.https)

server.on('connection', socket => {
  socket.setNoDelay(true)
})
