
const {Build} = require('../build-framework')
const tasks = require('./tasks')
const path = require('path')

const PROJECT_PATH = path.join(__dirname, '../..')
const CLIENT_PATH = path.join(PROJECT_PATH, 'src/client')
const SERVER_PATH = path.join(PROJECT_PATH, 'src/server')
const DIST_PATH = path.join(PROJECT_PATH, 'dist')

const builds = { }

builds.buildDistFolder = new Build({
  title: 'Build the dist folder',
  tasks: [
    tasks.build.cleanDistFolder,
    tasks.build.buildDistFolder
  ],
  watch: {
    folder: SERVER_PATH
  }
})

builds.runLocalServer = new Build({
  title: 'Run local instance of the server',
  tasks: [
    tasks.build.cleanDistFolder,
    tasks.build.buildDistFolder,
    tasks.server.runLocalServer
  ]
})

builds.deployRemoteServer = new Build({
  title: 'Deploy to DigitalOcean',
  tasks: [
    tasks.build.cleanDistFolder,
    tasks.build.buildDistFolder
  ]
})

builds.openSSHTerminal = new Build({
  title: 'Open an SSH terminal to the DigitalOcean terminal',
  tasks: []
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
