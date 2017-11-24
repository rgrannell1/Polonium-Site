
const Rx = require('rxjs')
const util = require('util')
const {logger} = require('./logging')

const facts = {}

const streams = {}
streams.facts = new Rx.Subject()

facts.note = entity => {
  streams.facts.next(entity)
}

const log = logger()

/**
 * Log all entities to a file.
 */
streams.facts.subscribe(entity => {
  log.info(entity)
})

/*
 * higher-order facts
 */

module.exports = facts
