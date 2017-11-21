
const {Build} = require('../build-framework')
const tasks = require('./tasks')

const builds = { }

/**
 * Build the source-code into a single artifact folder.
 */
builds.buildDistFolder = new Build({
  title: 'Build the dist folder',
  tasks: [
    tasks.build.cleanDistFolder,
    tasks.build.buildDistFolder
  ]
})

/**
 * Run the Polonium Server locally.
 */
builds.runLocalServer = new Build({
  title: 'Run local instance of the server',
  tasks: [
    tasks.server.runLocalServer
  ]
})

/**
 * Deploy a server to DigitalOcean.
 */
builds.deployRemoteServer = new Build({
  title: 'Deploy to DigitalOcean',
  tasks: [
    tasks.build.cleanDistFolder,
    tasks.build.buildDistFolder,
    tasks.server.createVM,
    tasks.server.setupVM,
    tasks.security.getCerts,
    tasks.build.cleanDistFolder,
    tasks.build.buildDistFolder,
    tasks.docker.buildImage,
    tasks.docker.login,
    tasks.docker.publishImage,
    tasks.server.startServer,
    tasks.test.postDeployment
  ]
})

builds.openSSHTerminal = new Build({
  title: 'Open an SSH terminal to the DigitalOcean terminal',
  tasks: [
    tasks.security.openTerminal
  ]
})

builds.fetchSSLCertificate = new Build({
  title: 'Fetch LetsEncrypt SSL certificates for domain',
  tasks: []
})

builds.runDepcheck = new Build({
  title: 'Run depcheck',
  tasks: []
})

module.exports = builds
