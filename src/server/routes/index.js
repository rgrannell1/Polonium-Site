
'use strict'

const compress = require('koa-compress')
const staticFiles = require('koa-static')
const constants = require('../commons/constants')
const facts = require('../commons/facts')
const {logger} = require('../commons/logging')

const routes = { }

const observations = {
  REQUEST_MADE: 'REQUEST_MADE',
  USER_INTERACTION: 'USER_INTERACTION',
  USER_REQUEST_MADE: 'USER_REQUEST_MADE',
  types: {
    DIRECT: 'direct'
  }
}

/**
 *
 * Register the request fact.
 *
 */
routes.registerRequest = async (ctx, next) => {
  const data = {
    user: {
      ip: ctx.ip,
      agent: ctx.headers['user-agent']
    },
    request: {
      url: ctx.originalUrl,
      time: Date.now()
    }
  }

  facts.note(Object.assign(data.user, {
    ctx: {
      observation: observations.USER_INTERACTION,
      type: observations.types.DIRECT
    }
  }))

  facts.note(Object.assign(data.request, {
    ctx: {
      observation: observations.REQUEST_MADE,
      type: observations.types.DIRECT
    }
  }))

  facts.note(Object.assign({ }, {
    user: data.user,
    request: data.request,
    ctx: {
      observation: observations.USER_REQUEST_MADE,
      type: observations.types.DIRECT
    }
  }))

  ctx.state.user = data.user
  ctx.state.request = data.request

  await next()
}

routes.setHTST = async (ctx, next) => {
  await next()
  ctx.set('Strict-Transport-Security', `max-age=${constants.timeouts.htst};`)
}

routes.logging = async (ctx, next) => {
  logger.info({
    url: ctx.url,
    ips: ctx.ips,
    method: ctx.method0
  })
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
