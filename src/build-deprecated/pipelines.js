
'use strict'

const models = require('./models')
const stages = require('./stages')
const events = require('events')

const pipelines = { }

pipelines.runLocalServer = models.Pipeline({
  title: 'Build Server',
  stages: [
    stages.cleanDistFolder,
    stages.buildDistFolder,
    stages.runLocalServer
  ]
})

pipelines.deployServer = models.Pipeline({
  title: 'Deploy Server',
  stages: [
    stages.cleanDistFolder,
    stages.createVM,
    stages.configureServer,
    stages.buildDistFolder,
    stages.publishDockerImage,
    stages.startServer
  ]
})

pipelines.openSSHTerminal = models.Pipeline({
  title: 'Open SSH Connection',
  stages: [
    stages.openSSHTerminal
  ]
})

pipelines.getSSLCertificate = models.Pipeline({
  title: 'Run Depcheck',
  stages: [
    stages.obtainCertificates
  ]
})

module.exports = pipelines
