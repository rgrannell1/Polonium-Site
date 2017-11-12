
'use strict'

const fs = require('fs')
const Koa = require('koa')
const Router = require('koa-router')
const http2 = require('http2')

const constants = require('../commons/constants')
const bunyan = require('bunyan')
const config = require('config')

const log = bunyan.createLogger({
  name: constants.appName
})

const routes = { }

routes.setHTST = async (ctx, next) => {
  ctx.setHeader('Strict-Transport-Security', `max-age=${constants.timeouts.htst};`)
  await next()
}

routes.getContent = async (ctx, next) => {
  ctx.body = 'aasdasdaasdASD'
  ctx.status = 200
  await next()
}

const apps = {
  http: new Koa(),
  https: new Koa()
}

const routers = {
  https: new Router()
}

routers.https
  .use(routes.setHTST)
  .use(routes.getContent)

apps.https
  .use(routers.https.routes())
  .use(routers.https.allowedMethods())

const certOptions = {
  key: fs.readFileSync(config.get('ssl.privateKey')).toString(),
  cert: fs.readFileSync(config.get('ssl.cert')).toString()
}

/*
if (false) {
  certOptions.ca = fs.readFileSync(config.get('ssl.chain')).toString()
}
*/

http2.createSecureServer(certOptions, apps.https.callback())
  .listen(constants.ports.https)
