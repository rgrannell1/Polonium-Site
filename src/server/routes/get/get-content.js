
const staticFiles = require('koa-static')
const constants = require('../../commons/constants')

module.exports = staticFiles(constants.paths.projectRoot, {})
