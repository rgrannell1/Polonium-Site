
const {observations, timeouts} = require('../../commons/constants')
const facts = require('../../commons/facts')

/**
 *
 * Register the request fact.
 *
 */
module.exports = async (ctx, next) => {
  await next()
  ctx.set('Strict-Transport-Security', `max-age=${timeouts.htst};`)
}
