
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
  'server': builds.deployRemoteServer
}

cli.run = {
  'depcheck': builds.runDepcheck,
  'local-server': builds.runLocalServer
}

cli.get = {
  'ssl-certificate': builds.fetchSSLCertificate
}

module.exports = cli