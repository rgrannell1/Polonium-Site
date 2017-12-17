
const uuidv4 = require('uuid/v4')

const {observations, subsystems} = require('../../commons/constants')
const facts = require('../../commons/facts')

/**
 *
 * Register the request fact.
 *
 */
module.exports = async (ctx, next) => {
  ctx.state.session = {
    id: uuidv4(),
    environment: process.env.NODE_ENV || 'development',
    platform: process.env.platform,
    arch: process.env.arch,
    version: process.version
  }

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
      type: observations.types.DIRECT,
      session: ctx.state.session
    }
  }))

  facts.note(Object.assign(data.request, {
    ctx: {
      observation: observations.REQUEST_MADE,
      type: observations.types.DIRECT,
      session: ctx.state.session
    }
  }))

  facts.note(Object.assign({ }, {
    user: data.user,
    request: data.request,
    ctx: {
      observation: observations.USER_REQUEST_MADE,
      type: observations.types.DIRECT,
      session: ctx.state.session
    }
  }))

  ctx.state.user = data.user
  ctx.state.request = data.request

  await next()
}
