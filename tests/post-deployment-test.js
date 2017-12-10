
const request = require('request-promise')
const config = require('config')

class TestCase {
  constructor (config) {
    Object.assign(this, config)
  }
}

const cases = { }

cases.testEndpointStatus = new TestCase({
  description: 'Check the URL responds with the correct status-code',
  run: async () => {
    console.log(`https://${config.get('vm.subDomain')}.${config.get('vm.domain')}`)
    const res = await request({
      uri: `https://${config.get('vm.subDomain')}.${config.get('vm.domain')}`
    })

    if (res.statusCode !== 200) {
      throw new Error('unexpected status-code received')
    }
  }
})

function runCases () {
  cases.testEndpointStatus.run()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
}

module.exports = runCases
