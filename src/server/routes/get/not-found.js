
const {httpResponses} = require('@rgrannell1/utils')

/**
 *
 * Response.
 *
 */
module.exports = async (ctx, next) => {
  if (httpResponses.is.NotFound(ctx)) {
    const err = httpResponses.NotFound({
      body: '<html>Oh no, an error</html>'
    })

    Object.assign(ctx, err)
  }
}
