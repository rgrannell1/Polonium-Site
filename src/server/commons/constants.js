
const path = require('path')

module.exports = {
  appName: 'polonium',
  paths: {
    projectRoot: path.resolve(__dirname, '../../client'),
    logs: path.resolve(__dirname, '../../server-logs.log.jsonl')
  },
  ports: {
    http: 8080,
    https: 8081
  },
  timeouts: {
    htst: 31536000 // seconds.
  }
}
