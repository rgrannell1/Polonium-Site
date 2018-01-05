
'use strict'

const primary = require('./primary-new')
const settings = require('./settings')
const about = require('./about')

module.exports = {
  '/': primary({ }),
  '/about': about(),
  '/settings': settings()
}
