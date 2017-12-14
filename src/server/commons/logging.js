
const bunyan = require('bunyan')
const constants = require('./constants')
const stream = require('stream')
const elasticsearch = require('elasticsearch')
const moment = require('moment')

const logStream = ({host}) => {
  const client = new elasticsearch.Client({host, log: null})

  return new stream.Writable({
    objectMode: true,
    write (log, encoding, next) {
      const body = Object.assign({time: Date.now()}, JSON.parse(log))
      const index = 'logs'

      client.index({index, type: 'logs', body}, (err, res) => {
        if (err) {
          this.emit('error', err)
        }
        next()
      })
    }
  })
}

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
        stream: logStream({host: 'localhost:9200'}).on('error', err => {
          console.error(err)
        })
      },
      {
        level: bunyan.TRACE,
        path: constants.paths.logs
      }
    ]
  })
}

module.exports = logging
