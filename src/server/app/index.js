
'use strict'

const fs = require('fs')
const Koa = require('koa')
const http2 = require('http2')
const router = require('koa-simple-router')

const constants = require('../commons/constants')
const bunyan = require('bunyan')
const config = require('config')

const log = bunyan.createLogger({
  name: constants.appName
})

const routes = { }

routes.setHTST = async (ctx, next) => {
  await next()
  ctx.set('Strict-Transport-Security', `max-age=${constants.timeouts.htst};`)
}

routes.getContent = async (ctx, next) => {
  ctx.body = 'asdasd'
  ctx.status = 200
  await next()
}

const routers = { }

routers.https = router(_ => {
  _.all('*', routes.setHTST)
  _.get('*', routes.getContent)
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
}
*/

http2.createSecureServer(certOptions, apps.https.callback())
  .listen(constants.ports.https)
