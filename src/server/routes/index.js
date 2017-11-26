
'use strict'

const compress = require('koa-compress')
const staticFiles = require('koa-static')
const constants = require('../commons/constants')
const entities = require('../schemas')
const facts = require('../commons/facts')

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

module.exports = routes
