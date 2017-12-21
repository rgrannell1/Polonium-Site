
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
      host: 'http://polonium_elasticsearch:9200'
    })
    try {
      const status = await client.health()
      let statusDescription = ''

      if (status.status === 'green') {
        statusDescription = constants.statuses.FUNCTIONAL
      } else if (status.status === 'yellow') {
        statusDescription = constants.statuses.IMPARED
      } else if (status.status === 'red') {
        statusDescription = constants.statuses.NOT_FUNCTIONAL
      }

      facts.note(entities.MonitorStatus({
        ctx: {status},
        name: constants.monitorNames.elasticsearchHealth,
        status: statusDescription
      }))
    } catch (err) {
      facts.note(entities.MonitorStatus({
        ctx: {err},
        name: constants.monitorNames.elasticsearchHealth,
        status: constants.statuses.NOT_FUNCTIONAL
      }))
    }
  }, constants.intervals.monitorElasticsearch)
  return pid
}

module.exports = monitorElasticsearch
