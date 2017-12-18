
const facts = require('../commons/facts')
const entities = require('../commons/entities')
const constants = require('../commons/constants')
/**
 * monitor resource usage of node process.
 * @return {number} an interval id.
 */
const monitorResources = () => {
  const pid = setInterval(async () => {
    const usage = process.memoryUsage()
    facts.note(entities.MonitorStatus({
      ctx: {
        memory: {
          heapTotalMB: usage.heapTotal / 1e6,
          heapUsedMB: usage.heapUsed / 1e6,
          externalMB: usage.external / 1e6
        },
        status: constants.statuses.FUNCTIONAL
      }
    }))
  }, 5000)
  return pid
}

module.exports = monitorResources
