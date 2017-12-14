
const compress = require('koa-compress')

module.exports = compress({
  filter: contentType => true,
  threshold: 128,
  flush: require('zlib').Z_SYNC_FLUSH
})
