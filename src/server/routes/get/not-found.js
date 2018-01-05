
const {httpResponses} = require('@rgrannell1/utils')
require('mithril/test-utils/browserMock')(global)

const m = require('mithril')
const render = require('mithril-node-render')
const notFoundPage = require('../../../client/pages/default')

/**
 *
 * Response.
 *
 */
module.exports = async (ctx, next) => {
  if (httpResponses.is.NotFound(ctx)) {
    Object.assign(ctx, httpResponses.NotFound({
      body: await render(notFoundPage().view())
    }))
  }

  next()
}
