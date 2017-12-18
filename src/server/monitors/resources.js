
const facts = require('../commons/facts')
const entities = require('../commons/entities')
const constants = require('../commons/constants')

const monitorResources = () => {
  const pid = setInterval(async () => {
    const usage = process.memoryUsage()
    facts.note(entities.MonitorStatus({
      ctx: {
        memory: {
          heapTotalMB: usage.heapTotal / 1e6,
          heapUsedMB: usage.heapUsed / 1e6,
          externalMB: usage.external / 1e6
        }
      }
    }))
  }, 5000)
  return pid
}

module.exports = monitorResources
