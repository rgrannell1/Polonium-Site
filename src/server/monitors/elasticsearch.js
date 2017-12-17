
const Elasticsearch = require('@rgrannell1/utils').elasticsearch
const facts = require('../commons/facts')
const entities = require('../commons/entities')
const constants = require('../commons/constants')

/**
 * Monitor ElasticSearch status over time
 *
 * @return {number} the PID of the monitoring processs.
 */
const monitorElasticsearch = () => {
  const pid = setInterval(async () => {
    const client = new Elasticsearch({
      host: 'http://localhost:9200'
    })
    try {
      const status = await client.health()
      facts.note(entities.MonitorStatus({
        ctx: {status},
        name: 'elasticsearch-health',
        status: 'ok'
      }))
    } catch (err) {
      facts.note(entities.MonitorStatus({
        ctx: {err},
        name: 'elasticsearch-health',
        status: 'not_ok'
      }))
    }
  }, constants.intervals.monitorElasticsearch)
  return pid
}

module.exports = monitorElasticsearch
