
const builds = require('../builds')

const cli = { }

cli.deploy = {
  'server': builds.openSSHTerminal
}

cli.build = {
  'dist-folder': builds.buildDistFolder
}

cli.open = {
  'ssh-terminal': builds.openSSHTerminal
}

cli.deploy = {
  'server': builds.deployRemoteServer,
  'elasticsearch': builds.deployElasticSearch
}

cli.run = {
  'depcheck': builds.runDepcheck,
  'local-server': builds.runLocalServer,
  'local-infrastructure': builds.runLocalInfrastructure
}

cli.get = {
  'ssl-certificate': builds.fetchSSLCertificate
}

cli.publish = {
  'images': builds.deployLocalInfrastructure
}

module.exports = cli
