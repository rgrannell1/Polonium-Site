
const events = require('events')
const util = require('util')
const {logger} = require('./logging')

const facts = {}

const streams = {}
streams.facts = new events.EventEmitter()

facts.note = entity => {
  streams.facts.emit('note', entity)
}

const log = logger()

/**
 * Log all entities to a file.
 */
streams.facts.on('note', entity => {
  log.info(entity)
})

/*
 * higher-order facts
 */

module.exports = facts
