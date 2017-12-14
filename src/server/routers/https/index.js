
const router = require('koa-simple-router')
const routes = require('../../routes')

const https = router(_ => {
  _.all('*', routes.use.registerRequest)
  _.all('*', routes.use.setHTST)
  _.all('*', routes.use.compress)
  _.get('*', routes.get.getContent)
  _.get('*', routes.get.notFound)
})

module.exports = https
