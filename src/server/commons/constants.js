
const path = require('path')

const constants = {}
constants.appName = 'polonium'

constants.paths = {
  projectRoot: path.resolve(__dirname, '../../client'),
  logs: path.resolve(__dirname, '../../server-logs.log.jsonl')
}
constants.ports = {
  http: 8080,
  https: 8081
}
constants.timeouts = {
  htst: 31536000 // seconds.
}
constants.intervals = {
  monitorElasticsearch: 5000
}
constants.observations = {
  REQUEST_RECEIVED: 'REQUEST_RECEIVED',
  USER_INTERACTION: 'USER_INTERACTION',
  USER_REQUEST_MADE: 'USER_REQUEST_MADE',
  CONNECTION_CLOSED: 'CONNECTION_CLOSED',
  CONNECTION_UPGRADE: 'CONNECTION_UPGRADE',
  types: {
    DIRECT: 'direct'
  }
}

constants.monitorNames = {
  elasticsearchHealth: 'elasticsearch-health'
}

constants.subsystems = {
  LOGGING: 'logging'
}

constants.statuses = {
  FUNCTIONAL: 'ok',
  NOT_FUNCTIONAL: 'not_functional',
  IMPARED: 'impared'

}

module.exports = constants
