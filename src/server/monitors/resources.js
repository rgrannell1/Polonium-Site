
const facts = require('../commons/facts')
const entities = require('../commons/entities')
const constants = require('../commons/constants')

const monitorResources = () => {
  const pid = setInterval(async () => {
    facts.note(entities.MonitorStatus({
      ctx: {
        memory: process.memoryUsage()
      }
    }))
  }, 5000)
  return pid
}

module.exports = monitorResources
