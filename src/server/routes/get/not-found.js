
module.exports = async (ctx, next) => {
  if (parseInt(ctx.status) === 404) {
    ctx.status = 404
    ctx.body = '<html>Oh no, an error</html>'
  }
}
