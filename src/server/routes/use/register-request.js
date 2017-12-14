
const {observations} = require('../../commons/constants')
const facts = require('../../commons/facts')

/**
 *
 * Register the request fact.
 *
 */
module.exports = async (ctx, next) => {
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
