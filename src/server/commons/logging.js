
const bunyan = require('bunyan')
const constants = require('./constants')

const logging = {}

logging.logger = () => {
  return bunyan.createLogger({
    name: constants.appName,
    streams: [
      {
        level: bunyan.TRACE,
        stream: process.stdout
      },
      {
        level: bunyan.TRACE,
        path: constants.paths.logs
      }
    ]
  })
}

module.exports = logging
