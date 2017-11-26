
'use strict'

const fs = require('fs')
const Koa = require('koa')
const http2 = require('http2')
const router = require('koa-simple-router')
const compress = require('koa-compress')
const staticFiles = require('koa-static')
const constants = require('../commons/constants')
const entities = require('../schemas')
const facts = require('../commons/facts')
const config = require('config')

const routes = { }

/**
 *
 * Register the request fact.
 *
 */
routes.registerRequest = async (ctx, next) => {
  const requestData = entities.request({
    user: entities.user({
      ip: ctx.ip,
      agent: ctx.headers['user-agent']
    }),
    url: ctx.originalUrl,
    time: Date.now()
  })

  facts.note(requestData)
  await next()
}

routes.setHTST = async (ctx, next) => {
  await next()
  ctx.set('Strict-Transport-Security', `max-age=${constants.timeouts.htst};`)
}

routes.logging = async (ctx, next) => {
  await next()
}

routes.getContent = staticFiles(constants.paths.projectRoot, {})

routes.compress = compress({
  filter: contentType => true,
  threshold: 128,
  flush: require('zlib').Z_SYNC_FLUSH
})

routes.noContentFound = async (ctx, next) => {
  if (parseInt(ctx.status) === 404) {
    ctx.status = 404
    ctx.body = '<html>Oh no, an error</html>'
  }
}

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

/*
if (false) {
  certOptions.ca = fs.readFileSync(config.get('ssl.chain')).toString()
} */

const server = http2.createSecureServer(certOptions, apps.https.callback())
  .listen(constants.ports.https)

server.on('connection', socket => {
  socket.setNoDelay(true)
})
