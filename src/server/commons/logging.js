
const config = require('config')
const bunyan = require('bunyan')
const constants = require('./constants')
const stream = require('stream')
const Elasticsearch = require('@rgrannell1/utils').elasticsearch

/**
 *
 * @param {object} config supplied configuration.
 * @param {string} config.host the protocol+domain+port to connect to.
 *
 * @return {Writeable} a writeable stream.
 *
 */
const logStream = ({host}) => {
  const client = new Elasticsearch({host})

  return new stream.Writable({
    objectMode: true,
    write (log, encoding, next) {
      const body = Object.assign({time: Date.now()}, JSON.parse(log))
      const index = 'logs'

      client.index({index, type: 'logs', body})
        .then(() => {
          next()
        })
        .catch(err => {
          this.emit('error', err)
          next()
        })
    }
  })
}

const logging = {}

/**
 * create a stdout + elasticsearch logger.
 *
 * @return {bunyanLogger} a logger instance.
 *
 */
logging.logger = () => {
  return bunyan.createLogger({
    name: constants.appName,
    streams: [
      {
        level: bunyan.TRACE,
        stream: process.stdout
      },
      {
        stream: logStream({host: config.get('elasticsearch.url')})
          .on('error', err => {
            console.error(err)
          })
      }
    ]
  })
}

module.exports = logging
